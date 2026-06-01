import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FiCalendar, FiClock, FiChevronRight } from "react-icons/fi";
import { getBlogs } from "../../../lib/api";
import { mapApiBlogsToPosts, parseBlogIdFromSlug } from "../../../lib/blogs";

export default async function BlogDetailsPage({ params }) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams?.slug === "string" ? resolvedParams.slug : "";
  const blogId = parseBlogIdFromSlug(slug);
  if (!blogId) notFound();

  let posts = [];

  try {
    const res = await getBlogs();
    const apiBlogs = Array.isArray(res?.data) ? res.data : [];
    posts = mapApiBlogsToPosts(apiBlogs);
  } catch (error) {
    console.error("Failed to fetch blog details:", error);
  }

  const post = posts.find((item) => Number(item.id) === Number(blogId));
  if (!post) notFound();

  return (
    <div className="bg-white min-h-screen pb-16">
      <div className="bg-gray-50 py-8 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 md:px-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-brand-purple transition-colors">
              Home
            </Link>
            <FiChevronRight size={14} />
            <Link
              href="/blogs"
              className="hover:text-brand-purple transition-colors"
            >
              Blogs
            </Link>
            <FiChevronRight size={14} />
            <span className="text-brand-purple font-bold truncate">
              {post.title}
            </span>
          </nav>

          <span className="inline-flex bg-brand-purple/10 text-brand-purple text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight">
            {post.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-5 text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wide">
            <span className="flex items-center gap-1.5">
              <FiCalendar className="text-brand-purple" /> {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock className="text-brand-purple" /> {post.readTime}
            </span>
          </div>
        </div>
      </div>

      <article className="max-w-5xl mx-auto px-4 md:px-6 pt-10 overflow-hidden">
        <div className="w-full aspect-[16/9] md:aspect-[16/7] relative overflow-hidden rounded-3xl bg-gray-100 shadow-sm mb-10">
          <Image
            src={post.image}
            alt={post.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>

        <div className="min-w-0 overflow-hidden" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
          <div className="mb-6 text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
            {post.excerpt}
          </div>

          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-brand-purple overflow-hidden break-words"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </div>
  );
}
