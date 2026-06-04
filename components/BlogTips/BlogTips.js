"use client";

import Image from "next/image";
import Link from "next/link";
import SectionIntro from "../Shared/SectionIntro";
import SectionShell from "../Shared/SectionShell";

function BlogPostCard({ post, large = false }) {
  return (
    <Link
      href={`/blogs/${post.slug || post.id}`}
      className={`group flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md hover:border-brand-primary/30 transition-all h-full ${
        large ? "" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-gray-100 ${
          large ? "aspect-[16/10]" : "aspect-[16/9]"
        }`}
      >
        <Image
          src={post.image || post.imageUrl || "/no-image.svg"}
          alt={post.title || post.name}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {post.category && (
          <span className="absolute top-2 left-2 bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded">
            {post.category}
          </span>
        )}
      </div>
      <div className={`flex flex-col flex-grow ${large ? "p-5 md:p-6" : "p-4"}`}>
        <h3
          className={`font-bold text-gray-900 mb-2 leading-snug group-hover:text-brand-primary transition-colors line-clamp-2 ${
            large ? "text-lg md:text-xl" : "text-sm"
          }`}
        >
          {post.title || post.name}
        </h3>
        <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2 flex-grow">
          {post.excerpt}
        </p>
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-3">
          {post.readTime || post.date}
        </span>
      </div>
    </Link>
  );
}

export default function BlogTips({ posts = [] }) {
  const displayPosts = Array.isArray(posts) ? posts : [];
  const [featured, ...rest] = displayPosts;
  const sidePosts = rest.slice(0, 2);
  const mobilePosts = displayPosts.slice(0, 2);

  return (
    <SectionShell variant="muted" border>
      <SectionIntro
        title="Tech"
        highlight="Insights"
        subtitle="Latest tech news and buying guides."
        href="/blogs"
        linkLabel="View all"
      />

      {displayPosts.length > 0 ? (
        <>
          <div className="hidden lg:grid lg:grid-cols-[1.2fr_1fr] gap-5">
            {featured && (
              <div className="min-h-[320px]">
                <BlogPostCard post={featured} large />
              </div>
            )}
            <div className="flex flex-col gap-4">
              {sidePosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          <div className="lg:hidden flex flex-col gap-4">
            {mobilePosts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
            {displayPosts.length > 2 && (
              <Link
                href="/blogs"
                className="text-center text-sm font-bold text-brand-primary hover:underline py-2"
              >
                View all articles
              </Link>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-gray-500 text-sm border border-dashed border-gray-300 rounded-lg bg-white">
          No blog posts available right now.
        </div>
      )}
    </SectionShell>
  );
}
