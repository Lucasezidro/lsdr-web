import { api } from "../client"

export async function removeMemberFromOrganization(orgId: number, memberId: number) {
  const result = await api.delete(`/organizations/${orgId}/members/${memberId}`)

  return result.data
}