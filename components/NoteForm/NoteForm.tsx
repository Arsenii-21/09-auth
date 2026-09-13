"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createNote, noteTags } from "@/lib/api/clientApi";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearDraft, draft, setDraft } = useNoteStore();

  async function formAction(formData: FormData) {
    await createNote({
      title: String(formData.get("title") ?? "").trim(),
      content: String(formData.get("content") ?? "").trim(),
      tag: String(formData.get("tag") ?? "Todo") as NoteTag,
    });
    clearDraft();
    await queryClient.invalidateQueries({ queryKey: ["notes"] });
    router.push("/notes/filter/all");
  }

  return (
    <form className={css.form} action={formAction}>
      <label className={css.formGroup} htmlFor="title">
        Title
        <input
          className={css.input}
          id="title"
          name="title"
          defaultValue={draft.title}
          required
          onChange={(event) => setDraft({ title: event.target.value })}
        />
      </label>
      <label className={css.formGroup} htmlFor="content">
        Content
        <textarea
          className={css.textarea}
          id="content"
          name="content"
          rows={8}
          defaultValue={draft.content}
          required
          onChange={(event) => setDraft({ content: event.target.value })}
        />
      </label>
      <label className={css.formGroup} htmlFor="tag">
        Tag
        <select
          className={css.select}
          id="tag"
          name="tag"
          defaultValue={draft.tag}
          onChange={(event) => setDraft({ tag: event.target.value as NoteTag })}
        >
          {noteTags.map((tag) => (
            <option key={tag}>{tag}</option>
          ))}
        </select>
      </label>
      <div className={css.actions}>
        <button className={css.submit} type="submit">
          Create note
        </button>
        <button
          className={css.cancel}
          type="button"
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
