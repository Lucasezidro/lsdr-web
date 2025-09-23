'use client'

import { getGoals } from "@/api/goals/get-goals"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { UserContext } from "@/context/user-context"
import { translateGoalStatusStyle, translateGolaStatus } from "@/helpers/translate-goals"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Edit, Pin, Redo2, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useContext } from "react"
import { CreateGoal } from "./create-goal"
import { pinGoal } from "@/api/goals/pin-goal"
import { toast } from "sonner"
import { GoalStatus } from "@/api/goals/@types/goal"
import { changeGoalStatus } from "@/api/goals/change-goal-status"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { UpdateGoalStatus } from "./update-goal-status"

export function Goals({ userName }: { userName: string }) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { organizationId } = useContext(UserContext)

  const { data: goals } = useQuery({
    queryKey: ['goals'],
    queryFn: () => getGoals(organizationId!),
  })

  const { mutateAsync: pinGoalFn } = useMutation({
    mutationFn: ({ goal, orgId, goalId }: { goal: { pinned: boolean }, orgId: number, goalId: number }) => pinGoal({ goal, orgId, goalId }),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['goals'],
        type: 'active',
      })
    },
  })

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: ({ goal, orgId, goalId }: { goal: { status: GoalStatus }, orgId: number, goalId: number }) => changeGoalStatus({ goal, orgId, goalId }),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['goals'],
        type: 'active',
      })
    },
  })

  const pinnedGoal = goals?.find((g) => g.pinned)

  const mostRecentGoal = goals
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]

  const goalToShow = pinnedGoal ?? mostRecentGoal

  return (
    <div>
      {!goalToShow ? (
        <div className="flex flex-col items-center gap-6 justify-center">
          <h2>Você não possui metas cadastradas.</h2>

          <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="cursor-pointer hover:text-cyan-500">
                  Cadastrar nova meta
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar nova meta</DialogTitle>
                  <DialogDescription>
                    {userName}, aqui você pode cadastrar uma nova meta para acompanhar seu progresso e alcançar seus objetivos!
                  </DialogDescription>
                </DialogHeader>

                <CreateGoal />
              </DialogContent>
            </Dialog>
        </div>
      ) : (
        <div key={goalToShow.id} className="flex flex-col gap-4">
          <div>
            <h4 className="text-sm text-zinc-200">{goalToShow.title}</h4>
            <span className="text-xs text-zinc-400">{goalToShow.description}</span>
          </div>

          <div>
            <Tooltip>
              <TooltipTrigger>
                <Sheet>
                  <SheetTrigger asChild className="cursor-pointer">
                    <Badge className={goalToShow.status ? translateGoalStatusStyle[goalToShow.status] : ''}>
                      {goalToShow.status ? translateGolaStatus[goalToShow.status] : 'Unknown Status'}
                    </Badge>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>
                        Alterar status da meta {goalToShow.title}
                      </SheetTitle>
                    </SheetHeader>

                    <UpdateGoalStatus
                      status={goalToShow.status}
                      goalId={goalToShow.id}
                    />
                  </SheetContent>
                </Sheet>
              </TooltipTrigger>
              <TooltipContent>
                Clique para alterar o status da meta
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="absolute bottom-4 flex items-center justify-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="cursor-pointer hover:text-cyan-500">
                  Ver todas as suas metas
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Minhas metas</DialogTitle>
                  <DialogDescription>
                    {userName}, aqui você pode ver, editar e criar novas metas para acompanhar seu progresso e alcançar seus objetivos!
                  </DialogDescription>
                </DialogHeader>
                <Separator />

                <div className="max-h-80 overflow-y-auto pr-2">
                  {goals && goals.map((goal) => (
                    <div key={goal.id} className="mb-4">
                      <h4 className="text-sm text-zinc-200 font-bold">{goal.title}</h4>
                      <span className="text-xs text-zinc-400">{goal.description}</span>
                      <div className="mt-2 flex items-center gap-2">
                        <Sheet>
                          <SheetTrigger asChild className="cursor-pointer">
                            <Badge className={goal.status ? translateGoalStatusStyle[goal.status] : ''}>
                              {goal.status ? translateGolaStatus[goal.status] : 'Unknown Status'}
                            </Badge>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>
                                Alterar status da meta {goalToShow.title}
                              </SheetTitle>
                            </SheetHeader>

                            <UpdateGoalStatus
                              status={goal.status}
                              goalId={goal.id}
                            />
                          </SheetContent>
                        </Sheet>

                        {goal.status !== 'finished' && (
                          <>
                            <Button
                              className="cursor-pointer hover:text-cyan-500" variant='ghost'
                              onClick={() => router.push(`/profile/${goal.id}`)}
                            >
                              Editar <Edit />
                            </Button>
                            {!goal.pinned && (
                              <Button
                                className="cursor-pointer hover:text-emerald-500" variant='ghost'
                                onClick={async () => {
                                  return await pinGoalFn({ goal: { pinned: true }, goalId: goal.id, orgId: organizationId! })
                                    .then(() => toast.success(`Meta ${goal.title} fixada com sucesso!`))
                                    .catch(() => toast.error('Houve um erro ao tentar fixar a meta, por favor tente novamente mais tarde.'))
                                }}
                              >
                                Fixar <Pin />
                              </Button>
                            )}

                            {goal.pinned && (
                              <Button
                                className="cursor-pointer" variant='ghost'
                                onClick={async () => {
                                  return await pinGoalFn({ goal: { pinned: false }, goalId: goal.id, orgId: organizationId! })
                                    .then(() => toast.success(`Meta ${goal.title} removida dos fixos com sucesso!`))
                                    .catch(() => toast.error('Houve um erro ao tentar desfixar a meta, por favor tente novamente mais tarde.'))
                                }}
                              >
                                Desafixar <Pin className="text-cyan-500" />
                              </Button>
                            )}
                          </>
                        )}

                        {goal.status === 'paused' && (
                          <Button
                            className="cursor-pointer hover:text-indigo-400" variant='ghost'
                            onClick={async () => {
                              return await updateStatus({ goal: { status: 'in_progress' }, goalId: goal.id, orgId: organizationId! })
                                .then(() => toast.success(`Status da meta ${goal.title} foi alterado com sucesso!`))
                                .catch(() => toast.error('Houve um erro ao tentar atualizar o status da meta, por favor tente novamente mais tarde.'))
                            }}
                          >
                            Retomar <Redo2 />
                          </Button>
                        )}

                        {goal.status === 'finished' && (
                          <Button
                            className="cursor-pointer hover:text-cyan-500" variant='ghost'
                            onClick={() => router.push(`/profile/${goal.id}`)}
                          >
                            Ver detalhes <Search />
                          </Button>
                        )}
                      </div>
                      <Separator className="my-2" />
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="cursor-pointer hover:text-cyan-500">
                  Cadastrar nova meta
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cadastrar nova meta</DialogTitle>
                  <DialogDescription>
                    {userName}, aqui você pode cadastrar uma nova meta para acompanhar seu progresso e alcançar seus objetivos!
                  </DialogDescription>
                </DialogHeader>

                <CreateGoal />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  )
}
