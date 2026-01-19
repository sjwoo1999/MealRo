import Dexie, { Table } from 'dexie';

export interface OfflineMeal {
    id?: number;
    name: string;
    calories: number;
    image_url?: string;
    timestamp: Date;
    synced: boolean;
    food_data?: any; // Store full analysis JSON
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
            meals: '++id, timestamp, synced',
            settings: 'key'
        });
        // Version 2 upgrade if needed in future
    }
}

export const db = new MealRoDB();
