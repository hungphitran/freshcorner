import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, forwardRef } from "react";
import { useRouter } from "next/router";
import { Mail, MapPin, PhoneCall, ShoppingCart, Search, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import api from "@/utils/api";
import { Product } from "./ProductCard";
import { normalizeProduct } from "@/utils/normalizeProduct";

const Header = forwardRef<HTMLElement>((props, ref) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => {
    if (href === "/") return router.pathname === "/";
    return router.pathname.startsWith(href);
  };
  
  // Debounced search effect
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get('/products', { params: { search: searchTerm, limit: 4 } });
        if (res.data.success) {
          const mappedResults = res.data.data.map(normalizeProduct);
          setResults(mappedResults);
        }
      } catch (err) {
        console.error("Search failed", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isOutsideDesktop = !searchContainerRef.current || !searchContainerRef.current.contains(target);
      const isOutsideMobile = !mobileSearchContainerRef.current || !mobileSearchContainerRef.current.contains(target);

      if (isOutsideDesktop && isOutsideMobile) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowResults(false);
      router.push(`/products?search=${searchTerm.trim()}`);
    }
  };

  const searchForm = (isMobile: boolean = false) => (
    <form onSubmit={handleSearchSubmit} className="relative">
      <input
        type="text"
        placeholder="Tìm trái cây, tea break, smoothies..."
        className={`w-full pl-4 pr-10 py-2 rounded-lg bg-white text-gray-900 border-2 border-secondary-200 focus:outline-none focus:border-primary-500 transition-colors ${isMobile ? 'text-base' : ''}`}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        onFocus={() => setShowResults(true)}
      />
      <button type="submit" className="absolute right-0 top-0 h-full px-3 text-secondary-500 hover:text-primary-600">
        <Search className="w-5 h-5" />
      </button>
      {showResults && searchTerm && (
        <div className={`absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-secondary-200 overflow-hidden z-50 ${isMobile ? 'max-h-60 overflow-y-auto' : ''}`}>
          {loading ? (
            <div className="p-4 text-center text-secondary-500">Đang tìm...</div>
          ) : results.length > 0 ? (
            <ul className="divide-y divide-secondary-100">
              {results.map(product => (
                <li key={product.id}>
                  <Link 
                    href={`/products/${product.slug}`} 
                    className="flex items-center gap-3 p-3 hover:bg-secondary-50 transition-colors"
                    onClick={() => {
                      setShowResults(false);
                      setSearchTerm('');
                    }}
                  >
                    <Image src={product.image || "/fallback-product.jpg"} alt={product.name} width={64} height={64} className="object-cover rounded" unoptimized />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-800 line-clamp-1">{product.name}</p>
                      <p className="text-sm text-primary-600 font-semibold">{product.price.toLocaleString('vi-VN')}₫</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-secondary-500">Không tìm thấy sản phẩm.</div>
          )}
        </div>
      )}
    </form>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-white text-black shadow-md" ref={ref}>
      {/* Top contact bar (desktop only) */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2 text-sm bg-brown-700 text-white">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4" /> 0345&nbsp;8888&nbsp;04
          </span>
          {/* <span className="flex items-center gap-2">
            <Mail className="w-4 h-4" /> hello@freshcorner.vn
          </span> */}
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Giao trái cây, tea break và đồ uống tại TP.Hồ Chí Minh
          </span>
        </div>
        <Link href="/contact" className="hover:text-white font-medium">
          Đặt tiệc / Liên hệ
        </Link>
      </div>

      {/* Main header */}
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile: burger */}
          <button
            className="lg:hidden p-2 mr-2 rounded hover:bg-secondary-100"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-secondary-800"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5" />
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" aria-label="Fresh Corner" className="flex items-center gap-2">
           <Image src="/logo.png" alt="Fresh Corner" width={60} height={60} className="object-contain hidden lg:block" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-orange-500 to-brown-700 bg-clip-text text-transparent">Fresh Corner</span>
          </Link>

          {/* Search (desktop) */}
          <div className="hidden md:block flex-1 max-w-md mx-2" ref={searchContainerRef}>
            {searchForm()}
          </div>

          {/* Desktop navigation links & Cart */}
          <div className="flex items-center">
              <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-secondary-800">
                <Link
                  href="/"
                  className={`${isActive("/") ? "text-primary-600 border-b-2 border-primary-500" : "hover:text-primary-600"} pb-1 transition-colors`}
                >
                  TRANG CHỦ
                </Link>
                <Link
                  href="/about"
                  className={`${isActive("/about") ? "text-primary-600 border-b-2 border-primary-500" : "hover:text-primary-600"} pb-1 transition-colors`}
                >
                  VỀ CHÚNG TÔI
                </Link>
                <Link
                  href="/contact"
                  className={`${isActive("/contact") ? "text-primary-600 border-b-2 border-primary-500" : "hover:text-primary-600"} pb-1 transition-colors`}
                >
                  ĐẶT TIỆC / LIÊN HỆ
                </Link>
                <Link
                  href="/blog"
                  className={`${isActive("/blog") ? "text-primary-600 border-b-2 border-primary-500" : "hover:text-primary-600"} pb-1 transition-colors`}
                >
                  BLOG
                </Link>
              </nav>
              
              {/* Cart icon */}
              <Link href="/cart" className="relative flex items-center hover:text-primary-600 ml-4">
                <ShoppingCart className="w-6 h-6 text-secondary-800" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
          </div>
        </div>
      </div>

       {/* Search (mobile) */}
      <div className="md:hidden px-4 pb-2" ref={mobileSearchContainerRef}>
        {searchForm(true)}
      </div>


      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ease-in-out ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-modal="true"
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="fixed inset-0 bg-black/40" aria-hidden="true"></div>

        <div
          className={`relative z-10 flex flex-col w-full max-w-xs h-full bg-white shadow-xl transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b">
             <Link href="/" aria-label="Fresh Corner" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Image src="/logo.png" alt="Fresh Corner" width={40} height={40} className="object-contain" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 via-orange-500 to-brown-700 bg-clip-text text-transparent">Fresh Corner</span>
              </Link>
            <button
              type="button"
              className="-m-2 p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <nav className="flex-grow flex flex-col text-base font-medium text-secondary-700 pt-4">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 border-b border-secondary-200 hover:bg-primary-50 hover:text-primary-600">TRANG CHỦ</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 border-b border-secondary-200 hover:bg-primary-50 hover:text-primary-600">VỀ CHÚNG TÔI</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 border-b border-secondary-200 hover:bg-primary-50 hover:text-primary-600">ĐẶT TIỆC / LIÊN HỆ</Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="py-3 px-4 hover:bg-primary-50 hover:text-primary-600">BLOG</Link>
          </nav>

          <div className="py-4 px-4 border-t border-secondary-200 text-sm space-y-2 text-secondary-600">
            <span className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-secondary-400" /> 0909&nbsp;090&nbsp;090
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-secondary-400" /> hello@freshcorner.vn
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary-400" /> TP.HCM
            </span>
          </div>
        </div>
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header; 