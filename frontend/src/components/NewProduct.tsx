import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import FilterBar from "@/components/FilterBar";
import ProductCard, { Product } from "@/components/ProductCard";

interface NewProductProps {
  title: string;
  products: Product[];
  showFilters?: boolean;
  viewMoreLink?: string;
  viewMoreText?: string;
  maxProducts?: number;
}

export default function NewProduct({
  title,
  products,
  showFilters = false,
  viewMoreLink,
  viewMoreText = "View More",
  maxProducts = 8
}: NewProductProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enableTransition, setEnableTransition] = useState(true);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [cardWidth, setCardWidth] = useState(0);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesFilters = true;
    if (filters.category) {
      matchesFilters &&= p.category?.slug === filters.category || p.category?.name === filters.category;
    }
    return matchesSearch && matchesFilters;
  });

  // Carousel config
  const productsVisible = 4; // show 4 cards
  const productWidth = 100 / productsVisible; // 25%
  const totalSlides = filteredProducts.length;
  const extendedProducts = [...filteredProducts, ...filteredProducts.slice(0, productsVisible)];

  // No need to group, we slide per product

  // measure card width including gap
  useEffect(() => {
    function measure() {
      if (cardRef.current) {
        const width = cardRef.current.getBoundingClientRect().width;
        setCardWidth(width + 32); // 32px = gap-8
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  // Reset position for infinite loop
  useEffect(() => {
    if (currentIndex === totalSlides) {
      // reached clone area after transition ends
      const timer = setTimeout(() => {
        setEnableTransition(false);
        setCurrentIndex(0);
      }, 1000); // match duration
      return () => clearTimeout(timer);
    }
    if (currentIndex === -1) {
      const timer = setTimeout(() => {
        setEnableTransition(false);
        setCurrentIndex(totalSlides - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    setEnableTransition(true);
  }, [currentIndex, totalSlides]);

  return (
    <section id="products" className="mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-1 h-8 mr-3 rounded-full bg-gradient-to-b from-primary-500 to-primary-700"></div>
          <h2 className="text-2xl font-bold text-secondary-900">{title}</h2>
        </div>
        <div>
          {viewMoreLink ? (
            <Link href={viewMoreLink} className="text-primary-600 hover:text-primary-700 font-medium">
              {viewMoreText}
            </Link>
          ) : (
            showFilters && (
              <button
                onClick={() => setFilters({})}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear Filters
              </button>
            )
          )}
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg shadow-card p-4 mb-8">
          <FilterBar
            onSearch={(term) => setSearchTerm(term)}
            onFilter={(f) => setFilters(f)}
          />
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-card">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-semibold text-secondary-900 mb-2">
            No products found
          </h3>
          <p className="text-secondary-600">
            Try changing your search or filter criteria
          </p>
        </div>
      ) : (
        <>
          <div className="relative overflow-hidden py-2">
            <div
              className={`flex gap-8 ${enableTransition ? "transition-transform duration-1000 ease-in-out" : ""}`}
              style={{ transform: cardWidth ? `translateX(-${currentIndex * cardWidth}px)` : undefined }}
            >
              {extendedProducts.map((product, idx) => (
                <div
                  key={product.id}
                  ref={idx === 0 ? cardRef : undefined}
                  className="flex-shrink-0"
                  style={{ width: `calc(${productWidth}% - 24px)` }}
                >
                  <div className="transform transition duration-700 ease-in-out hover:-translate-y-1">
                    <ProductCard product={product} />
                  </div>
                </div>
              ))}
            </div>

            {totalSlides > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-0 -translate-x-full top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-primary-600 hover:text-white transition-colors z-20"
                >
                  &#8592;
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-0 translate-x-full top-1/2 -translate-y-1/2 bg-white rounded-full shadow p-2 hover:bg-primary-600 hover:text-white transition-colors z-20"
                >
                  &#8594;
                </button>
              </>
            )}
          </div>
          
          {/* Show view all button at the bottom if there are more products than shown */}
          {products.length > maxProducts && !viewMoreLink && (
            <div className="text-center mt-8">
              <Link 
                href={`/products?category=${title.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded hover:bg-primary-700 transition-colors shadow-md"
              >
                View All {title}
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
} 