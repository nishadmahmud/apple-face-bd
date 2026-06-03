import { redirect } from "next/navigation";

export default async function RegisterPage({ searchParams }) {
  const params = await searchParams;
  const q = new URLSearchParams({ mode: "register" });
  if (params?.redirect) q.set("redirect", String(params.redirect));
  redirect(`/login?${q.toString()}`);
}
