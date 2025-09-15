'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { signInAction } from "./actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

import lsdrLogo from '../../../../public/lsdr-logo.png'
import Image from "next/image";
import { useFormState } from "@/hooks/useFormState";

export function SignInForm() {
  const router = useRouter()

  const [{ errors, success, message }, handleSubmit, isPending] = useFormState(
    signInAction,
    () => {
      router.push('/')
    },
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center mt-52 w-[400px] gap-8">
      <h1 className="text-2xl font-extrabold text-zinc-300">Fazer login</h1>

      {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Erro ao fazer o login!</AlertTitle>
            <AlertDescription>
              <p>
                Os dados de login estão incorretos, por favor, tente novamente.
              </p>
            </AlertDescription>
          </Alert>
        )}

      <div className="w-full flex flex-col gap-4">
        <Label className="text-zinc-300 font-bold">E-mail</Label>
        <Input placeholder="Digete o seu e-mail" type="email" name="email" />

        {errors?.email && (
          <p className="text-xs font-medium text-red-400">
            {errors.email[0]}
          </p>
        )}
      </div>

      <div className="w-full flex flex-col gap-4">
        <Label className="text-zinc-300 font-bold">Senha</Label>
        <Input placeholder="Digite a sua senha" type="password" name="password" />

        {errors?.password && (
          <p className="text-xs font-medium text-red-400">
            {errors.password[0]}
          </p>
        )}
      </div>

      <div className="w-full flex items-center justify-between">
        <Button variant="link" className="text-sm p-0 text-zinc-400 hover:text-cyan-500">Esqueci minha senha</Button>

        <a href="/auth/sign-up" className="text-sm text-zinc-400 hover:text-cyan-500 hover:underline">Registrar conta</a>
      </div>

      <Button 
        className="w-full bg-cyan-500 font-bold cursor-pointer hover:bg-cyan-600"
        type="submit"
        disabled={isPending}
      >
        Acessar conta
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