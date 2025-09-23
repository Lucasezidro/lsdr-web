export type GoalStatus = 'in_progress' | 'finished' | 'cancelled' | 'paused'
export type GoalType = 'company_goal' | 'employee_goal'

export interface Goal {
  id: number
  title: string
  description: string
  due_date: string
  status: GoalStatus
  organization_id: number
  created_at: string
  updated_at: string
  target_amount: string | null
  goal_type: GoalType
  user_id: number | null
  pinned: boolean
}