"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var morgan_1 = require("morgan");
var data_source_1 = require("./data-source");
var mongodb_1 = require("mongodb");
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// GET all messages
app.get('/api/messages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, messages, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, data_source_1.getDb)()];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.collection('messages').find().toArray()];
            case 2:
                messages = _a.sent();
                res.json(messages);
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.status(500).json({ error: 'Failed to fetch messages' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// POST a new message
app.post('/api/messages', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                console.log('Received form data:', req.body);
                return [4 /*yield*/, (0, data_source_1.getDb)()];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.collection('messages').insertOne(req.body)];
            case 2:
                result = _a.sent();
                console.log('Saved to database with ID:', result.insertedId);
                res.status(201).json(__assign({ _id: result.insertedId }, req.body));
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('Error saving message:', error_2);
                res.status(500).json({ error: 'Failed to create message' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// GET message by ID
app.get('/api/messages/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, message, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, data_source_1.getDb)()];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.collection('messages').findOne({ _id: new mongodb_1.ObjectId(req.params.id) })];
            case 2:
                message = _a.sent();
                if (!message) {
                    return [2 /*return*/, res.status(404).json({ error: 'Message not found' })];
                }
                res.json(message);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500).json({ error: 'Failed to fetch message' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// UPDATE message by ID
app.put('/api/messages/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, result, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, data_source_1.getDb)()];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.collection('messages').updateOne({ _id: new mongodb_1.ObjectId(req.params.id) }, { $set: req.body })];
            case 2:
                result = _a.sent();
                if (result.matchedCount === 0) {
                    return [2 /*return*/, res.status(404).json({ error: 'Message not found' })];
                }
                res.json(__assign({ _id: req.params.id }, req.body));
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                res.status(500).json({ error: 'Failed to update message' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// DELETE message by ID
app.delete('/api/messages/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var db, result, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, data_source_1.getDb)()];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.collection('messages').deleteOne({ _id: new mongodb_1.ObjectId(req.params.id) })];
            case 2:
                result = _a.sent();
                if (result.deletedCount === 0) {
                    return [2 /*return*/, res.status(404).json({ error: 'Message not found' })];
                }
                res.json({ message: 'Message deleted successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                res.status(500).json({ error: 'Failed to delete message' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Start server
app.listen(3000, function () { return __awaiter(void 0, void 0, void 0, function () {
    var db, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, data_source_1.getDb)()];
            case 1:
                db = _a.sent();
                return [4 /*yield*/, db.command({ ping: 1 })];
            case 2:
                _a.sent();
                console.log('Successfully connected to MongoDB');
                console.log('Database name:', db.databaseName);
                console.log('Server is running on port 3000');
                return [3 /*break*/, 4];
            case 3:
                error_6 = _a.sent();
                console.error('Failed to connect to MongoDB:', error_6);
                process.exit(1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, data_source_1.mongoClient.close()];
            case 1:
                _a.sent();
                process.exit();
                return [2 /*return*/];
        }
    });
}); });
