import Image from "next/image";
import { notFound } from "next/navigation";
import { FiCalendar, FiClock } from "react-icons/fi";
import { getDummyBlogBySlug, getDummyBlogPosts } from "../../../lib/dummyBlogs";
import PageBreadcrumb from "../../../components/Shared/PageBreadcrumb";

export function generateStaticParams() {
  return getDummyBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams?.slug === "string" ? resolvedParams.slug : "";
  const post = getDummyBlogBySlug(slug);
  if (!post) return { title: "Blog | Apple Face" };

  return {
    title: `${post.title} | Apple Face`,
    description: post.excerpt,
  };
}

export default async function BlogDetailsPage({ params }) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams?.slug === "string" ? resolvedParams.slug : "";
  const post = getDummyBlogBySlug(slug);
  if (!post) notFound();

  return (
    <div className="bg-card-bg min-h-screen pb-20 md:pb-10">
      <div className="bg-[#0a0a0a] text-white border-b border-white/10">
        <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10">
          <PageBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Blogs", href: "/blogs" },
              { label: post.title },
            ]}
            className="mb-4 [&_span]:text-gray-300 [&_a]:text-gray-400 [&_a:hover]:text-white [&_span:last-child]:text-white"
          />

          <span className="inline-flex bg-brand-primary/20 text-brand-primary text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 border border-brand-primary/30">
            {post.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold leading-tight max-w-3xl">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-5 text-xs md:text-sm font-semibold text-gray-400">
            <span className="flex items-center gap-1.5">
              <FiCalendar className="text-brand-primary" /> {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock className="text-brand-primary" /> {post.readTime}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-10 overflow-hidden">
        <div className="w-full aspect-[16/9] relative overflow-hidden rounded-lg bg-card-bg border border-gray-200 mb-8">
          <Image src={post.image} alt={post.title} fill unoptimized className="object-cover" />
        </div>

        <div className="min-w-0 overflow-hidden bg-white rounded-lg border border-gray-200 p-6 md:p-8">
          <div className="mb-6 text-lg md:text-xl font-semibold text-gray-800 leading-relaxed">
            {post.excerpt}
          </div>

          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-brand-primary overflow-hidden break-words"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </div>
  );
}
