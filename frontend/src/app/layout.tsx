import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { ClientComponents } from "@/components/ClientComponents";
import { Toaster } from "@/components/ui/sonner";
import FloatingMentorButton from "@/components/FloatingMentorButton";

// Optimize font loading with next/font
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
  // Only load the weights you actually use
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
  preload: true,
});

export const metadata: Metadata = {
  title: "CareerBridge - AI-Powered Career Platform",
  description: "Discover your perfect career path with AI-powered recommendations, curated job opportunities, and personalized learning resources.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const storedTheme = localStorage.getItem("theme");
                const htmlElement = document.documentElement;
                if (storedTheme === "light") {
                  htmlElement.classList.remove("dark");
                } else {
                  htmlElement.classList.add("dark");
                  if (!storedTheme) {
                    localStorage.setItem("theme", "dark");
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`antialiased ${inter.variable} ${poppins.variable}`}>
        <ThemeProvider>
          {children}
          <FloatingMentorButton />
          <Toaster />
          <ClientComponents />
        </ThemeProvider>
      </body>
    </html>
  );
}