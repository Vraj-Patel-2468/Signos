import { sign, verify } from "jsonwebtoken";

export function generateToken(email: string, id: number) {
    const token = sign({ email, id }, process.env.JWT_SECRET || "secret", { expiresIn: "1w" });
    return token;
}

export function verifyToken(token: string) {
    const decoded = verify(token, process.env.JWT_SECRET || "secret");
    return decoded;
}