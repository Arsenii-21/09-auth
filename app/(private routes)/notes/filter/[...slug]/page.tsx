import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { fetchNotes } from "@/lib/api/serverApi";
import { openGraphImage, siteUrl } from "@/lib/seo";
import NotesClient from "./Notes.client";

export const dynamic = "force-dynamic";
interface FilterPageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: FilterPageProps): Promise<Metadata> {
  const filter = (await params).slug.join("/") || "all";
  const title = `${filter} notes | NoteHub`;
  const description = `Browse your ${filter} notes in NoteHub.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: siteUrl,
      images: [openGraphImage],
    },
  };
}

export default async function FilterPage({ params }: FilterPageProps) {
  const tag = (await params).slug.join("/") || "all";
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", tag, "", 1],
    queryFn: () => fetchNotes("", tag, 1),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
