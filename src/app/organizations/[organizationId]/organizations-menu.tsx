'use client'

import { getDashboard } from "@/api/organizations/get-dashboard"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { UserContext } from "@/context/user-context"
import { formatCurrency } from "@/helpers/format-currency"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { organizationsMenuItem } from "./organizations-menu-item"
import { usePermissions } from "@/hooks/usePermissions"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function OrganizationsMenu () {
  const { organizationId, role } = useContext(UserContext)
  const router = useRouter()
  
  const { isAdmin } = usePermissions(role)

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', organizationId],
    queryFn: () => getDashboard(organizationId!),
  })

  return (
    <>
      {isAdmin && (
        <div className="absolute top-3 left-5">
          {isLoading ? (
            <Skeleton className="w-[310px] h-4" />
          ) : (
            <>
              {data?.is_balance_positive ? (
                <span className="text-teal-500 font-bold">Seu saldo é positivo! {formatCurrency(data?.total_balance)}</span>
              ) : (
                <span className="text-red-400">Seu saldo está negativo! {formatCurrency(data?.total_balance)}</span>
              )}
            </>
          )}
        </div>
      )}
      <div className="absolute top-3 right-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="link"
              size="sm"
              className="text-sm font-bold text-zinc-400 hover:text-cyan-500 hover:unerline cursor-pointer"
            >
              Ações
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Menu de ações</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {organizationsMenuItem(role, organizationId!).map((item) => (
              <div key={item.href}>
                {item.authorized && (
                  <DropdownMenuItem 
                    onClick={() => router.push(item.href)}
                    className="cursor-pointer"
                    >
                      {item.title}
                    </DropdownMenuItem> 
                )}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}