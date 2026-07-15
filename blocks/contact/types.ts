export type ContactStatus = "idle" | "success" | "error";

export interface ContactState {
  status: ContactStatus;
  message: string | null;
}
