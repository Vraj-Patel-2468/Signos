import { PrismaClient } from "@prisma/client";
import { sendOtpOnMail } from "../utils/sendOtpOnMail";
import { hashPassword, verifyPassword } from "../utils/managePassword";
import { generateToken } from "../utils/manageToken";

export async function handleSendOtp(username: string, email: string) { 
    
    const generateOtp = () => (Math.floor(100000 + Math.random() * 900000)).toString();
    const otp = generateOtp();
    const prisma = new PrismaClient();
    try {
        await sendOtpOnMail(email, otp);
        await prisma.otp.deleteMany({ where: { email } });
        await prisma.otp.create({
            data: {
                email,
                otp,
                expires: new Date(Date.now() + 15 * 60 * 1000)
            }
        })
    } catch (error) {
        throw Error("msg: error in creating otp.");
    }
    return otp;
}

export async function handleSignUp(username: string, email: string, password: string,  otp: string) {
    try {
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({ where: { email } });
        if (user) {
            throw Error("msg: user already exists.");
        }
        const otpData = await prisma.otp.findFirst({ where: { email } });
        if (!otpData) {
            throw Error("msg: invalid otp.");
        }
        if (otpData.expires < new Date()) {
            throw Error("msg: otp expired.");
        }
        if (otpData.otp !== otp) {
            throw Error("msg: invalid otp.");
        }
        const hashedPassword = await hashPassword(password);
        const userDetails = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now())
            }
        });
        if(userDetails) {
            await prisma.otp.delete({ where: { email } });
        }
    } catch (error) {
        throw Error("msg: error in creating user.");
    }
}

export async function handleLogin(email: string, password: string) {
    try {
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw Error("msg: user not found.");
        }
        const status = await verifyPassword(password, user.password);
        if (!status) {
            throw Error("msg: invalid password.");
        }
        const jwtToken = generateToken(email, user.id);
        return { ...user, password: "", jwtToken }; 
    } catch (error) {
        throw Error("msg: error in logging in.");
    }
}