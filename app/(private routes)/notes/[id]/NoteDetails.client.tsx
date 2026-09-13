"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchNoteById } from "@/lib/api/clientApi";
import { formatDate } from "@/lib/formatDate";
import css from "./NoteDetails.module.css";

export default function NoteDetails() {
  const { id } = useParams<{ id: string }>();
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p className={css.content}>Loading, please wait...</p>;
  if (isError || !note)
    return <p className={css.content}>Could not fetch note details.</p>;

  return (
    <main className={css.main}>
      <div className={css.container}>
        <div className={css.item}>
          <Link className={css.backBtn} href="/notes/filter/all">
            ← All notes
          </Link>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={css.tag}>{note.tag}</p>
          <p className={css.content}>{note.content}</p>
          <p className={css.date}>{formatDate(note.createdAt)}</p>
        </div>
      </div>
    </main>
  );
}
