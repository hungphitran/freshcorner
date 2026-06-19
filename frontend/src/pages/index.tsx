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

// Slogan 1 - Light theme
function SloganOne() {
  return (
    <div className="text-center p-6 bg-white rounded-2xl border border-primary-100 shadow-soft hover:shadow-md hover:border-primary-200 transition-all duration-300 transform hover:scale-105 flex flex-col items-center">
      <div className="mb-4 p-3 bg-primary-50 rounded-full text-primary-600">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-secondary-900 mb-2">Trái Cây Tươi Mỗi Ngày</h3>
      <p className="text-secondary-600 text-sm font-medium">Chọn lọc theo mùa, giao nhanh trong ngày</p>
    </div>
  );
}

// Slogan 2 - Light theme
function SloganTwo() {
  return (
    <div className="text-center p-6 bg-white rounded-2xl border border-primary-100 shadow-soft hover:shadow-md hover:border-primary-200 transition-all duration-300 transform hover:scale-105 flex flex-col items-center">
      <div className="mb-4 p-3 bg-brown-50 rounded-full text-brown-600">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-secondary-900 mb-2">Tea Break Gọn Đẹp</h3>
      <p className="text-secondary-600 text-sm font-medium">Set bánh, trái cây và đồ uống cho văn phòng</p>
    </div>
  );
}

// Slogan 3 - Light theme
function SloganThree() {
  return (
    <div className="text-center p-6 bg-white rounded-2xl border border-primary-100 shadow-soft hover:shadow-md hover:border-primary-200 transition-all duration-300 transform hover:scale-105 flex flex-col items-center">
      <div className="mb-4 p-3 bg-orange-50 rounded-full text-orange-600">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-secondary-900 mb-2">Ăn Vặt & Smoothies</h3>
      <p className="text-secondary-600 text-sm font-medium">Nhẹ bụng, đủ vị, hợp mọi buổi gặp mặt</p>
    </div>
  );
}

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

      {/* Intro Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-center flex flex-col items-center">
        {/* Main Content Header */}
        <div className="max-w-3xl mx-auto mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary-700 via-primary-500 to-orange-500 bg-clip-text text-transparent tracking-tight leading-tight">
            Fresh Corner
          </h1>
          <p className="text-secondary-600 text-lg md:text-xl font-medium leading-relaxed">
            Trái cây tươi, tea break, ăn vặt và smoothies cho văn phòng, gia đình và những buổi gặp mặt thân mật.
          </p>
        </div>

        {/* 3 Slogans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <SloganOne />
          <SloganTwo />
          <SloganThree />
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Link
            href="/products"
            className="inline-flex items-center bg-primary-600 text-white px-8 py-3.5 rounded-xl font-semibold text-md hover:bg-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/25 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Xem Sản Phẩm
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center bg-white text-primary-700 border border-primary-200 px-8 py-3.5 rounded-xl font-semibold text-md hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 transform hover:scale-105 shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Đặt Tiệc / Liên Hệ
          </Link>
        </div>
      </section>

      {/* Products Preview Section */}
      <ProductGrid products={products} />

      <section className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-1 h-8 mr-3 rounded-full bg-gradient-to-b from-primary-500 to-primary-700"></div>
            <h2 className="text-2xl font-bold text-secondary-900">Bài viết mới nhất</h2>
          </div>
          <Link href="/blog" className="text-primary-600 hover:text-primary-700 font-medium">
            Xem tất cả
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row md:flex-wrap justify-center gap-8 my-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-all flex flex-col">
              <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9] bg-secondary-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </Link>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center text-xs text-secondary-500 mb-2">
                  <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded mr-2">
                    {post.category}
                  </span>
                  <span>{post.date}</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="font-bold text-lg text-secondary-900 mb-2 hover:text-primary-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-secondary-200 flex items-center justify-center text-secondary-700 font-medium mr-2">
                      {post.author.charAt(0)}
                    </div>
                    <span className="text-xs text-secondary-700">{post.author}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
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
