'use client'

import { getGoal } from "@/api/goals/get-goal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserContext } from "@/context/user-context"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useContext, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { goalSchema } from "../schemas"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CircleQuestionMark } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateGoal, UpdateGoalRequest } from "@/api/goals/update-goal"
import { toast } from "sonner"
import { translateGolaStatus } from "@/helpers/translate-goals"

interface GoalFormProps {
  goalId: number
}

type UpdateGoalFormData = z.infer<typeof goalSchema>

export function GoalForm({ goalId }: GoalFormProps) {
  const queryClient = useQueryClient()
  const { organizationId, role } = useContext(UserContext)

  const { data: goal } = useQuery({
    queryKey: ['goal', goalId],
    queryFn: () => getGoal(organizationId!, goalId)
  })

  const { mutateAsync } = useMutation({
    mutationFn: ({ goal }: UpdateGoalRequest) => updateGoal({
      goal,
      orgId: organizationId!,
      goalId
    }),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['goals'], type: 'active' })
      queryClient.refetchQueries({ queryKey: ['goal', goalId], type: 'active' })
    }, 
  })

  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<UpdateGoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      goal: {
        title: "",
        description: "",
        due_date: "",
        status: goal?.status ?? "in_progress",
        target_amount: 0,
        pinned: false,
        goal_type: "employee_goal",
      }
    }
  })

  useEffect(() => {
    if (goal) {
      reset({
        goal: {
          title: goal.title ?? "",
          description: goal.description ?? "",
          due_date: goal.due_date ?? "",
          target_amount: goal.target_amount ?? 0,
          pinned: goal.pinned ?? false,
          goal_type: goal.goal_type ?? "employee_goal",
        }
      })
    }
  }, [goal, reset])

  const compareGoalType = {
    'employee_goal': 'Meta Pessoal',
    'company_goal': 'Meta da empresa'
  }

  async function handleUpdateGoal(data: UpdateGoalFormData) {
    await mutateAsync({
      goalId: goal?.id!,
      orgId: organizationId!,
      goal: {
        title: data.goal.title,
        description: data.goal.description,
        due_date: data.goal.due_date,
        target_amount: data.goal.target_amount || 0,
        pinned: data.goal.pinned ?? false,
        goal_type: role === 'ADMIN' ? data.goal.goal_type : goal?.goal_type,
        user_id: goal?.user_id ?? null,
      }
    })
      .then(() => toast.success('Meta atualizada com sucesso!'))
      .catch(() => toast.error('Erro ao atualizar meta.'))

    if (errors) {
      console.log(errors)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleUpdateGoal)} className="flex flex-col gap-4 mt-10">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        Editar Meta <span className="text-cyan-500">{goal?.title}</span>
      </h1>

      <Label className="font-bold text-zinc-400">Titulo</Label>
      <Input placeholder="Titulo" {...register('goal.title')} />

      <Label className="font-bold text-zinc-400">Data de conclusão</Label>
      <Input 
        type="date" 
        placeholder="Data de conclusão" 
        {...register('goal.due_date')} 
        min={new Date().toISOString().split("T")[0]} 
        max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]} 
      />

      <Label className="font-bold text-zinc-400">Valor</Label>
      <Input placeholder="Valor" {...register('goal.target_amount', { valueAsNumber: true })} />

      <Label className="font-bold text-zinc-400">Descrição</Label>
      <Textarea placeholder="Descrição" {...register('goal.description')} />

      <div className="my-4">
        <Controller 
          name="goal.pinned"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <Checkbox 
                id="pinned" 
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(!!checked)}
                className="cursor-pointer"
              />
              <Label htmlFor="pinned" className="font-bold text-zinc-400 cursor-pointer">
                Manter meta fixa
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CircleQuestionMark className="text-cyan-400 size-4 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Meta fixa é a que está exposta na página do seu perfil.</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        />
      </div>

      {role === 'ADMIN' && (
        <>
          <Label className="font-bold text-zinc-400">Tipo da meta</Label>
          <Controller 
            name='goal.goal_type'
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={compareGoalType[field.value as keyof typeof compareGoalType] ?? ''} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Selecione o tipo da meta</SelectLabel>
                    <SelectItem value='company_goal'>Meta da empresa</SelectItem>
                    <SelectItem value='employee_goal'>Meta pessoal</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
        </>
      )}
      <Button 
        className="cursor-pointer bg-cyan-500 hover:bg-cyan-600 font-bold mt-4"
        type="submit"
      >
        Salvar meta
      </Button>
    </form>
  )
}
