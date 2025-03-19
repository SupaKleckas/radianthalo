import NavbarUser from "../components/NavbarUser";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section>
            <NavbarUser />
            {children}
        </section>);
}