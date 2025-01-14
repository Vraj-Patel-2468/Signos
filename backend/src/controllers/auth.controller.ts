import { Request, Response } from "express";
import { handleSendOtp, handleSignUp, handleLogin } from "../services/auth.service";

export async function sendOtp(req: Request, res: Response): Promise<any> {
    const { username, email } = req.body;
    if (!username || !email) {
        return res.status(400).json({ message: "Username and email are required" });
    }
    try {
        await handleSendOtp(username, email);
        return res.status(201).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending OTP" });
    }
}

export async function signUp(req: Request, res: Response): Promise<any> {
    const { username, email, password, otp } = req.body;
    if (!username || !email || !password || !otp) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        await handleSignUp(username, email, password, otp);
        return res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error creating user" });
    }
}

export async function login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Insufficient credentials" });
    }
    try {
        const userDetails = await handleLogin(email, password);
        return res.status(200).json({ message: "Login successful", userDetails });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Invalid OTP" });
    }
}