import { z } from "zod";

const responseSchema = z.object({
  language: z.enum(["python", "javascript", "typescript", "java", "cpp"]),
  template: z.string(),
});

export type responseObject = z.infer<typeof responseSchema>;
