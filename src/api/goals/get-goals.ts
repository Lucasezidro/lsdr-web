import { api } from "../client"
import { Goal } from "./@types/goal"

export async function getGoals(organizationId: number): Promise<Goal[]> {
  const result = await api.get(`/organizations/${organizationId}/goals`)

  return result.data
}