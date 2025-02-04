import "@drive/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { CSPostHogProvider } from "@drive/app/_providers/posthog-provider";

export const metadata: Metadata = {
  title: "Drive Clone Tutorial",
  description: "Following Theo Browne's Next drive clone Tutorial",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <CSPostHogProvider>{children}</CSPostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
