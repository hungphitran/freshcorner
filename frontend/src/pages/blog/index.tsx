import Image from "next/image";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import api from "@/utils/api";
import Seo from "@/components/Seo";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: string;
  publishDate: string;
  category: string;
  author: string;
}

interface Props {
  blogs: Blog[];
  categories: string[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
  };
  currentCategory: string;
}

export default function BlogPage({ blogs, categories, pagination, currentCategory }: Props) {
  const router = useRouter();

  const handleCategoryClick = (cat: string) => {
    const query = { ...router.query, page: "1" } as any;
    if (cat === "") {
      delete query.category;
    } else {
      query.category = cat;
    }
    router.push({ pathname: "/blog", query });
  };

  const handlePageChange = (page: number) => {
    router.push({ pathname: "/blog", query: { ...router.query, page: page.toString() } });
  };

  return (
    <>
      <Seo 
        title="Blog - Fresh Corner"
        description="Đọc các gợi ý chọn trái cây, tea break, ăn vặt và smoothies từ Fresh Corner."
        url="https://freshcorner.vn/blog"
        image="/logo.png"
      />
      <div className="bg-white">
        {/* Page Header */}
        <div className="bg-secondary-100 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Blog</h1>
            <div className="flex items-center text-sm text-secondary-600">
              <Link href="/" className="hover:text-primary-600">Trang chủ</Link>
              <span className="mx-2">/</span>
              <span>Blog</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => handleCategoryClick("")}
            className={`px-4 py-2 rounded-full text-sm ${!currentCategory ? "bg-primary-600 text-white" : "bg-brown-50 text-brown-700 hover:bg-brown-100"}`}
          >
            Tất cả
          </button>
          {(categories || []).map((category) => (
              <button
                key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full text-sm ${currentCategory === category ? "bg-primary-600 text-white" : "bg-brown-50 text-brown-700 hover:bg-brown-100"}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((post) => (
            <div key={post._id} className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-all">
                <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/9] bg-secondary-100">
                <Image src={post.featuredImage || "/categories.jpg"} alt={post.title} fill className="object-cover" unoptimized />
                </Link>
                <div className="p-6">
                  <div className="flex items-center text-xs text-secondary-500 mb-2">
                    <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded mr-2">
                      {post.category}
                    </span>
                  <span>{new Date(post.publishDate).toLocaleDateString("vi-VN")}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-bold text-lg text-secondary-900 mb-2 hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-secondary-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                      <span className="text-xs text-secondary-700">{post.author}</span>
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

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <nav className="flex items-center space-x-2">
              <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)} 
                disabled={pagination.currentPage === 1}
                className="px-3 py-2 leading-tight text-secondary-500 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-100 hover:text-secondary-700 disabled:opacity-50"
              >
                Trước
              </button>
              
              {((): React.ReactNode => {
                const pageNumbers: (number | string)[] = [];
                const { currentPage, totalPages } = pagination;
                
                if (totalPages <= 7) { // Show all pages if 7 or less
                  for (let i = 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                  }
                } else {
                  if (currentPage <= 4) {
                    pageNumbers.push(1, 2, 3, 4, 5, 'ellipsis', totalPages);
                  } else if (currentPage > totalPages - 4) {
                    pageNumbers.push(1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                  } else {
                    pageNumbers.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis_end', totalPages);
                  }
                }

                return pageNumbers.map((p, index) => {
                  if (typeof p === 'string') {
                    return (
                      <span key={`${p}-${index}`} className="px-4 py-2 leading-tight border rounded-lg text-secondary-500 bg-white border-secondary-300 hidden sm:inline-block">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button 
                      key={p} 
                      onClick={() => handlePageChange(p)}
                      className={`px-4 py-2 leading-tight border rounded-lg hidden sm:inline-block ${pagination.currentPage === p ? 'bg-primary-600 text-white border-primary-600' : 'text-secondary-500 bg-white border-secondary-300 hover:bg-primary-50 hover:text-primary-700'}`}
                    >
                      {p}
                    </button>
                  );
                });
              })()}

              <button 
                onClick={() => handlePageChange(pagination.currentPage + 1)} 
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-2 leading-tight text-secondary-500 bg-white border border-secondary-300 rounded-lg hover:bg-secondary-100 hover:text-secondary-700 disabled:opacity-50"
              >
                Sau
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const page = query.page ? parseInt(query.page as string, 10) : 1;
    const limit = 9;
    const category = query.category ? query.category.toString() : "";

    const [blogsRes, catRes] = await Promise.all([
      api.get("/blogs", { params: { page, limit, category: category || undefined } }),
      api.get("/blogs/categories")
    ]);

    const blogsData = blogsRes.data.data;
    const blogs: Blog[] = blogsData.blogs.map((b: any) => ({
      _id: b._id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt || b.description?.slice(0, 120) || "",
      featuredImage: b.featuredImage || "/categories.jpg",
      publishDate: b.publishDate,
      category: b.category,
      author: b.author || "Admin",
    }));

    const categories: string[] = catRes.data.data || [];

    return {
      props: {
        blogs,
        categories,
        pagination: {
          currentPage: blogsData.pagination.currentPage,
          totalPages: blogsData.pagination.totalPages,
          totalBlogs: blogsData.pagination.totalBlogs,
        },
        currentCategory: category,
      },
    };
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return { props: { blogs: [], categories: [], pagination: { currentPage: 1, totalPages: 1, totalBlogs: 0 }, currentCategory: "" } };
  }
}; 