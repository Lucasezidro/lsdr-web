import { api } from "../client"
import { GoalStatus } from "./@types/goal"

interface ChangeGoalStatusRequest {
  orgId: number
  goalId: number
  goal: {
    status: GoalStatus
  }
}

export async function changeGoalStatus({
  goal,
  orgId,
  goalId,
}: ChangeGoalStatusRequest) {
  const result = await api.patch(`/organizations/${orgId}/goals/${goalId}`, {
    goal: goal,
  })

  return result.data
}