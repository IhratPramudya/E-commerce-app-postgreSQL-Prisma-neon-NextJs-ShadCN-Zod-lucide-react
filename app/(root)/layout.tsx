import Header from "@/components/shared/header";
import Footer from "@/components/footer";
import { Toaster } from "sonner";



export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <div className="flex h-screen flex-col">
            <Toaster richColors closeButton theme="system" position="top-center" />
            <Header />
            <main className="flex-1 wrapper">
                {children}
            </main>
            <Footer />
        </div>
    );
  }