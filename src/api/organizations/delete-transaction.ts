import { api } from "../client"

export async function deleteTransaction(orgId: number, transactionId: number) {
  const result = await api.delete(`/organizations/${orgId}/transactions/${transactionId}`)

  return result.data
}