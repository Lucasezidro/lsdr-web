import { api } from "../client"

export async function getDashboard(organizationId: number) {

  const result = await api.get(`/organizations/${organizationId}/dashboard`)

  return result.data
}