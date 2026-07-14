export type ContactFieldName = "name" | "email" | "company" | "subject" | "message";

export type ContactFieldErrors = Partial<Record<ContactFieldName, string>>;

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: ContactFieldErrors;
};

export const initialContactState: ContactFormState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};
