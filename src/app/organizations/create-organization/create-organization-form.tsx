'use client'

import { useFormState } from "@/hooks/useFormState"
import { redirect, useRouter } from "next/navigation"
import { createOrganizationAction } from "./actions"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useContext, useEffect } from "react"
import { UserContext } from "@/context/user-context"

export function CreateOrganizationForm() {
  const router = useRouter()
  const { organizationId } = useContext(UserContext)

  const [{ errors, success, message }, handleSubmit, isPending] = useFormState(
    createOrganizationAction,
    () => {
      () => router.push(`/organizations/${organizationId}`)
    },
  )

  useEffect(() => {
    if (organizationId) {
      router.push(`/organizations/${organizationId}`)
    }
  }, [])

  useEffect(() => {
    if (!organizationId) return

    if (success === false) {
      toast.error(message || 'Erro ao criar a organização, tente novamente.')
    }
  }, [success, message])

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-[580px]">
      <h1 className="text-4xl font-extrabold my-10">Cadastrar organização</h1>

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-2 w-full">
          <Label className="text-zinc-400 font-bold">Nome da empresa</Label>
          <Input placeholder="Nome da empresa" name="company_name" />

          {errors?.company_name && (
            <p className="text-xs font-medium text-red-400">
              {errors.company_name[0]}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Label className="text-zinc-400 font-bold">Documento (CNPJ)</Label>
          <Input placeholder="CNPJ" name="document_number" />
        </div>

        {errors?.document_number && (
          <p className="text-xs font-medium text-red-400">
            {errors.document_number[0]}
          </p>
        )}
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-2">
          <Label className="text-zinc-400 font-bold">Data em que a empresa foi fundada</Label>
          <Input placeholder="Data de criação" name="founding_date" />

          {errors?.founding_date && (
            <p className="text-xs font-medium text-red-400">
              {errors.founding_date[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Label className="text-zinc-400 font-bold">Website</Label>
          <Input placeholder="Website" name="website_url" />

          {errors?.website_url && (
            <p className="text-xs font-medium text-red-400">
              {errors.website_url[0]}
            </p>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4 w-full">
        <div className="flex flex-col gap-2 w-full">
          <Label className="text-zinc-400 font-bold">E-mail</Label>
          <Input placeholder="E-mail" name="email" type="email" />

          {errors?.email && (
            <p className="text-xs font-medium text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Label className="text-zinc-400 font-bold">Telefone</Label>
          <Input placeholder="Telefone" name="phone" />

          {errors?.phone && (
            <p className="text-xs font-medium text-red-400">
              {errors.phone[0]}
            </p>
          )}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2 w-full">
        <Label className="text-zinc-400 font-bold">Descrição</Label>
        <Textarea placeholder="Descrição" name="description" />

        {errors?.description && (
          <p className="text-xs font-medium text-red-400">
            {errors.description[0]}
          </p>
        )}
      </div>

      <Button 
        className="w-full bg-cyan-500 cursor-pointer font-bold hover:bg-cyan-600" 
        type="submit"
        disabled={isPending}
      >
        Criar Organização
      </Button>
    </form>
  )
}