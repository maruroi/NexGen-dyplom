import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017/NexGendb';
const dbName = 'NexGendb';

export const mongoClient = new MongoClient(url);
export const getDb = async () => {
    if (!mongoClient.connect()) {
        await mongoClient.connect();
    }
    return mongoClient.db(dbName);
};
