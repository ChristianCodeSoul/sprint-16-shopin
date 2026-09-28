import "./globals.css";
import StoreProvider from "@/store/StoreProvider";

export const metadata = {
  title: "ShopIn | Everyday finds",
  description: "ShopIn ecommerce application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}