import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import ThemeProvider from "@/components/ThemeProvider";
import Script from "next/script";

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
      <body className="antialiased">
        <ThemeProvider>
          <ErrorReporter />
          <Script
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
            strategy="afterInteractive"
            data-target-origin="*"
            data-message-type="ROUTE_CHANGE"
            data-include-search-params="true"
            data-only-in-iframe="true"
            data-debug="true"
            data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
          />
          {children}
          <VisualEditsMessenger />
        </ThemeProvider>
      </body>
    </html>
  );
}