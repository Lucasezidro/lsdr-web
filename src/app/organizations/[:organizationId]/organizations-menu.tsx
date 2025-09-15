'use client'

import { getDashboard } from "@/api/organizations/get-dashboard"
import { Button } from "@/components/ui/button"
import { UserContext } from "@/context/user-context"
import { formatCurrency } from "@/helpers/format-currency"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"

export function OrganizationsMenu () {
  const { organizationId } = useContext(UserContext)

  const { data } = useQuery({
    queryKey: ['dashboard', organizationId],
    queryFn: () => getDashboard(organizationId!),
  })

  return (
    <>
      <div className="absolute top-3 left-5">
        {data?.is_balance_positive ? (
          <span className="text-teal-500 font-bold">Seu saldo é positivo! {formatCurrency(data?.total_balance)}</span>
        ) : (
          <span className="text-red-400">Seu saldo está negativo! {formatCurrency(data?.total_balance)}</span>
        )}
      </div>
      <div className="absolute top-3 right-5">
        <ul className="flex items-center gap-4">
          <li>
            <Button 
              className="p-0 cursor-pointer hover:text-cyan-500" 
              variant='link'
            >
              Cadastrar nova transação
            </Button>
          </li>
          <li>
            <Button 
              className="p-0 cursor-pointer hover:text-cyan-500" 
              variant='link'
            >
              Ver todas transações
            </Button>
          </li>
          <li>
            <Button 
              className="p-0 cursor-pointer hover:text-cyan-500" 
              variant='link'
            >
              Minhas metas
            </Button>
          </li>
        </ul>
      </div>
    </>
  )
}