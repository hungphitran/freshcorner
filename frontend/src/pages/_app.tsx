import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin");

  const content = <Component {...pageProps} />;

  return (
    <CartProvider>
      {isAdminRoute ? content : <Layout>{content}</Layout>}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </CartProvider>
  );
}
