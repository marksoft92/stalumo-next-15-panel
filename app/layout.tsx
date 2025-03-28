import localFont from "next/font/local";

import "./globals.css";
import SideMenu from "@/components/ui/SideMenu";

const oswaldVariable = localFont({
  src: "./fonts/Oswald-VariableFont_wght.ttf",
  variable: "--font-oswald",
  weight: "100 200 300 400 500 600 700 800 900",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body
        className={`${oswaldVariable.variable} antialiased flex flex-row`}
        style={{ fontFamily: "var(--font-oswald), sans-serif" }}
      >
        <SideMenu />
        {children}
      </body>
    </html>
  );
}
