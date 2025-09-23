'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import z from "zod"
import { organizationSchema } from "./schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { updateOrganization } from "@/api/organizations/update-organization"
import { toast } from "sonner"

type OrganizationFormData = z.infer<typeof organizationSchema>

type OrganizationFormProps = {
  orgId: number
  companyName: string
  email: string
  phone: string
  websiteUrl: string
  foundingDate: string
  description: string
}

export function OrganizationForm({ 
  orgId,
  companyName,
  email,
  foundingDate,
  phone,
  websiteUrl,
  description
}: OrganizationFormProps) {
  const queryClient = useQueryClient()
  const { register, handleSubmit } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema)
  })

  const { mutateAsync: updateOrg, isPending: loadingOrg } = useMutation({
    mutationFn: (data: { orgId: number, company_name: string, phone: string, email: string, description: string, website_url: string, founding_date: string }) => updateOrganization(data),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['organization', orgId],
        type: 'active',
      })
    },
  })

  async function handleUpdateOrganization(formData: OrganizationFormData) {
    await updateOrg({
      orgId,
      company_name: formData.company_name,
      description: formData.description,
      email: formData.email,
      founding_date: formData.founding_date,
      phone: formData.phone,
      website_url: formData.website_url
    }).then(() => {
      toast.success('Organização atualizada com sucesso!')
    }).catch(e => {
      toast.error('Houve um erro ao tentar atualizar a organização, por favor tente novamente mais tarde.')
      console.error(e)
    })
  }

  return (
    <form 
      className="flex flex-col gap-4" 
      id="update-org"
      onSubmit={handleSubmit(handleUpdateOrganization)}
    >
    <Separator className="space-y-4" />

    <h3 className="text-lg font-bold mb-4">Dados da organização</h3>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-2">
          <Label className="text-zinc-400 font-bold">Nome da organização</Label>
          <Input defaultValue={companyName} {...register('company_name')} />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-zinc-400 font-bold">Data de criação</Label>
          <Input 
            type="date" 
            defaultValue={foundingDate} 
            max={new Date().getDay()} 
            {...register('founding_date')}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-2">
          <Label className="text-zinc-400 font-bold">E-mail</Label>
          <Input 
            type="email" 
            defaultValue={email} 
            className="w-full"
            {...register('email')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-zinc-400 font-bold">Telefone</Label>
          <Input defaultValue={phone} className="w-full" {...register('phone')} />
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <Label className="text-zinc-400 font-bold">Website URL</Label>
        <Input defaultValue={websiteUrl} {...register('website_url')} />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-zinc-400 font-bold">Descrição</Label>
        <Textarea defaultValue={description} {...register('description')} />
      </div>

      <Button
        className="bg-cyan-500 font-bold hover:bg-cyan-600 cursor-pointer w-full"
        type="submit"
        form="update-org"
      >
        Salvar Organização
      </Button>
    </form>
  )
}