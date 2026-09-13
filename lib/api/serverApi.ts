import { cookies } from "next/headers";
import { api } from "./api";
import type { Note, NotesResponse } from "@/types/note";
import type { User } from "@/types/user";

export async function fetchNotes(
  search = "",
  tag?: string,
  page = 1,
): Promise<NotesResponse> {
  const cookieStore = await cookies();
  const { data } = await api.get<NotesResponse>("/notes", {
    params: {
      ...(search && { search }),
      page,
      ...(tag && tag !== "all" && { tag }),
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}

export async function getMe(): Promise<User> {
  const cookieStore = await cookies();
  const { data } = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}

interface SessionResponse {
  success: boolean;
}

export async function checkSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const { data } = await api.get<SessionResponse>("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data.success;
}
