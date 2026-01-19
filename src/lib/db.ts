import Dexie, { Table } from 'dexie';

export interface OfflineMeal {
    id?: number; // Auto-incremented ID
    name: string;
    calories: number;
    image_url?: string;
    timestamp: Date;
    synced: boolean; // True if synced to Supabase
}

export interface UserSettings {
    key: string;
    value: any;
}

export class MealRoDB extends Dexie {
    meals!: Table<OfflineMeal>;
    settings!: Table<UserSettings>;

    constructor() {
        super('MealRoDB');
        this.version(1).stores({
            meals: '++id, timestamp, synced', // Primary key and indexes
            settings: 'key' // Key-value store for settings
        });
    }
}

export const db = new MealRoDB();
