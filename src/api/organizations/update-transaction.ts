import { api } from "../client"

export interface UpdateTransactionRequest {
  transactionId: number
  orgId: number
  description: string
  amount: string
  transaction_type: 'income' | 'expense'
  date: string
}

export async function updateTransaction({
  transactionId,
  orgId,
  description,
  amount,
  transaction_type,
  date,
}: UpdateTransactionRequest) {
  const result = await api.patch(`/organizations/${orgId}/transactions/${transactionId}`, {
    description,
    amount,
    transaction_type,
    date,
  })

  return result.data
}