import { api } from "../client"

export async function getOrganization(organizationId: number) {

  const result = await api.get(`/organizations/${organizationId}`)

  return result.data
}