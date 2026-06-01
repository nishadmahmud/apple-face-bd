import { redirect } from "next/navigation";

export default async function LegacySubcategoryRoute({ params }) {
  const resolvedParams = await params;
  const categorySlug = typeof resolvedParams?.slug === "string" ? resolvedParams.slug : "";
  const subcategorySlug = typeof resolvedParams?.subslug === "string" ? resolvedParams.subslug : "";

  if (!categorySlug) {
    redirect("/category");
  }

  if (!subcategorySlug) {
    redirect(`/category/${categorySlug}`);
  }

  redirect(
    `/category/${categorySlug}?subcat=${encodeURIComponent(subcategorySlug)}`
  );
}

