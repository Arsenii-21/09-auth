import type { Metadata } from "next";
import NoteForm from "@/components/NoteForm/NoteForm";
import { openGraphImage } from "@/lib/seo";
import css from "./page.module.css";

export const metadata: Metadata = {
  title: "Create a note | NoteHub",
  description: "Create and save a new note in your NoteHub workspace.",
  openGraph: {
    title: "Create a note | NoteHub",
    description: "Create and save a new note in your NoteHub workspace.",
    url: "https://notehub.com/notes/action/create",
    images: [openGraphImage],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
