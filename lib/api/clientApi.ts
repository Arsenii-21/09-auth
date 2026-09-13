import { api } from "./api";
import type { NewNote, Note, NotesResponse, NoteTag } from "@/types/note";
import type { User } from "@/types/user";

export const noteTags: NoteTag[] = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export async function fetchNotes(
  search = "",
  tag?: string,
  page = 1,
): Promise<NotesResponse> {
  const { data } = await api.get<NotesResponse>("/notes", {
    params: {
      ...(search && { search }),
      page,
      ...(tag && tag !== "all" && { tag }),
    },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(note: NewNote): Promise<Note> {
  const { data } = await api.post<Note>("/notes", note);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export async function register(payload: RegisterRequest): Promise<User> {
  const { data } = await api.post<User>("/auth/register", payload);
  return data;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export async function login(payload: LoginRequest): Promise<User> {
  const { data } = await api.post<User>("/auth/login", payload);
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

interface SessionResponse {
  success: boolean;
}

export async function checkSession(): Promise<boolean> {
  const { data } = await api.get<SessionResponse>("/auth/session");
  return data.success;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export interface UpdateMeRequest {
  username?: string;
}

export async function updateMe(payload: UpdateMeRequest): Promise<User> {
  const { data } = await api.patch<User>("/users/me", payload);
  return data;
}
