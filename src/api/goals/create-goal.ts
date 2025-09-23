import { api } from "../client"
import { GoalStatus, GoalType } from "./get-goals"

export interface CreateGoalRequest {
  orgId: number
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

export async function createGoal({ goal, orgId }: CreateGoalRequest) {
  const result = await api.post(`/organizations/${orgId}/goals`, {
    goal: goal,
  })

  return result.data
}