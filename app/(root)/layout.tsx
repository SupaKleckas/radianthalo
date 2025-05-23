import Navbar from "../components/Navbar/NavbarGuest";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main>
            <Navbar />
            {children}
        </main>
    );
}