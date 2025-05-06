import { getUserById } from "@/app/actions/user/db";
import { logout } from "@/app/actions/user/login/actions";
import AccountDetails from "@/app/components/User/AccountDetails"
import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session"
import { redirect } from "next/navigation";
import Message from "@/app/components/Notifications/Message";

export type paramsType = Promise<{ status?: string }>;

export default async function Page(props: { params: paramsType }) {
    const { status } = await props.params;
    const userDetails = await getUserIdAndRoleFromSession();
    if (!userDetails || userDetails.role != "ADMIN") {
        logout();
        redirect("/");
    }

    const user = await getUserById(userDetails.userId);

    if (!user) {
        redirect("/");
    }

    return (
        <div>
            {status == "password-success" ? <Message type="success" message="Password changed succesfully!" /> : null}
            {status == "detail-success" ? <Message type="success" message="Account details changed succesfully!" /> : null}
            <AccountDetails user={user} />
        </div>
    )
}