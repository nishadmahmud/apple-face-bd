import Link from "next/link";
import Image from "next/image";
import { FiChevronRight, FiClock, FiCalendar } from "react-icons/fi";
import { getBlogs } from "../../lib/api";
import { mapApiBlogsToPosts } from "../../lib/blogs";

export const metadata = {
  title: "Blogs | Tech Insights & Guides",
  description:
    "Explore the latest updates, offers, and insights from Apple Face BD BD.",
};

export default async function BlogsPage() {
  let blogPosts = [];

  try {
    const res = await getBlogs();
    const apiBlogs = Array.isArray(res?.data) ? res.data : [];
    blogPosts = mapApiBlogsToPosts(apiBlogs);
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gray-50 py-8 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-brand-purple transition-colors">
              Home
            </Link>
            <FiChevronRight size={14} />
            <span className="text-brand-purple font-bold">Blogs</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            Latest <span className="text-brand-purple">Blogs</span>
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl text-lg">
            Stay updated with recent offers, product highlights, and brand news.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogPosts.map((post) => (
              <Link
                href={`/blogs/${post.slug || post.id}`}
                key={post.id}
                className="group flex flex-col bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:border-brand-purple/20 transition-all duration-500"
              >
                <div className="w-full aspect-[16/10] relative overflow-hidden bg-gray-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-brand-purple text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar className="text-brand-purple" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiClock className="text-brand-purple" /> {post.readTime}
                    </span>
                  </div>
                  <h2 className="font-black text-gray-900 text-xl mb-4 leading-snug group-hover:text-brand-purple transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center gap-2 text-brand-purple font-black text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
                    Read Story <FiChevronRight />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCalendar size={32} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No stories found
            </h2>
            <p className="text-gray-500">
              We are publishing new stories. Please check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
