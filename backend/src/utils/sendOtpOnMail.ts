import { createTransport } from "nodemailer";

export const sendOtpOnMail = async (email: string, otp: string) => {

    const transporter = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Signos OTP Verification",
        text: `Your OTP is: ${otp}`,
    };  

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw Error("msg: error in sending mails.");
    }
};