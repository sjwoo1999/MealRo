import { createClient } from './supabase/client';
import { getAnonymousUserId } from './userId';
import { EventType, MealType } from './supabase/types';

type EventMetadata = Record<string, unknown>;

interface TrackEventParams {
    eventType: EventType;
    route: string;
    mealType?: MealType | null;
    itemId?: string | null;
    metadata?: EventMetadata;
}

/**
 * Track an analytics event to Supabase events table
 * All events are anonymous (no PII collected)
 */
export async function trackEvent({
    eventType,
    route,
    mealType = null,
    itemId = null,
    metadata = {},
}: TrackEventParams): Promise<void> {
    try {
        const supabase = createClient();
        const anonymousUserId = getAnonymousUserId();

        // Skip if no user ID (server-side or privacy mode)
        if (!anonymousUserId) {
            console.warn('Analytics: No anonymous user ID, skipping event');
            return;
        }

        const eventData = {
            anonymous_user_id: anonymousUserId,
            event_type: eventType,
            route,
            meal_type: mealType,
            item_id: itemId,
            metadata,
        };

        // Use type assertion since Supabase client doesn't have schema info at runtime
        const { error } = await supabase.from('events').insert(eventData as never);

        if (error) {
            console.error('Analytics: Failed to track event', error);
        }
    } catch (err) {
        // Silently fail - analytics should not break user experience
        console.error('Analytics: Error tracking event', err);
    }
}

// Convenience functions for common events

export function trackPageView(route: string) {
    return trackEvent({
        eventType: 'page_view',
        route,
    });
}

export function trackMealSelected(route: string, mealType: MealType) {
    return trackEvent({
        eventType: 'meal_selected',
        route,
        mealType,
    });
}

export function trackItemImpression(route: string, itemId: string, mealType?: MealType) {
    return trackEvent({
        eventType: 'item_impression',
        route,
        itemId,
        mealType,
    });
}

export function trackItemClick(route: string, itemId: string, mealType?: MealType) {
    return trackEvent({
        eventType: 'item_click',
        route,
        itemId,
        mealType,
    });
}

export function trackBridgeView(route: string, itemId: string) {
    return trackEvent({
        eventType: 'bridge_view',
        route,
        itemId,
    });
}

export function trackExternalLinkClick(
    route: string,
    itemId: string,
    destination: string
) {
    return trackEvent({
        eventType: 'external_link_click',
        route,
        itemId,
        metadata: { destination },
    });
}

export function trackFilterApplied(
    route: string,
    filterType: string,
    value: string | boolean,
    mealType?: MealType
) {
    return trackEvent({
        eventType: 'filter_applied',
        route,
        mealType,
        metadata: { filter_type: filterType, value },
    });
}

export function trackExcludedItemEncountered(
    route: string,
    itemId: string,
    reason: string
) {
    return trackEvent({
        eventType: 'excluded_item_encountered',
        route,
        itemId,
        metadata: { reason },
    });
}
