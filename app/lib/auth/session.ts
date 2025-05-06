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
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // one day
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
        if (session == undefined) {
            return undefined;
        }
        const { payload } = await jwtVerify(session, encodedSecret, { algorithms: ["HS256"] });
        return payload;
    }
    catch {
        return undefined;
    }
}

export async function getUserIdFromSession(): Promise<string | null> {
    const cookie = await cookies();
    const session = cookie.get("session")?.value;

    const payload = await decrypt(session);
    if (payload && typeof payload.userId === "string") {
        return payload.userId;
    }

    return null;
}

export async function getUserIdAndRoleFromSession(): Promise<{ userId: string; role: string; } | null> {
    const cookie = await cookies();
    const session = cookie.get("session")?.value;
    const payload = await decrypt(session);

    if (payload && typeof payload.userId === "string" && typeof payload.role === "string") {
        return {
            userId: payload.userId,
            role: payload.role
        }
    }

    return null;
}