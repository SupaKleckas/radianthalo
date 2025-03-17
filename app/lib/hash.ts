"server-only";
import bcrypt from 'bcrypt';

export async function saltAndHashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

export async function verifyPassword(userInputPassword: string, storedHashedPassword: string): Promise<Boolean> {
    try {
        const result = await bcrypt.compare(userInputPassword, storedHashedPassword);
        return result;
    } catch (err) {
        return false;
    }
}
