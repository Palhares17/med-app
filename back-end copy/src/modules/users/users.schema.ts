import { z } from "zod";

export const UserResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
});
export type UserResponse = z.infer<typeof UserResponseSchema>;

export const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
