import { z } from "zod";

export const questionSchema = z.object({
  question_id: z.string(),
  title: z.string(),
  description: z.string(),
  signature: z.object({
    function_name: z.string(),
    parameters: z
      .array(
        z.object({
          name: z.string(),
          type: z.string(),
        })
      )
      .nonempty(),
    returns: z.object({
      type: z.string(),
    }),
  }),
  language: z.enum(["python", "javascript", "java", "cpp"]),
});

export type QuestionPayload = z.infer<typeof questionSchema>;
