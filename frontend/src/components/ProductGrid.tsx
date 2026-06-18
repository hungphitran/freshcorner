import Link from "next/link";
import ProductCard, { Product } from "@/components/ProductCard";

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export default function ProductGrid({ products, title = "Tất cả sản phẩm" }: ProductGridProps) {
  const visibleProducts = products.slice(0, 16); // show first 16 products

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-1 h-8 mr-3 rounded-full bg-gradient-to-b from-primary-500 via-orange-500 to-brown-600" />
          <h2 className="text-xl lg:text-2xl font-bold text-secondary-900">{title}</h2>
        </div>
        <Link
          href="/products"
          className="text-orange-600 hover:text-orange-700 font-medium hidden lg:block"
        >
          Xem tất cả
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-8">
        <Link
          href="/products"
          className="inline-block bg-primary-600 text-white md:px-6 px-4 md:py-3 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-md shadow-primary-900/10"
        >
          Xem tất cả sản phẩm
        </Link>
      </div>
    </section>
  );
} 