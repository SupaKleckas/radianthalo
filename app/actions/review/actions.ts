"use server";
import { addReview } from "@/app/actions/review/db";
import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session";
import { addReviewSchema } from "@/app/lib/database/zod";
import { canLeaveReview } from "@/app/lib/reviews/canLeaveReview";
import { logout } from "../user/login/actions";

export async function addReviewAction(rating: number, content: string, serviceId: string, employeeId: string, clientId: string) {
    const userInfo = await getUserIdAndRoleFromSession();
    if (!userInfo || userInfo.role != "USER") {
        logout();
    }
    try {
        const canReview = await canLeaveReview(clientId, employeeId, serviceId);

        if (!canReview) {
            throw new Error("Can't leave review.")
        }

        const validationResult = addReviewSchema.safeParse({ rating, content });

        if (!validationResult.success) {
            const message = JSON.stringify(validationResult.error.flatten());
            throw new Error(message);
        }
        await addReview(rating, content, clientId, employeeId, serviceId);
        return { success: true, message: "Review submitted successfuly!" };
    } catch (e) {
        console.error("Review creation failed:", e);
        return {
            success: false,
            message: e instanceof Error ? e.message : "Review creation failed, try again later."
        };
    }

}