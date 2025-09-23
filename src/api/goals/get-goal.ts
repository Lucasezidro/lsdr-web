import { api } from "../client";
import { Goal } from "./@types/goal";

export async function getGoal(orgId: number, goalId: number): Promise<Goal> {
  const result = await api.get(`/organizations/${orgId}/goals/${goalId}`)

  return result.data
}