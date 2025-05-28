"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const data_source_1 = require("./data-source");
const mongodb_1 = require("mongodb");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// GET all messages
app.get('/api/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, data_source_1.getDb)();
        const messages = yield db.collection('messages').find().toArray();
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
}));
// POST a new message
app.post('/api/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Received form data:', req.body);
        const db = yield (0, data_source_1.getDb)();
        const result = yield db.collection('messages').insertOne(req.body);
        console.log('Saved to database with ID:', result.insertedId);
        res.status(201).json(Object.assign({ _id: result.insertedId }, req.body));
    }
    catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to create message' });
    }
}));
// GET message by ID
app.get('/api/messages/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, data_source_1.getDb)();
        const message = yield db.collection('messages').findOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json(message);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch message' });
    }
}));
// UPDATE message by ID
app.put('/api/messages/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, data_source_1.getDb)();
        const result = yield db.collection('messages').updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, { $set: req.body });
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json(Object.assign({ _id: req.params.id }, req.body));
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update message' });
    }
}));
// DELETE message by ID
app.delete('/api/messages/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, data_source_1.getDb)();
        const result = yield db.collection('messages').deleteOne({ _id: new mongodb_1.ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.json({ message: 'Message deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
}));
// Start server
app.listen(3000, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const db = yield (0, data_source_1.getDb)();
        yield db.command({ ping: 1 });
        console.log('Successfully connected to MongoDB');
        console.log('Database name:', db.databaseName);
        console.log('Server is running on port 3000');
    }
    catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}));
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield data_source_1.mongoClient.close();
    process.exit();
}));
