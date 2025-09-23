'use client'

import { getOrganization } from "@/api/organizations/get-organization"
import { me } from "@/api/users/me"
import { uploadAvatar } from "@/api/users/upload-avatar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { UserContext } from "@/context/user-context"
import { avatarImages } from "@/helpers/avatar-images"
import { fallbackImageFormatter } from "@/helpers/fallback-image-formatter"
import { translateRoleTooltip } from "@/helpers/translate-role"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useContext, useState } from "react"
import { UserForm } from "./user-form"
import { OrganizationForm } from "./organization-form"
import { formatCurrency } from "@/helpers/format-currency"
import { CircleQuestionMark, Eye, EyeClosed } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Goals } from "./goals"
import { Badge } from "@/components/ui/badge"
import { acceptInvite } from "@/api/users/accept-invite"
import { toast } from "sonner"
import { revokeInvite } from "@/api/users/revoke-invite"

export function ProfileForm() {
  const queryClient = useQueryClient()
  const { userId } = useContext(UserContext)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showSalary, setShowSalary] = useState(false)

  const { data } = useQuery({
    queryKey: ["me", userId],
    queryFn: me,
  })

  const { mutate: updateAvatar, isPending } = useMutation({
    mutationFn: (data: string) => uploadAvatar(data, userId),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['me', userId],
        type: 'active',
      })
    },
  })

  const { data: org } = useQuery({
    queryKey: ['organization', data?.organization_id || data?.invited_organization_id],
    queryFn: () => getOrganization(data?.organization_id! || data?.invited_organization_id!),
  })

  async function handleAvatarSelection(avatarUrl: string) {
    setSelectedAvatar(avatarUrl)
  }

  async function handleSaveAvatar() {
    if (selectedAvatar && userId) {
      updateAvatar(selectedAvatar)

      setIsModalOpen(false)
    }
  }

  const compareInviteStatus = {
    'pending_invitation': 'Convite Pendente',
    'accepted': 'Convite Aceito',
    'revoked': 'Convite Revogado',
  }

  return (
    <>
      {data && (
        <>
          <div className="w-[1200px] mt-10 h-[150px] rounded-lg bg-zinc-900 px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-center-gap-2">    
                <Avatar className="w-[100px] h-[100px]">
                  <AvatarImage src={data?.predefined_avatar_url ?? ''} />
                  <AvatarFallback className="font-bold bg-zinc-700">{fallbackImageFormatter(data?.name)}</AvatarFallback>
                </Avatar>

                <Dialog open={isModalOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant='link'
                      className='bg-transparent cursor-pointer p-0'
                      onClick={() => setIsModalOpen(true)}
                    >
                      Alterar foto de perfil
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Escolha a imagem ideal para o seu avatar</DialogTitle>
                    </DialogHeader>

                    <div className="mt-5 flex items-center justify-center">
                      <Avatar className="w-32 h-32">
                        <AvatarImage 
                          src={selectedAvatar || data?.predefined_avatar_url || ''} 
                        />
                        <AvatarFallback className="font-bold bg-zinc-700">{fallbackImageFormatter(data?.name)}</AvatarFallback>
                      </Avatar>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-3 gap-4">
                    {avatarImages.map((avatar) => (
                      <div key={avatar.id}>
                        <img
                          src={avatar.url}
                          alt={`Avatar ${avatar.id}`}
                          className="w-24 h-24 rounded-full cursor-pointer hover:ring-2 hover:ring-cyan-500"
                          onClick={() => handleAvatarSelection(avatar.url)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4 items-center justify-center mt-4">
                    <Button
                      onClick={handleSaveAvatar}
                      disabled={!selectedAvatar || isPending}
                      className="bg-cyan-500 font-bold hover:bg-cyan-600 cursor-pointer w-full"
                    >
                      {isPending ? 'Salvando...' : 'Salvar Avatar'}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      className="cursor-pointer bg-transparent text-cyan-400 hover:text-cyan-500 w-full"
                    >
                      Cancelar
                      </Button>
                  </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-col">
                <h3 className="text-lg font-bold">{data?.name}</h3>
                <span className="text-sm text-zinc-400">{data?.email}</span>
                {data?.invitation_status === 'pending_invitation' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-400">Você ainda não faz parte de uma organização</span>
                    <Dialog>
                      <DialogTrigger asChild> 
                        <Button className="text-cyan-500 p-0 cursor-pointer" variant='link'>clique aqui para ver os seus convites.</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Convites pendentes
                          </DialogTitle>
                        </DialogHeader>

                        {data?.invitation_status ? (
                          <div>
                            {data.invitation_status === 'pending_invitation' && (
                              <div className="flex flex-col gap-4">
                                <h3 className="font-bold text-zinc-400">Você possui um convite da empresa {org?.company_name}</h3>

                                <span className="text-sm font-bold flex items-center gap-2">Status do convite: 
                                  <Badge className="bg-amber-400 text-zinc-900 font-bold">{compareInviteStatus[data.invitation_status]}</Badge>
                                </span>

                                <Button 
                                  className="bg-cyan-500 hover:bg-cyan-600 font-bold cursor-pointer w-full mt-8"
                                  onClick={async () => {
                                    return await acceptInvite(data.id)
                                      .then((res) => toast.success(res.message))
                                      .catch(() => toast.error('Não foi possível aceitar o convite, tente novamente mais tarde'))
                                  }}
                                >
                                  Aceitar convite
                                </Button>
                                <Button 
                                  className="bg-transparent border border-zinc-800 text-red-400 hover:bg-transparent hover:text-red-500 cursor-pointer w-full"
                                  onClick={async () => {
                                    return await revokeInvite(data.id)
                                      .then((res) => toast.success(res.message))
                                      .catch(() => toast.error('Não foi possível recusar o convite, tente novamente mais tarde'))
                                  }}
                                >
                                  Recusar convite
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="mt-10 flex flex-col items-center justify-center">
                            <span className="text-lg font-bold text-zinc-400">Você não possui convites.</span>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <span className="text-sm text-zinc-400">{data.occupation} na empresa <span className="text-sm text-cyan-500 font-bold">{org?.company_name}</span></span>
                )}
              </div>
            </div>

            <div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-cyan-500 font-bold cursor-pointer hover:bg-cyan-600"
                  >
                    Editar perfil
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar dados do usuário</DialogTitle>
                  </DialogHeader>
                  <div className="max-h-[600px] overflow-y-auto pr-2">
                    <UserForm 
                      userId={data?.id}
                      email={data?.email}
                      name={data?.name}
                      phone={data?.phone_number || ''}
                    />

                    {data && data.role === 'ADMIN' && (
                      <OrganizationForm 
                        companyName={org?.company_name}
                        description={org?.description}
                        email={org?.email}
                        foundingDate={org?.founding_date}
                        orgId={org?.id}
                        phone={org?.phone}
                        websiteUrl={org?.website_url}
                      />
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 mt-10">
            <div className="col-span-4 flex flex-col gap-4 p-4 bg-zinc-900 rounded-lg">
              <h3 className="font-bold">Dados do endereço</h3>

              <Separator />

              <div className="flex items-center gap-2">
                <span className="text-sm">Rua:</span>
                <span className="text-sm font-bold text-zinc-400">{data.address.street}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Número:</span>
                <span className="text-sm font-bold text-zinc-400">{data.address.number}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Bairro:</span>
                <span className="text-sm font-bold text-zinc-400">{data.address.neighborhood}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Complemento:</span>
                <span className="text-sm font-bold text-zinc-400">{data.address.complement ?? '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Estado:</span>
                <span className="text-sm font-bold text-zinc-400">{data.address.state}</span>
              </div>

              <Button className="w-full bg-cyan-500 hover:bg-cyan-600 font-bold cursor-pointer">Alterar dados de endereço</Button>
            </div>

            <div className="col-span-4 flex flex-col gap-4 p-4 bg-zinc-900 rounded-lg">
              <h3 className="font-bold">Dados de contrato</h3>

              <Separator />

              <div className="flex items-center gap-2">
                <span className="text-sm">Cargo:</span>
                <span className="text-sm font-bold text-zinc-400">{data.occupation}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Telefone:</span>
                <span className="text-sm font-bold text-zinc-400">{data.phone_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Empresa:</span>
                <span className="text-sm font-bold text-zinc-400 truncate">{data.organization?.company_name ?? 'Você ainda não está associado a uma organização'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Permissão:</span>
                <span className="text-sm font-bold text-zinc-400 flex items-center gap-2">
                  {data.role.toLowerCase()}
                  <Tooltip>
                    <TooltipProvider>
                      <TooltipTrigger>
                        <CircleQuestionMark className="size-4 cursor-pointer text-cyan-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <span>{translateRoleTooltip[data.role]}</span>
                      </TooltipContent>
                    </TooltipProvider>
                  </Tooltip>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Salário:</span>
                <span className="text-sm font-bold text-zinc-400 flex items-center gap-2">
                  {showSalary ? formatCurrency(Number(data.salary)) : '••••••••'}
                  <Button variant="ghost" onClick={() => setShowSalary(prev => !prev)}>
                    {showSalary ? <Eye /> : <EyeClosed />}
                  </Button>
                </span>
              </div>
              <span className="text-xs text-zinc-400">* A informação do salário pode ser confidencial, cuidado ao exibí-la.</span>
            </div>

            <div className="relative col-span-4 flex flex-col gap-4 p-4 bg-zinc-900 rounded-lg">
              <h3 className="font-bold">Minhas metas</h3>
            
              <Separator />

              <Goals userName={data?.name} />
            </div>
          </div>
        </>
      )}
    </>
  )
}
