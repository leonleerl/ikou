
import { Navbar } from "@/components";
import "./globals.css";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 backdrop-blur-sm border-b-2 p-2">
          <Navbar/>
        </div>
        <main className="flex-1 pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
