import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
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

// Returns the raw response so callers (e.g. proxy) can forward refreshed Set-Cookie headers.
export async function checkSession(): Promise<AxiosResponse<SessionResponse>> {
  const cookieStore = await cookies();
  return api.get<SessionResponse>("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
}
