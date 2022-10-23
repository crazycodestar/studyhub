import { z } from "zod";

const signInValidation = z.object({
  email: z.string().email({ message: "email is required" }).min(1),
});

export type signInValidationType = z.infer<typeof signInValidation>;
export default signInValidation;
