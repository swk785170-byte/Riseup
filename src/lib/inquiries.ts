/** Contact-form submission types. */

export const PROJECT_TYPES = [
  "Web Package",
  "LMS & Student Management",
  "Other",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];

export type DbInquiry = {
  id: string;
  name: string;
  email: string;
  project_type: string;
  message: string;
  handled: boolean;
  created_at: string;
};
