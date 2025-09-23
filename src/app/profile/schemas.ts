import z from "zod";

export const userSchema = z.object({
  user: z.object({
    email: z.email(),
    name: z.string(),
    phone_number: z.string(),
  })
})

export const organizationSchema = z.object({
  company_name: z.string(),
  email: z.email(),
  website_url: z.string(),
  phone: z.string(),
  founding_date: z.string(),
  description: z.string()
})

export const goalSchema = z.object({
  goal: z.object({
    title: z.string(),
    description: z.string(),
    due_date: z.string(),
    status: z.enum(['cancelled', 'in_progress', 'finished', 'paused']).optional(),
    target_amount: z.coerce.number(),
    goal_type: z.enum(['company_goal', 'employee_goal']).optional(),
    user_id: z.number().nullable().optional(),
    pinned: z.boolean(),
  })
})