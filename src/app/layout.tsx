import { Navbar } from "@/components";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { Toaster } from "sonner";
import AuthProvider from "@/context/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="relative min-h-screen">
        
        <AuthProvider>
            <Theme>
            <Toaster position="top-center" closeButton />
            <div className="fixed top-0 left-0 right-0 border z-50 border-gray-200 bg-gradient-to-r from-white/90 to-amber-50/90 opacity-80">
              <Navbar/>
            </div>

            <main className="relative z-10 flex-1 pt-16 m-6">
              {children}
            </main>
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}
