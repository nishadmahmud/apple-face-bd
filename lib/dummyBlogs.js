import { parseBlogIdFromSlug, slugify } from "./blogs";

/** Placeholder blog posts (API disabled until content is ready). */
export const DUMMY_BLOG_POSTS = [
  {
    id: 1,
    slug: "how-to-choose-your-next-iphone-in-bangladesh-1",
    title: "How to Choose Your Next iPhone in Bangladesh",
    excerpt:
      "A practical guide to picking the right iPhone model, storage, and warranty option when shopping at Apple Face BD.",
    content: `
      <p>Buying an iPhone in Bangladesh means balancing budget, official warranty, and the features you actually use every day. Start by deciding what matters most: camera quality, battery life, or a compact size.</p>
      <p>At <strong>Apple Face BD</strong>, we recommend matching storage to how you use your phone. If you shoot a lot of 4K video or keep large apps, 256GB is a safer long-term choice than 128GB.</p>
      <h2>Warranty and authenticity</h2>
      <p>Always confirm whether the device is covered by official Apple warranty or store support. Genuine units protect resale value and give you peace of mind for repairs.</p>
      <p>Visit our Kuril showroom or message us on WhatsApp if you want help comparing models side by side before you buy.</p>
    `,
    date: "March 15, 2026",
    category: "Buying Guide",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    slug: "samsung-galaxy-tips-for-better-battery-life-2",
    title: "Samsung Galaxy Tips for Better Battery Life",
    excerpt:
      "Simple settings and habits that help your Galaxy phone last longer between charges.",
    content: `
      <p>Modern Galaxy phones are powerful, but heavy use can drain the battery quickly. A few adjustments can add hours of real-world use without sacrificing performance.</p>
      <h2>Display and refresh rate</h2>
      <p>Lower screen brightness indoors and switch to adaptive refresh rate. The panel is often the biggest power draw on any smartphone.</p>
      <h2>Background apps</h2>
      <p>Review apps with high background activity in Settings. Disabling unnecessary location access and push sync for non-essential apps helps a lot.</p>
      <p>Need a phone with stronger battery out of the box? Ask our team at Apple Face BD—we can suggest models that fit your daily routine.</p>
    `,
    date: "March 8, 2026",
    category: "Tips & Tricks",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    slug: "why-shop-authentic-gadgets-at-apple-face-bd-3",
    title: "Why Shop Authentic Gadgets at Apple Face BD",
    excerpt:
      "Transparent pricing, genuine products, and local support—what sets Apple Face BD apart for tech shoppers in Dhaka.",
    content: `
      <p>When you buy phones, tablets, or accessories online, it is easy to focus only on price. Authenticity, after-sales care, and clear return policies matter just as much.</p>
      <p><strong>Apple Face BD</strong> focuses on genuine devices and honest advice. Our team helps you compare specs, EMI options, and warranty coverage before checkout.</p>
      <h2>Visit us in Kuril</h2>
      <p>Our showroom at KA-244, Kuril Progoti Shoroni lets you see products in person, ask questions, and pick up your order the same day when stock is available.</p>
      <p>Call or WhatsApp us at 01707-607080, or email applefacebd@gmail.com for product availability and offers.</p>
    `,
    date: "February 28, 2026",
    category: "Apple Face BD",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
  },
].map((post) => ({
  ...post,
  slug: post.slug || `${slugify(post.title)}-${post.id}`,
}));

export function getDummyBlogPosts() {
  return DUMMY_BLOG_POSTS;
}

export function getDummyBlogBySlug(slug = "") {
  const normalized = decodeURIComponent(String(slug || "")).trim();
  const id = parseBlogIdFromSlug(normalized);
  return (
    DUMMY_BLOG_POSTS.find(
      (post) =>
        post.slug === normalized ||
        (id != null && Number(post.id) === Number(id))
    ) ?? null
  );
}
