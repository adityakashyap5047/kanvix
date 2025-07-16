import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Inter } from "next/font/google"
import Header from "@/components/component/header";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";

const inter = Inter({subsets: ["latin"]})

export const metadata = {
  title: "Kanvix",
  description: "Kanvix is a modern project management platform designed to simplify team collaboration, track progress effortlessly, and ensure on-time delivery of goals.",
  icons: {
      icon: "kanvix.png",
      shortcut: "kanvix.png",
      apple: "kanvix.png",
  },
};

export default function RootLayout({ children }) {
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
            <main className="min-h-screen">
              {children}
            </main>
            <footer className="bg-gray-900 p-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>Made with ❤️ by Kanvix</p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
