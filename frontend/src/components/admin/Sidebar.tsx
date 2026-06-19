import Link from "next/link";
import { useRouter } from "next/router";
import { BarChart2, ShoppingBag, Package, Book, ChevronDown, FolderTree, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/utils/api";
import ReactDOM from 'react-dom';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  children?: {
    href: string;
    label: string;
  }[];
}

const navItems: NavItem[] = [
  { href: "/admin", label: "Thống kê", icon: BarChart2 },
  { 
    href: "/admin/orders", 
    label: "Đơn hàng", 
    icon: ShoppingBag
  },
  { href: "/admin/products", label: "Sản phẩm", icon: Package },
  { href: "/admin/categories", label: "Danh mục", icon: FolderTree },
  { href: "/admin/blog", label: "Blog", icon: Book },
  { href: "/admin/contacts", label: "Liên hệ", icon: Mail },
];

interface SidebarProps {
  /** Called after a navigation click (useful for closing mobile sidebar) */
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps = {}) {
  const router = useRouter();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  // Initialize with a static value so that the content rendered on the server
  // is identical to the first paint on the client. We then update the value
  // after the component has mounted on the client side.
  const [adminName, setAdminName] = useState<string>('admin');

  // Read from localStorage and (if needed) fetch fresh profile information once
  // the component has mounted on the client. This prevents mismatches between
  // server-rendered and client-rendered HTML during hydration.
  useEffect(() => {
    // Ensure this code only runs in the browser
    if (typeof window === 'undefined') return;

    // 1. Try to read the cached admin name from localStorage first
    const cachedName = localStorage.getItem('admin_name');
    if (cachedName) {
      setAdminName(cachedName);
    }

    // 2. Fetch admin profile if we do not have a cached name yet
    if (!cachedName) {
      (async () => {
        try {
          const res = await api.get('/admin/profile');
          if (res.data.success) {
            const name = res.data.data.username || res.data.data.email || 'Admin';
            setAdminName(name);
            localStorage.setItem('admin_name', name);
          }
        } catch (e) {
          // Silently ignore any error – we keep the default name
        }
      })();
    }
  }, []);
  
  // Check if the current route matches a nav item
  const isActive = (href: string) => {
    if (href === '/admin') return router.pathname === '/admin';
    return router.pathname.startsWith(href);
  };
  const isChildActive = (href: string) => router.asPath === href;
  
  const toggleExpand = (href: string) => {
    setExpandedItem(expandedItem === href ? null : href);
  };

  return (
    <aside className="h-screen sticky top-0 w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200">

        <Link href="/admin" onClick={onNavigate} className="flex items-center justify-center flex-col gap-2">
         
            <Image src="/logo.png" width={30} height={30} alt="Logo" className="w-10 h-10" />
         
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-orange-500 to-brown-700 bg-clip-text text-transparent">Fresh Corner</h1>
        </Link>
      </div>
      
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1.5">
          {navItems.map(({ href, label, icon: Icon, children }) => {
            const active = isActive(href);
            const expanded = expandedItem === href;
            
            return (
              <li key={href}>
                {children ? (
                  <div>
                    <button
                      onClick={() => toggleExpand(href)}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        active 
                          ? 'bg-primary-50 text-primary-700 font-medium' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-gray-500'}`} />
                        <span>{label}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expanded && (
                      <ul className="mt-1 ml-7 pl-3 border-l border-gray-200 space-y-1">
                        {children.map((child) => {
                          const childActive = isChildActive(child.href);
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                onClick={onNavigate}
                                className={`block py-2 px-3 text-sm rounded-lg ${
                                  childActive
                                    ? 'text-primary-700 bg-primary-50 font-medium'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                              >
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      active 
                        ? 'bg-primary-50 text-primary-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${active ? 'text-primary-600' : 'text-gray-500'}`} />
                    <span>{label}</span>
                    {active && (
                      <div className="ml-auto w-1.5 h-5 bg-primary-600 rounded-full"></div>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="mt-auto border-t border-gray-200 p-4">
        <Link href="/" onClick={onNavigate} className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <span>Về trang chủ</span>
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">WEBSITE</span>
        </Link>
      </div>
    </aside>
  );
} 