import { api } from "../client"

export async function getTransactions(organizationId: number) {

  const result = await api.get(`/organizations/${organizationId}/transactions`)

  return result.data
}