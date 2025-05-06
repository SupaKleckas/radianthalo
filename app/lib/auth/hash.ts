import bcryptjs from 'bcrypt';

export async function saltAndHashPassword(password: string): Promise<string> {
    const hashedPassword = await bcryptjs.hash(password, 10);
    return hashedPassword;
}

export async function verifyPassword(userInputPassword: string, storedHashedPassword: string): Promise<boolean> {
    try {
        const result = await bcryptjs.compare(userInputPassword, storedHashedPassword);
        return result;
    } catch {
        return false;
    }
}