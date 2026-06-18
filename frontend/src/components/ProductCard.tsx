import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import BuyNowModal from "@/components/BuyNowModal";
import { useCart } from "@/context/CartContext";
import { getProductTheme } from "@/utils/productTheme";
import toast from "react-hot-toast";

export interface Product {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  category: {
    name: string;
    slug: string;
    themeKey?: string;
  };
  packageSize?: string;
  product_code: string;
  description?: string;
}

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const [imageLoading, setImageLoading] = useState(true);
  const [showBuyNow, setShowBuyNow] = useState(false);
  const fullProductName = product.name;
  const productMeta = [product.packageSize, product.product_code].filter(Boolean).join(" • ");
  const theme = getProductTheme(product.category?.themeKey || product.category?.slug);


  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      category: product.category,
      packageSize: product.packageSize,
      product_code: product.product_code,
    });
    toast.success("Đã thêm vào giỏ hàng");
  };

  return (
    <div className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-secondary-200 bg-white transition-all duration-300 hover:-translate-y-1 ${theme.cardHoverBorder}`}>
      <Link 
        href={`/products/${product.slug}`} 
        className="relative aspect-[4/3] bg-secondary-50 overflow-hidden"
        aria-label={`Xem chi tiết ${fullProductName}`}
      >
        <span className={`absolute top-3 left-3 z-20 rounded-lg md:px-4 px-2 py-1 text-xs font-medium ${theme.badge}`}>
          {product.category?.name || "Sản phẩm"}
        </span>
        <div className={`
          absolute inset-0 bg-secondary-100 animate-pulse
          ${imageLoading ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-300
        `} />
        <Image
          src={product.image}
          alt={fullProductName}
          fill
          unoptimized
          className={`
            object-cover transition-all duration-500
            ${imageLoading ? 'scale-110 blur-sm' : 'scale-100 blur-0'}
            group-hover:scale-105
          `}
          onLoadingComplete={() => setImageLoading(false)}
        />
      </Link>
      
      <div className="flex flex-1 flex-col p-3 md:p-4">
        
        <Link 
          href={`/products/${product.slug}`}
          className="flex-1 group/title"
          aria-label={`Xem chi tiết ${fullProductName}`}
        >
          <h3 className={`mb-2 text-sm font-medium text-secondary-900 line-clamp-2 leading-snug transition-colors ${theme.titleHover}`}>
            {fullProductName}
          </h3>
        </Link>
        {productMeta && (
          <p className="mb-2 text-xs text-secondary-500 line-clamp-1">{productMeta}</p>
        )}
        
        <p className="mb-3 text-base font-bold text-secondary-900 tabular-nums">
          {product.price.toLocaleString("vi-VN")}
          <span className="ml-1 text-sm">₫</span>
        </p>
        
        <div className="mt-auto grid grid-cols-1 lg:grid-cols-2 gap-2">
          <button 
            onClick={handleAddToCart}
            className={`group/cart inline-flex items-center justify-center gap-1.5 rounded-lg border bg-white px-3 py-3 text-xs font-medium transition-all active:scale-95 focus:outline-none focus:ring-2 ${theme.outlineButton}`}
            aria-label="Thêm vào giỏ hàng"
          >
            <span className="lg:hidden">Thêm vào giỏ</span>
            <ShoppingCart className="h-3.5 w-3.5 transition-transform group-hover/cart:scale-110" />
          </button>
          <button 
            className={`group/buy hidden lg:inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-3 text-xs font-medium text-white shadow-md transition-all active:scale-95 focus:outline-none focus:ring-2 ${theme.solidButton}`}
            aria-label="Mua ngay"
            onClick={() => setShowBuyNow(true)}
          >
            {/* <Zap className="h-3.5 w-3.5 transition-transform group-hover/buy:scale-110" /> */}
            <span>Mua ngay</span>
          </button>
        </div>
      </div>
      {showBuyNow && (
        <BuyNowModal product={product} open={showBuyNow} onClose={() => setShowBuyNow(false)} />
      )}
    </div>
  );
} 