import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kanvix",
  description: "Kanvix is a modern project management platform designed to simplify team collaboration, track progress effortlessly, and ensure on-time delivery of goals.",
  icons: {
      icon: "kanvix.png",
      shortcut: "kanvix.png",
      apple: "kanvix.png",
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
