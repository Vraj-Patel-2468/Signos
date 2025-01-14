import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/manageToken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = verifyToken(token) as { email: string, id: number };
        req.body.id = decoded.id;
        req.body.email = decoded.email;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}