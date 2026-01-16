import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google"
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { Toaster } from "sonner";
import Footer from "@/components/footer";

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
  title: "Kanvix",
  description: "Kanvix is a modern project management platform designed to simplify team collaboration, track progress effortlessly, and ensure on-time delivery of goals.",
  icons: {
    icon: "/kanvix/kanvix.png",
    shortcut: "/kanvix/kanvix.png",
    apple: "/kanvix/kanvix.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: shadesOfPurple,
        variables: {
          colorPrimary: "#3b82f6",
          colorBackground: "#1a202c",
          colorInputBackground: "#3D3748",
          colorInputText: "#F3F4F6"
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} dotted-background`}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Header />
            <main className="min-h-[75vh]">
              {children}
            </main>
            <Toaster richColors />
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
