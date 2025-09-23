'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { userSchema } from "./schemas"
import z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUser } from "@/api/users/update-user"
import { toast } from "sonner"

type UserFormData = z.infer<typeof userSchema>

type UserFormProps = {
  userId: number
  email: string
  name: string
  phone: string
}

export function UserForm({ userId, email, name, phone }: UserFormProps) {
  const queryClient = useQueryClient()
  const { register, handleSubmit } = useForm<UserFormData>({
    resolver: zodResolver(userSchema)
  })

  const { mutateAsync: updateUserFN, isPending: loadingUser } = useMutation({
    mutationFn: (data: { userId: number, email: string, name: string, phone_number: string }) => updateUser(data),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['me', userId],
        type: 'active',
      })
    },
  })

  async function handleUpdateUser(formData: UserFormData) {
    await updateUserFN({
      email: formData.user.email,
      name: formData.user.name,
      phone_number: formData.user.phone_number,
      userId,
    }).then(() => {
      toast.success('Usuário atualizado com sucesso!')
    }).catch(e => {
      toast.error('Houve um erro ao tentar atualizar o usuário, por favor tente novamente mais tarde.')
      console.error(e)
    })
  }

  return (
    <form 
      id="update-user" 
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(handleUpdateUser)}
    >
      <h3 className="text-lg font-bold my-6">Dados do usuário</h3>

      <div className="flex flex-col gap-2">
        <Label className="text-zinc-400 font-bold">Email</Label>
        <Input type="email" defaultValue={email} {...register('user.email')} />
      </div>
      
      <div className="flex flex-col gap-2">
        <Label className="text-zinc-400 font-bold">Nome</Label>
        <Input defaultValue={name} {...register('user.name')} />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-zinc-400 font-bold">Telefone</Label>
        <Input defaultValue={phone} {...register('user.phone_number')} />
      </div>

      <Button
        className="bg-cyan-500 font-bold hover:bg-cyan-600 cursor-pointer w-full"
        type="submit"
        form="update-user"
        disabled={loadingUser}
      >
        Salvar Usuário
      </Button>
    </form>
  )
}