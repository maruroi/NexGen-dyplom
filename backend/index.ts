import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { mongoClient, getDb } from './data-source';
import { ObjectId } from 'mongodb';
import { UserMessage } from './entity/user-message.entity';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET all messages
app.get('/api/messages', async (req: Request, res: Response) => {
    try {
        const db = await getDb();
        const messages = await db.collection('messages').find().toArray();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// POST a new message
app.post('/api/messages', async (req: Request, res: Response) => {
    try {
        console.log('Received form data:', req.body);
        const db = await getDb();
        const result = await db.collection('messages').insertOne(req.body);
        console.log('Saved to database with ID:', result.insertedId);
        res.status(201).json({ _id: result.insertedId, ...req.body });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to create message' });
    }
});

// GET message by ID
app.get('/api/messages/:id', async (req: Request, res: Response) => {
    try {
        const db = await getDb();
        const message = await db.collection('messages').findOne({ _id: new ObjectId(req.params.id) });
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch message' });
    }
});

// UPDATE message by ID
app.put('/api/messages/:id', async (req: Request, res: Response) => {
    try {
        const db = await getDb();
        const result = await db.collection('messages').updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json({ _id: req.params.id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update message' });
    }
});

// DELETE message by ID
app.delete('/api/messages/:id', async (req: Request, res: Response) => {
    try {
        const db = await getDb();
        const result = await db.collection('messages').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

// Start server
app.listen(3000, async () => {
    try {
        const db = await getDb();
        await db.command({ ping: 1 });
        console.log('Successfully connected to MongoDB');
        console.log('Database name:', db.databaseName);
        console.log('Server is running on port 3000');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
});

process.on('SIGINT', async () => {
    await mongoClient.close();
    process.exit();
});
