"server-only";
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/dist/server/request/cookies";


const secret = process.env.JWT_SECRET;
const encodedSecret = new TextEncoder().encode(secret);

type SessionPayload = {
    userId: string;
    expiresAt: Date;
}

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, expiresAt });

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
