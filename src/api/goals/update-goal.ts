import { api } from "../client"
import { GoalStatus, GoalType } from "./@types/goal"

export interface UpdateGoalRequest {
  orgId: number
  goalId: number
  goal: {
    title: string
    description: string
    due_date: string
    status?: GoalStatus     
    target_amount: number
    goal_type?: GoalType 
    user_id?: number | null   
    pinned: boolean
  }
}

export async function updateGoal({
  goal,
  orgId,
  goalId,
}: UpdateGoalRequest) {
  const result = await api.put(`/organizations/${orgId}/goals/${goalId}`, {
    goal: goal,
  })

  return result.data
}