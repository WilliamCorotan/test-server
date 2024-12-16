import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
    title: "POS System",
    description: "Modern POS System with Next.js",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body>
                    <SidebarProvider>
                        {/* <AppSidebar /> */}
                        <main className="flex-grow">{children}</main>
                    </SidebarProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
