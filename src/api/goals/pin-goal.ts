import { api } from "../client"

interface PinGoalRequest {
  orgId: number
  goalId: number
  goal: {
    pinned: boolean
  }
}

export async function pinGoal({
  goal,
  orgId,
  goalId,
}: PinGoalRequest) {
  const result = await api.patch(`/organizations/${orgId}/goals/${goalId}`, {
    goal: goal,
  })

  return result.data
}