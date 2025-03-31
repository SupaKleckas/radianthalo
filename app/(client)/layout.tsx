import NavbarUser from "../components/NavbarUser";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <main className="min-h-screen w-full bg-[#FCF9DE]">
            <NavbarUser />
            <div className="flex flex-1 flex-col gap-6 p-6">
                {children}
            </div>
        </main>);
}