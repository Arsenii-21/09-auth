"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api/clientApi";
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
      {notes.length > 0 && <NoteList notes={notes} />}
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
