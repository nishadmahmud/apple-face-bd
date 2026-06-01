import { redirect } from "next/navigation";

export default async function BlogLegacyDetailsPage({ params }) {
  const resolvedParams = await params;
  const slug = typeof resolvedParams?.slug === "string" ? resolvedParams.slug : "";
  redirect(`/blogs/${slug}`);
}
