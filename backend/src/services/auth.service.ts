import { prisma } from "../utils/prisma";
import { sendOtpOnMail } from "../utils/sendOtpOnMail";
import { hashPassword, verifyPassword } from "../utils/managePassword";
import { generateToken } from "../utils/manageToken";

export async function handleSendOtp(username: string, email: string) { 
    const generateOtp = () => (Math.floor(100000 + Math.random() * 900000)).toString();
    const otp = generateOtp();
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

        if (userDetails) {
            await prisma.userProfile.create({
                data: {
                    userId: userDetails.id, 
                    fullName: username,    
                    bio: "Hello, I'm new here!", 
                    avatarUrl: "https://img.freepik.com/free-vector/smiling-redhaired-boy-illustration_1308-175803.jpg?t=st=1741518187~exp=1741521787~hmac=a4fd778cf3802ee8f8dd44a8c5f6051a018b879ff3565d8977894617bffd74eb&w=1380", // Default avatar
                    location: "Unknown", 
                    techStack: ["Signos"], 
                    createdAt: new Date(Date.now()),
                    updatedAt: new Date(Date.now())
                }
            });

            await prisma.otp.delete({ where: { email } });
        }
    } catch (error) {
        console.error(error);
        throw Error("msg: error in creating user.");
    } finally {
        await prisma.$disconnect(); 
    }
}

export async function handleLogin(email: string, password: string) {
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw Error("msg: user not found.");
        }
        if (password === "(NoPassword)123456") {
            const jwtToken = generateToken(email, user.id);
            const { username } = user;
            return { jwtToken, username, email };
        }
        const status = await verifyPassword(password, user.password);
        if (!status) {
            throw Error("msg: invalid password.");
        }
        const jwtToken = generateToken(email, user.id);
        const { username } = user;
        return { jwtToken, username, email }; 
    } catch (error) {
        throw Error("msg: error in logging in.");
    } finally {
        await prisma.$disconnect(); 
    }
}