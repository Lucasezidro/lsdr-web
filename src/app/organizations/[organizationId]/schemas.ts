import z from "zod";

export const userSchema = z.object({
  user: z.object({
    role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']),
    occupation: z.string(),
  })
})