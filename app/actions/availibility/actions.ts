"use server";
import { getAvailability, updateAvailability } from "@/app/actions/availibility/db";
import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session";
import { logout } from "@/app/actions/user/login/actions";

export async function getEmployeeAvailability() {
    const user = await getUserIdAndRoleFromSession();

    if (!user || user.role != "EMPLOYEE") {
        return undefined;
    }

    return getAvailability(user.userId);
}

export async function updateAvailabilityAction(formData: FormData) {
    const user = await getUserIdAndRoleFromSession();

    if (!user || user.role != "EMPLOYEE") {
        logout();
    }

    const data = Object.fromEntries(formData.entries());

    const availabilityData = Object.keys(data).filter((key) =>
        key.startsWith("id-"))
        .map((key) => {
            const id = key.replace("id-", "");
            return {
                id,
                isActive: data[`isActive-${id}`] === "on",
                fromTime: data[`fromTime-${id}`] as string,
                untilTime: data[`untilTime-${id}`] as string
            }
        });

    await updateAvailability({ availabilityData });
}