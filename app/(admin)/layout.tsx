import NavbarAdmin from "../components/NavbarAdmin";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main>
            <NavbarAdmin />
            {children}
        </main>
    );
}