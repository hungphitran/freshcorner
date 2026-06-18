import { useState, useEffect } from "react";
import Seo from "@/components/Seo";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/components/ProductCard";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import ProductGrid from "@/components/ProductGrid";
import api from "@/utils/api";
// No direct axios import, use api instance
import { GetServerSideProps } from "next";
import { normalizeProduct } from "@/utils/normalizeProduct";


interface HomePageProps {
  products: Product[];
}

export default function HomePage({ products }: HomePageProps) {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  // Fetch latest blogs while keeping the homepage usable if the API is down.
  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await api.get("/blogs", { params: { limit: 3 } });
        if (res.data.success) {
          const blogs = res.data.data.blogs || res.data.data;
          setBlogPosts(
            blogs.map((b: any) => ({
              id: b._id,
              title: b.title,
              slug: b.slug,
              image: b.featuredImage || "/categories.jpg",
              category: b.category,
              date: new Date(b.publishDate).toLocaleDateString("vi-VN"),
              excerpt: b.content ? b.content.slice(0, 120) : "",
              author: b.author || "Admin",
            }))
          );
        }
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <>
      <Seo 
        title="Fresh Corner - Trái cây, tea break, ăn vặt và smoothies"
        description="Fresh Corner cung cấp trái cây tươi, set tea break, đồ ăn vặt và smoothies cho văn phòng, gia đình và tiệc nhẹ."
        url="https://freshcorner.vn/"
        image="/logo.png"
      />
      <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative -mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
       <Hero />

        {/* Car Finder Form */}
        <SearchBar />
      </section>

      {/* Products Preview Section */}
      <ProductGrid products={products} />

      <section className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-1 h-8 mr-3 rounded-full bg-gradient-to-b from-orange-500 to-brown-600"></div>
            <h2 className="text-2xl font-bold text-secondary-900">Bài viết mới nhất</h2>
          </div>
          <Link href="/blog" className="text-orange-600 hover:text-orange-700 font-medium">
            Xem tất cả
          </Link>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3 my-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-all">
              <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9] bg-secondary-100">
          <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </Link>
              <div className="p-6">
                <div className="flex items-center text-xs text-secondary-500 mb-2">
                  <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded mr-2">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="font-bold text-lg text-secondary-900 mb-2 hover:text-orange-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-secondary-200 flex items-center justify-center text-secondary-700 font-medium mr-2">
                      {post.author.charAt(0)}
                    </div>
                    <span className="text-xs text-secondary-700">{post.author}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="text-brown-600 hover:text-brown-700 text-sm font-medium flex items-center">
                    Đọc tiếp
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await api.get('/products', { params: { page: 1, limit: 16 } });
    const products: Product[] = res.data.data.map(normalizeProduct);

    return { props: { products } };
  } catch (error) {
    console.error("Failed to fetch products for homepage:", error);
    return { props: { products: [] } };
  }
};
