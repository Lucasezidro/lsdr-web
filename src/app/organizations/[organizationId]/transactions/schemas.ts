import z from "zod";

export const transactionSchema = z.object({
  description: z.string(),
  amount: z.string(),
  transaction_type: z.enum(['income', 'expense']),
  date: z.string(),
})

export const createTransactionSchema = z.object({
  transaction: z.object({
    description: z.string(),
    amount: z.string(),
    transaction_type: z.enum(['income', 'expense']),
    date: z.string(),
  })
})