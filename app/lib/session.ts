"server-only";
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers";

const secret = process.env.JWT_SECRET;
const encodedSecret = new TextEncoder().encode(secret);

type SessionPayload = {
    userId: string;
    expiresAt: Date;
    role: string;
}

export async function deleteSession() {
    (await cookies()).delete("session");
}

export async function createSession(userId: string, role: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expiresAt, role });

    (await cookies()).set("session", session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt
    });
}

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(payload.expiresAt.getTime())
        .sign(encodedSecret);
}

export async function decrypt(session: string | undefined = "") {
    try {
        const { payload } = await jwtVerify(session, encodedSecret, { algorithms: ["HS256"] });
        return payload;
    }
    catch (error) {
        console.log("Failed to verify session")
    }
}

export async function getUserIdFromSession(): Promise<string | null> {
    const cookie = await cookies();
    const session = cookie.get("session")?.value;

    if (!session) return null;

    const payload = await decrypt(session);
    if (payload && typeof payload.userId === "string") {
        return payload.userId;
    }

    return null;
}