import NavbarUser from "../components/NavbarUser";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className="bg-[#FCF9DE] min-h-screen">
            <NavbarUser />
            {children}
        </section>);
}