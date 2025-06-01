import { Request, Response } from 'express';

export interface Provider {
    callback(): (req: Request, res: Response) => void;
    [key: string]: any;
} 