import type { Metadata } from "next";
import CartProvider from "../components/CartContext";
import Toast from "../components/Toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glac",
  description: "Premium D2C Store",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:ital,wght@0,400;0,500;0,600;0,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Nunito+Sans:wght@400;500;600;700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Nunito+Sans:wght@400;500;600&display=swap" />
      </head>
      <body>
        <CartProvider>
          <Toast />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
