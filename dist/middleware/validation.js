"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMessageInput = void 0;
const validateMessageInput = (req, res, next) => {
    var _a, _b;
    const errors = {};
    if (!((_a = req.body.title) === null || _a === void 0 ? void 0 : _a.trim())) {
        errors.title = 'Title is required';
    }
    if (!((_b = req.body.content) === null || _b === void 0 ? void 0 : _b.trim())) {
        errors.content = 'Content is required';
    }
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors
        });
    }
    next();
};
exports.validateMessageInput = validateMessageInput;
