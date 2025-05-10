import { getUserById } from "@/app/actions/user/db";
import { logout } from "@/app/actions/user/login/actions";
import AccountDetails from "@/app/components/User/AccountDetails"
import { getUserIdAndRoleFromSession } from "@/app/lib/auth/session"
import { redirect } from "next/navigation";
import Message from "@/app/components/Notifications/Message";
import { ScrollArea } from "@/components/ui/scroll-area";

type SearchParams = Promise<{ [key: string]: string | undefined }>

export default async function Page(props: { searchParams: SearchParams }) {
    const { status } = await props.searchParams;

    const userDetails = await getUserIdAndRoleFromSession();
    if (!userDetails || userDetails.role != "USER") {
        logout();
        redirect("/");
    }

    const user = await getUserById(userDetails.userId);

    if (!user) {
        redirect("/");
    }

    return (
        <ScrollArea className="h-[60vh] w-full rounded-md pr-4">
            <div className="flex justify-center">
                <div className="w-[90%] md:w-[70%]">
                    {status == "password-success" ? <Message type="success" message="Password changed succesfully! A confirmation email has been sent to your inbox." /> : null}
                    {status == "password-success-noemail" ? <Message type="success" message="Password changed successfully, but
                                 the confirmation email could not be sent. Please verify your email address later." /> : null}
                    {status == "detail-success" ? <Message type="success" message="Account details changed succesfully!" /> : null}
                    <AccountDetails user={user} />
                </div>
            </div>
        </ScrollArea>
    )
}