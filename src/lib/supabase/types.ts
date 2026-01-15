// Database types generated from Supabase schema
// These types provide type-safety for all database operations

export type MealType = 'breakfast' | 'lunch' | 'dinner';
export type Grade = 'A' | 'B' | 'C' | 'D';

export type MenuItem = {
    id: string;
    name: string;
    meal_type: MealType;
    category: string;
    food_group: string;
    is_allowed: boolean;
    exclusion_reason: string | null;
    created_at: string;
    updated_at: string;
};

export type NutritionGroupAvg = {
    food_group: string;
    kcal_per_100g: number;
    protein_per_100g: number;
    carbs_per_100g: number;
    fat_per_100g: number;
};

export type EventType =
    | 'page_view'
    | 'meal_selected'
    | 'item_impression'
    | 'item_click'
    | 'bridge_view'
    | 'external_link_click'
    | 'filter_applied'
    | 'excluded_item_encountered';

export type Event = {
    id: string;
    anonymous_user_id: string;
    event_type: EventType;
    route: string;
    meal_type: MealType | null;
    item_id: string | null;
    metadata: Record<string, unknown>;
    created_at: string;
};

// Joined type for menu items with nutrition data
export type MenuItemWithNutrition = MenuItem & {
    nutrition: NutritionGroupAvg | null;
    grade: Grade;
};

// Database schema interface for Supabase client
export interface Database {
    public: {
        Tables: {
            menu_items: {
                Row: MenuItem;
                Insert: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>>;
            };
            nutrition_group_avg: {
                Row: NutritionGroupAvg;
                Insert: NutritionGroupAvg;
                Update: Partial<NutritionGroupAvg>;
            };
            events: {
                Row: Event;
                Insert: Omit<Event, 'id' | 'created_at'>;
                Update: Partial<Omit<Event, 'id' | 'created_at'>>;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
    };
}
