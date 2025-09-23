'use-client'

import { adminUpdateUser } from "@/api/organizations/admin-update-user"
import { getMembersOrganizations, MembersOrganizationResponse } from "@/api/organizations/get-members-organizations"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserContext } from "@/context/user-context"
import { fallbackImageFormatter } from "@/helpers/fallback-image-formatter"
import { translateRoleStyle } from "@/helpers/translate-role"
import { usePermissions } from "@/hooks/usePermissions"
import { SelectValue } from "@radix-ui/react-select"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Edit, Trash } from "lucide-react"
import { useContext, useState } from "react"
import z from "zod"
import { userSchema } from "./schemas"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { removeMemberFromOrganization } from "@/api/organizations/remove-member-from-organization"
import { inviteMember } from "@/api/organizations/invite-member"

type UserFormData = z.infer<typeof userSchema>

export function MembersList() {
  const queryClient = useQueryClient()
  const { organizationId, role, userId } = useContext(UserContext)
  const { isAdmin } = usePermissions(role)
  const { register, handleSubmit, control, reset } = useForm<UserFormData>({
    resolver: zodResolver(userSchema)
  })

  const [invitedMemberEmail, setInvitedMemberEmail] = useState('')

  const { data: members } = useQuery({
    queryKey: ['organization', organizationId, 'members'],
    queryFn: () => getMembersOrganizations(organizationId!),
  })


  const { mutateAsync, isPending } = useMutation({
    mutationFn: (data: { userId: number, role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE', occupation?: string }) => adminUpdateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId, 'members'] })
    }
  })

  const { mutateAsync: removeMember } = useMutation({
    mutationFn: ({ orgId, memberId }: { orgId: number; memberId: number }) => removeMemberFromOrganization(orgId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization', organizationId, 'members'] })
    }
  })

  const roles = ['ADMIN', 'MANAGER', 'EMPLOYEE']
  const availableRoles = roles.filter(r => r !== role)

  async function handleUpdateUser(userId: number, data: UserFormData) {
    await mutateAsync({ userId, role: data.user.role, occupation: data.user.occupation })
      .then(() => {
        toast.success('Usuário atualizado com sucesso!')
      })
      .catch((e) => {
        toast.error('Erro ao atualizar usuário. Tente novamente.')
        console.error(e)
      })
  }

  async function handleRemoveMember(orgId: number, memberId: number) {
    await removeMember({ orgId, memberId })
      .then(() => {
        toast.success('Membro removido com sucesso!')
      })
      .catch((e) => {
        toast.error('Erro ao remover membro. Tente novamente.')
        console.error(e)
      })
  }

  function handleOpenDialog(member: MembersOrganizationResponse) {
    reset({
      user: {
        role: member.role,
        occupation: member.occupation ?? ''
      }
    })
  }

  async function handleInviteMemberToOrganization() {
    await inviteMember({ orgId: organizationId!, email: invitedMemberEmail, role: 'EMPLOYEE' })
      .then((res) => toast.success(res.message))
      .catch(() => toast.error('Erro ao enviar convite. Tente novamente.'))
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">Membros da organização</h1>
        {role === 'ADMIN' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer" variant='ghost'>Convidar membro</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Convidar membro</DialogTitle>
                <DialogDescription>Por padrão a role do membro será "employee", mas você pode alterá-la na listagem de membros</DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4">
                <Input 
                  placeholder="E-mail" 
                  type="email" 
                  value={invitedMemberEmail}
                  onChange={(e) => setInvitedMemberEmail(e.target.value)}
                />

                <Button 
                  className="w-full cursor-pointer bg-cyan-500 font-bold hover:bg-cyan-600"
                  disabled={!invitedMemberEmail || !invitedMemberEmail.includes('@')}
                  onClick={handleInviteMemberToOrganization}
                >
                  Enviar convite
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Foto</TableHead>
            <TableHead>Funcionário</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Permissão</TableHead>
            <TableHead>Data de inicio</TableHead>
            <TableHead>Última atualização</TableHead>
            {isAdmin && <TableHead>Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members &&
            [...members] 
              .sort((a, b) => {
                const rolePriority: Record<string, number> = {
                  ADMIN: 1,
                  MANAGER: 2,
                  EMPLOYEE: 3,
                }

                return (rolePriority[a.role] ?? 99) - (rolePriority[b.role] ?? 99)
              })
              .map(member => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={member.avatar_url ?? ''} />
                      <AvatarFallback>
                        {fallbackImageFormatter(member.name)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>

                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.occupation ?? '-'}</TableCell>
                  <TableCell>
                    <Badge className={translateRoleStyle[member.role]}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(member.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {new Date(member.updated_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  {isAdmin && userId !== member.id && <TableCell className="flex items-center">
                    <Dialog onOpenChange={(open) => open && handleOpenDialog(member)}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost"
                          className="cursor-pointer"
                          >
                            <Edit className="text-cyan-400" />
                        </Button> 
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Editar dados do usuário {member.name}</DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit((data) => handleUpdateUser(member.id, data))}>
                          <div className="mt-4 flex flex-col gap-4">
                            <Label>Permissão</Label>

                            <Controller 
                              name="user.role"
                              control={control}
                              render={({ field }) => (
                                <Select 
                                  disabled={userId === member.id}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={member.role} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Selecione a permissão</SelectLabel>
                                      {availableRoles.map(role => (
                                        <SelectItem key={role} value={role}>{role}</SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              )}
                            />

                            <Label>Cargo</Label>

                            <Input 
                              defaultValue={member.occupation ?? ''} 
                              disabled={userId === member.id}
                              {...register('user.occupation')}
                            />
                            <Button
                              type="submit"
                              disabled={userId === member.id || isPending}
                              className="w-full cursor-pointer bg-cyan-400 hover:bg-cyan-500 text-zinc-900 font-bold mt-4"
                            >
                              Salvar
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                    | 
                    <AlertDialog onOpenChange={(open) => open && handleOpenDialog(member)}>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" className="cursor-pointer">
                          <Trash className="text-red-400" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Tem certeza que deseja remover o usuário {member.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRemoveMember(member.organization_id, member.id)} className="cursor-pointer bg-red-400 font-bold">Sim, remover {member.name}</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>}
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  )
}
