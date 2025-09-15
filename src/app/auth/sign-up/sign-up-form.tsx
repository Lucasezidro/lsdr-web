'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import lsdrLogo from '../../../../public/lsdr-logo.png'
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import z from "zod";
import { signUpSchema } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/api/users/sign-up";
import { useMutation } from "@tanstack/react-query";

type SignUpFormData = z.infer<typeof signUpSchema>

export function SignUpForm() {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  })

  const { mutateAsync: createUser, isPending } = useMutation({
    mutationFn: (data: SignUpFormData) => signUp(data),
    onSuccess: () => {
      router.push("/auth/sign-in")
    },
    onError: (error) => {
      console.error(error)
    }
  })

  async function handleCreateUser(data: SignUpFormData) {
    console.log(data)
    await createUser(data.user)
  }

  return (
    <form 
      onSubmit={handleSubmit(handleCreateUser)} 
      className="flex flex-col items-center justify-center mt-5 w-[800px] gap-8"
    >
      <h1 className="text-2xl font-extrabold text-zinc-300">Criar conta</h1>

      <h2 className="text-lg font-bold text-zinc-400">Dados Pessoais</h2>
      <Separator />

      <div className="grid grid-cols-4 gap-4 w-full">
        <div className="w-full flex flex-col gap-4">
          <Label className="text-zinc-300 font-bold">E-mail</Label>
          <Input placeholder="Digite o seu e-mail" type="email" {...register('user.email')} />

          {errors?.user?.email && (
            <p className="text-xs font-medium text-red-400">
              {errors.user.email.message}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-4">
          <Label className="text-zinc-300 font-bold">Nome Completo</Label>
          <Input placeholder="Digite o seu Nome Completo" {...register('user.name')} />

          {errors?.user?.name && (
            <p className="text-xs font-medium text-red-400">
              {errors.user.name.message}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-4">
          <Label className="text-zinc-300 font-bold">Escolha a senha</Label>
          <Input placeholder="Escolha sua senha" type="password" {...register('user.password')} />

          {errors?.user?.password && (
            <p className="text-xs font-medium text-red-400">
              {errors.user.password.message}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-4">
          <Label className="text-zinc-300 font-bold">Confirme a senha</Label>
          <Input placeholder="Escolha sua senha" type="password" {...register('user.password_confirmation')} />

          {errors?.user?.password_confirmation && (
            <p className="text-xs font-medium text-red-400">
              {errors.user.password_confirmation.message}
            </p>
          )}
        </div>
      </div>  
      
      <h2 className="text-lg font-bold text-zinc-400">Endereço</h2>
      <Separator />

      <div className="grid grid-cols-3 gap-4 w-full">
        <div className="w-full flex flex-col gap-4">
          <Label className="text-zinc-300 font-bold">Logradouro</Label>
          <Input placeholder="Digite o seu logradouro" {...register('user.address_attributes.street')} />

          {errors?.user?.address_attributes?.street && (
            <p className="text-xs font-medium text-red-400">
              {errors.user.address_attributes.street.message}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-4">
          <Label className="text-zinc-300 font-bold">Número</Label>
          <Input placeholder="Digite o Número da residência" {...register('user.address_attributes.number')} />

          {errors?.user?.address_attributes?.number && (
            <p className="text-xs font-medium text-red-400">
              {errors.user.address_attributes.number.message}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-4">
          <Label className="text-zinc-300 font-bold">Complemento</Label>
          <Input placeholder="Opcional" {...register('user.address_attributes.complement')} />

          {errors?.user?.address_attributes?.complement && (
            <p className="text-xs font-medium text-red-400">
              {errors.user.address_attributes.complement.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 w-full">
        <div className="w-full flex flex-col gap-4">
          <Label className="text-zinc-300 font-bold">Bairro</Label>
          <Input placeholder="Digite o seu bairro" {...register('user.address_attributes.neighborhood')} />

          {errors?.user?.address_attributes?.neighborhood && (
            <p className="text-xs font-medium text-red-400">
              {errors.user.address_attributes.neighborhood.message}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-4">
          <Label className="text-zinc-300 font-bold">Cidade</Label>
          <Input placeholder="Digite o Número da residência" {...register('user.address_attributes.city')} />

          {errors?.user?.address_attributes?.city && (
            <p className="text-xs font-medium text-red-400">
              {errors.user.address_attributes.city.message}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-4">
          <Label className="text-zinc-300 font-bold">Estado</Label>
          <Input placeholder="Digite o Estado" {...register('user.address_attributes.state')} />

          {errors?.user?.address_attributes?.state && (
            <p className="text-xs font-medium text-red-400">
              {errors.user.address_attributes.state.message}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-4">
          <Label className="text-zinc-300 font-bold">CEP</Label>
          <Input placeholder="Digite o CEP" {...register('user.address_attributes.zip_code')} />

          {errors?.user?.address_attributes?.zip_code && (
            <p className="text-xs font-medium text-red-400">
              {errors.user.address_attributes.zip_code.message}
            </p>
          )}
        </div>
      </div>

      <div className="w-full flex items-center justify-between">
        <a href="/auth/sign-in" className="text-sm text-zinc-400 hover:text-cyan-500 hover:underline">Fazer login</a>
      </div>

      <Button 
        className="w-full bg-cyan-500 font-bold cursor-pointer hover:bg-cyan-600"
        type="submit"
        disabled={isPending}
      >
        Criar conta
      </Button>

      <div className="absolute bottom-3">
        <Image 
          src={lsdrLogo} 
          alt="Logo do LSDR" 
          width={100} 
          height={100} 
          className="opacity-30"
        />
      </div>
    </form>
  )
} 