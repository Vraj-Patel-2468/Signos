import {Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/manageToken";

export default function authMiddleware (req: Request, res: Response, next: NextFunction) : void
{
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({message: "Unauthorized"});
        return;
    }
    try {
        const decoded = verifyToken(token) as { email: string, id: number };
        req.body.id = decoded.id;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({message: "Unauthorized"});
        return;
    }
}