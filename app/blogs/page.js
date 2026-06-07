import Link from "next/link";
import Image from "next/image";
import { FiChevronRight, FiClock, FiCalendar } from "react-icons/fi";
import { getDummyBlogPosts } from "../../lib/dummyBlogs";
import PageHero from "../../components/Shared/PageHero";

export const metadata = {
  title: "Blogs | Apple Face",
  description: "Explore the latest updates, offers, and insights from Apple Face.",
};

export default function BlogsPage() {
  const blogPosts = getDummyBlogPosts();

  return (
    <div className="bg-card-bg min-h-screen pb-20 md:pb-10">
      <PageHero
        eyebrow="Insights"
        title="Latest"
        highlight="Blogs"
        description="Stay updated with recent offers, product highlights, and brand news."
      />

      <div className="max-w-site mx-auto px-4 md:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogPosts.map((post) => (
            <Link
              href={`/blogs/${post.slug}`}
              key={post.id}
              className="group flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-brand-primary/40 hover:shadow-md transition-all duration-300"
            >
              <div className="w-full aspect-[16/10] relative overflow-hidden bg-card-bg">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-md text-brand-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-brand-primary/20">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-5 md:p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">
                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="text-brand-primary" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiClock className="text-brand-primary" /> {post.readTime}
                  </span>
                </div>
                <h2 className="font-extrabold text-gray-900 text-lg mb-3 leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-2 text-brand-primary font-bold text-sm group-hover:gap-3 transition-all">
                  Read Story <FiChevronRight />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
