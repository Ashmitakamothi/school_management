import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env');
    process.exit(1);
}

async function checkCollections() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB.');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();

        console.log(`Total Collections: ${collections.length}`);

        // Group by prefix (assuming some naming convention like 'school_' or similar)
        const groups = {};
        collections.forEach(c => {
            const prefix = c.name.split('_')[0] || 'other';
            groups[prefix] = (groups[prefix] || 0) + 1;
        });

        console.log('\nCollection counts by prefix:');
        console.table(groups);

        console.log('\nTop 20 collections:');
        console.log(collections.slice(0, 20).map(c => c.name).join(', '));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkCollections();
