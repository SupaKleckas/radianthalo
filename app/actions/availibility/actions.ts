import { getAvailability } from "@/app/actions/availibility/db";
import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { logout } from "@/app/actions/user/login/actions";

export async function getEmployeeAvailability() {
    const user = await getUserIdAndRoleFromSession();

    if (!user || user.role != "EMPLOYEE") {
        return notFound();
    }

    return getAvailability(user.userId);
}

export async function updateAvailability(formData: FormData) {
    const data = await getUserIdAndRoleFromSession();

    if (!data || data.role != "EMPLOYEE") {
        logout();
    }


}