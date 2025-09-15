'use client'

import Image from "next/image"
import lsdrLogo from '../../public/lsdr-logo.png'
import { useQuery } from "@tanstack/react-query"
import { me } from "@/api/users/me"
import { Building, Building2, Home, LogIn, LogOut, User } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { usePathname } from "next/navigation"

interface HeaderProps {
  isAuthenticated: boolean
  height: string
}

interface MeResponse {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
  organization_id: number | null
  invitation_status: string
  role: 'EMPLOYEE' | 'ADMIN' | 'MANAGER'
}

export function Header({ isAuthenticated, height }: HeaderProps) {
  const pathname = usePathname()

  const { data, isLoading } = useQuery<MeResponse>({
    queryKey: ['me'],
    queryFn: me,
  })

  return (
    <header className='relative w-full h-[450px]'>
      <div className="absolute inset-0 bg-[url('/business-bg-4.jpg')] bg-cover bg-center opacity-30 rounded-b-4xl" />

      <div className="relative z-10 px-8 h-full">
        <div className="flex items-center justify-between">
            <div>
              <Image 
                src={lsdrLogo}
                alt="LSDR Logo"
                width={150}
                height={50}
              />
            </div>

            <div>
              <ul className="flex items-center gap-4">
                <li>
                  <a href="/" className="text-zinc-400 font-bold hover:text-cyan-500 flex items-center gap-2">
                    Inicio
                    <Home />
                  </a>
                </li>
                {!isAuthenticated && (
                  <li>
                    <a href="/auth/sign-in"className="text-zinc-400 font-bold hover:text-cyan-500 flex items-center gap-2">
                      Entrar
                      <LogIn />
                    </a>
                  </li>
                )}
                {isAuthenticated && data && (
                  <>
                    {!data.organization_id ? (
                      <li>
                        <a href="/organizations/create-organization" className="text-zinc-400 font-bold hover:text-cyan-500 flex items-center gap-2">
                          Cadastrar minha organização
                          <Building2 />
                        </a>
                      </li>
                    ) : (
                      <li>
                        <a href={`/organizations/${data.organization_id}`} className="text-zinc-400 font-bold hover:text-cyan-500 flex items-center gap-2">
                          Acessar organização
                          <Building />
                        </a>
                      </li>
                    )}
                    <li>
                      {isLoading ? (
                        <Skeleton className="h-4 w-[100px]" />
                      ) : (
                        <a href="/profile" className="text-zinc-400 font-bold hover:text-cyan-500 flex items-center gap-2">
                          {data.name}
                          <User />
                        </a>
                      )}
                    </li>
                    <li>
                      <a href="/api/sign-out" className="text-zinc-400 font-bold hover:text-cyan-500 flex items-center gap-2">
                        Sair
                        <LogOut />
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {pathname === '/' && (
            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="text-zinc-50 font-bold text-4xl">Gerencie suas finanças e metas de forma inteligente.</h1>
              <span className="text-zinc-400">Transforme dados em decisões. Nossa plataforma ajuda sua organização a ter uma visão clara do progresso e do desempenho financeiro.</span>
            </div>
          )}
        </div>

    </header>
  )
}
