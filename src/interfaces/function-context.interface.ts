import { z } from "zod";

const ParamSchema = z.object({
  name: z.string(),
  rawType: z.string(),
  mapped: z.any(), // Accepts any value
});

const ReturnSchema = z.object({
  raw: z.string(),
  mapped: z.any(),
});

const functionContext = z.object({
  functionName: z.string(),
  title: z.string(),
  description: z.string(),
  params: z.array(ParamSchema),
  returns: z.array(ReturnSchema),
  language: z.enum(["python", "javascript", "typescript", "java", "cpp"]),
});

export type functionContext = z.infer<typeof functionContext>;
