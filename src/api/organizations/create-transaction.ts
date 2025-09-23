import { api } from "../client"

export interface CreateTransactionRequest {
  orgId: number
  transaction: {
    description: string
    amount: string
    transaction_type: 'income' | 'expense'
    date: string
  }
}

export async function createTransaction({ transaction, orgId }: CreateTransactionRequest) {
  const result = await api.post(`/organizations/${orgId}/transactions`, {
    transaction: {
      description: transaction.description,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      date: transaction.date,
    }
  })

  return result.data
}