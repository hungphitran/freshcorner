import { ReactNode, useRef, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Header from "./Header";
import Footer from "./Footer";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight);
      }
    };

    // Use ResizeObserver to detect when the header's size changes
    const observer = new ResizeObserver(updateHeight);
    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    // Initial height measurement
    updateHeight();

    return () => {
      if (headerRef.current) {
        observer.unobserve(headerRef.current);
      }
    };
  }, []);

  const routeTitleMap: Record<string, string> = {
    "/": "Fresh Corner | Trái cây, tea break, ăn vặt và smoothies",
    "/products": "Fresh Corner | Sản phẩm",
    "/blog": "Fresh Corner | Blog",
    "/contact": "Fresh Corner | Liên hệ",
    "/about": "Fresh Corner | Về chúng tôi",
    "/cart": "Fresh Corner | Giỏ hàng",
  };

  let title = "Fresh Corner";
  for (const path in routeTitleMap) {
    if (router.pathname === path || router.pathname.startsWith(path + "/")) {
      title = routeTitleMap[path];
      break;
    }
  }

  return (
    <div className="flex flex-col justify-center w-full min-h-screen bg-white">
      <Head>
        <title>{title}</title>
      </Head>
      <Header ref={headerRef} />
      <main className="flex-1 w-full bg-white mx-auto" style={{ paddingTop: `${headerHeight}px` }}>
        {children}
      </main>
      <Footer />
    </div>
  );
} 