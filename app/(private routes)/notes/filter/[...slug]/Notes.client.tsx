"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api/clientApi";
import { formatDate } from "@/lib/formatDate";
import css from "./Notes.module.css";

interface NotesClientProps {
  tag: string;
}

export default function NotesClient({ tag }: NotesClientProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const handleSearchChange = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const { data, isError, isLoading } = useQuery({
    queryKey: ["notes", tag, search, page],
    queryFn: () => fetchNotes(search, tag, page),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <p className={css.filter}>Filter: {tag}</p>
        <SearchBox value={search} onChange={handleSearchChange} />
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </div>
      {isLoading && <p className={css.message}>Loading notes...</p>}
      {isError && <p className={css.message}>Unable to load notes.</p>}
      {!isLoading && !isError && notes.length === 0 && (
        <p className={css.message}>No notes found.</p>
      )}
      <ul className={css.grid}>
        {notes.map((note) => (
          <li className={css.card} key={note.id}>
            <Link href={`/notes/${note.id}`}>
              <span className={css.tag}>{note.tag}</span>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
              <time dateTime={note.createdAt}>
                {formatDate(note.createdAt)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination
          pageCount={totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
