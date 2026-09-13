import type { Metadata } from "next";
import Link from "next/link";
import { openGraphImage, siteUrl } from "@/lib/seo";
import css from "./not-found.module.css";

export const metadata: Metadata = {
  title: "404 - Page not found | NoteHub",
  description: "The page you are looking for does not exist in NoteHub.",
  openGraph: {
    title: "404 - Page not found | NoteHub",
    description: "The page you are looking for does not exist in NoteHub.",
    url: siteUrl,
    images: [openGraphImage],
  },
};

export default function NotFound() {
  return (
    <main className={css.main}>
      <p>404</p>
      <h1>Page not found</h1>
      <Link href="/notes/filter/all">Back to notes</Link>
    </main>
  );
}
