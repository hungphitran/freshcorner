import { GetServerSideProps } from "next";
import Seo from "@/components/Seo";
import Image from "next/image";
import Link from "next/link";
import api from "@/utils/api";

interface BlogDetail {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  publishDate: string;
  category: string;
  author: string;
}

interface RelatedPost {
  _id: string;
  title: string;
  slug: string;
  featuredImage: string;
  publishDate: string;
  category: string;
}

interface Props {
  post: BlogDetail | null;
  related: RelatedPost[];
}
export default function BlogDetailPage({ post, related }: Props) {
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Bài viết không tồn tại</h1>
        <Link href="/blog" className="text-primary-600 hover:underline">
          Quay lại Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Seo 
        title={`${post.title} | Blog`}
        description={post.excerpt}
        url={`https://freshcorner.vn/blog/${post.slug}`}
        image={post.featuredImage}
      />

      {/* Hero Image */}
      <div className="relative w-full aspect-[16/9] bg-secondary-100">
        <Image src={post.featuredImage || "/categories.jpg"} alt={post.title} fill className="object-cover" unoptimized />
      </div>

      {/* Article Container */}
      <article className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Meta */}
          <div className="flex items-center text-xs text-secondary-500 mb-4">
            <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded mr-2">
              {post.category}
            </span>
            <span>{new Date(post.publishDate).toLocaleDateString("vi-VN")}</span>
            {post.author && (
              <>
                <span className="mx-2">•</span>
                <span>{post.author}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-secondary-900 mb-6">
            {post.title}
          </h1>

          {/* Content */}
          <div className="space-y-4 leading-7 text-secondary-700 prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="bg-secondary-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-secondary-900 mb-8">
              Bài viết liên quan
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((rp) => (
                <div key={rp._id} className="bg-white rounded-lg overflow-hidden shadow-card hover:shadow-lg transition-all">
                  <Link href={`/blog/${rp.slug}`} className="block relative aspect-[16/9] bg-secondary-100">
                    <Image src={rp.featuredImage || "/categories.jpg"} alt={rp.title} fill className="object-cover" unoptimized />
                  </Link>
                  <div className="p-6">
                    <div className="flex items-center text-xs text-secondary-500 mb-2">
                      <span className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded mr-2">
                        {rp.category}
                      </span>
                      <span>{new Date(rp.publishDate).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <Link href={`/blog/${rp.slug}`}>
                      <h3 className="font-bold text-lg text-secondary-900 mb-2 hover:text-primary-600 transition-colors">
                        {rp.title}
                      </h3>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const slug = params!.slug as string;
    const detailRes = await api.get(`/blogs/${slug}`);
    if (!detailRes.data.success) {
      return { props: { post: null, related: [] } };
    }

    const b = detailRes.data.data;
    const post: BlogDetail = {
      _id: b._id,
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt || b.description?.slice(0, 150) || "",
      content: b.content || "",
      featuredImage: b.featuredImage || "",
      publishDate: b.publishDate,
      category: b.category,
      author: b.author || "Admin",
    };

    // related posts by category
    let related: RelatedPost[] = [];
    try {
      const relRes = await api.get("/blogs", { params: { category: post.category, limit: 3 } });
      if (relRes.data.success) {
        related = relRes.data.data.blogs
          .filter((r: any) => r._id !== post._id)
          .map((r: any) => ({
            _id: r._id,
            title: r.title,
            slug: r.slug,
            featuredImage: r.featuredImage || "",
            publishDate: r.publishDate,
            category: r.category,
          }));
      }
    } catch {}

    return { props: { post, related } };
  } catch (error) {
    console.error("Failed to fetch blog detail:", error);
    return { props: { post: null, related: [] } };
  }
}; 