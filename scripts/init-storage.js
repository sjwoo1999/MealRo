const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 1. Load Environment Variables from .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
let envContent;
try {
    envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
    console.error('❌ Could not find .env.local file at:', envPath);
    console.error('Please make sure you are running this from the project root or scripts folder.');
    process.exit(1);
}

const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let value = match[2].trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        env[match[1].trim()] = value;
    }
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing Supabase credentials in .env.local');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

// 2. Initialize Supabase Admin Client
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function initStorage() {
    console.log('🔄 Checking Storage Buckets...');

    const BUCKET_NAME = 'food-images';

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error('❌ Failed to list buckets:', listError.message);
        process.exit(1);
    }

    const existingBucket = buckets.find(b => b.name === BUCKET_NAME);

    if (existingBucket) {
        console.log(`✅ Bucket '${BUCKET_NAME}' already exists.`);
    } else {
        console.log(`⚠️ Bucket '${BUCKET_NAME}' not found. Creating...`);

        const { data, error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true, // Make it public for easy access
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
        });

        if (createError) {
            console.error(`❌ Failed to create bucket '${BUCKET_NAME}':`, createError.message);
            process.exit(1);
        }

        console.log(`✅ Successfully created public bucket: '${BUCKET_NAME}'`);
    }

    console.log('\n🎉 Storage setup complete!');
}

initStorage().catch(err => {
    console.error('❌ Unexpected error:', err);
});
