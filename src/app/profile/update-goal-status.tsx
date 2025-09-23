'use client'

import { GoalStatus } from '@/api/goals/@types/goal'
import { changeGoalStatus } from '@/api/goals/change-goal-status'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserContext } from '@/context/user-context'
import { translateGolaStatus } from '@/helpers/translate-goals'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'

interface UpdateGoalStatusProps {
  status: 'in_progress' | 'cancelled' | 'finished' | 'paused'
  goalId: number
}

export function UpdateGoalStatus({ status, goalId }: UpdateGoalStatusProps) {
  const { organizationId } = useContext(UserContext)
  const queryClient = useQueryClient()

  const goalStatus: GoalStatus[] = ['in_progress', 'cancelled', 'finished', 'paused']
  const availableStatuses = goalStatus.filter(s => s !== status)

  const { mutateAsync } = useMutation({
    mutationFn: (s: GoalStatus) => changeGoalStatus({ goal: { status: s }, orgId: organizationId!, goalId }),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['goals'],
        type: 'active',
      })
    },
  })

  async function onStatusChange(newStatus: string) {
    await mutateAsync(newStatus as GoalStatus)
  }

  return (
    <div className='p-4'>
      <Select onValueChange={(e) => onStatusChange(e)}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={translateGolaStatus[status]} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Selecione o tipo da meta</SelectLabel>
            {availableStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {translateGolaStatus[status]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}