import { Request, Response, NextFunction } from 'express';

export const validateMessageInput = (req: Request, res: Response, next: NextFunction) => {
    const errors: Record<string, string> = {};
    
    if (!req.body.title?.trim()) {
        errors.title = 'Title is required';
    }
    
    if (!req.body.content?.trim()) {
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
