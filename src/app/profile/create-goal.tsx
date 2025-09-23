'use client'

import z from "zod"
import { goalSchema } from "./schemas"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useContext } from "react"
import { UserContext } from "@/context/user-context"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createGoal, CreateGoalRequest } from "@/api/goals/create-goal"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CircleQuestionMark } from "lucide-react"
import { toast } from "sonner"

type CreateGoalFormData = z.infer<typeof goalSchema>

export function CreateGoal() {
  const queryClient = useQueryClient()
  const { role, organizationId, userId } = useContext(UserContext)
  const { register, handleSubmit, control } = useForm<CreateGoalFormData>({
    resolver: zodResolver(goalSchema)
  })

  const { mutateAsync } = useMutation({
    mutationFn: (data: CreateGoalRequest) => createGoal(data),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['goals'],
        type: 'active',
      })
    },
  })

  async function handleCreateGoal(data: CreateGoalFormData) {
    console.log("Enviando dados:", data)
    await mutateAsync({
      goal: {
        title: data.goal.title,
        description: data.goal.description,
        due_date: data.goal.due_date,
        status: 'in_progress',
        target_amount: data.goal.target_amount || 0,
        goal_type: role === 'ADMIN' ? data.goal.goal_type : 'employee_goal',
        user_id: userId,
        pinned: data.goal.pinned || false,
      },
      orgId: organizationId!,
    })
    .then(() => {
      toast.success('Meta criada com sucesso!')
    }).catch((e) => {
      toast.error('Erro ao criar meta. Tente novamente.')
      console.error(e)
    })
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(handleCreateGoal)}>
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
      <Input placeholder="Valor" {...register('goal.target_amount')} />

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
              <Label htmlFor="pinned" className="font-bold text-zinc-400 cursor-pointer">Manter meta fixa</Label>
              <Tooltip>
                <TooltipProvider>
                  <TooltipTrigger>
                    <CircleQuestionMark className="text-cyan-400 size-4 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Meta fixa é a que está exposta na página do seu perfil.</span>
                  </TooltipContent>
                </TooltipProvider>
              </Tooltip>
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
              <Select 
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder='Selecione' />
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
        Cadastrar meta
      </Button>
    </form>
  )
}