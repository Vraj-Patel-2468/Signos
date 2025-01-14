import { hash, compare } from "bcrypt";

export async function hashPassword(password: string) {
    const newPassword = await hash(password, 10);
    return newPassword;
}

export async function verifyPassword(password: string, hashedPassword: string) {
    const status = await compare(password, hashedPassword);
    return status;
}
