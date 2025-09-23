'use client'

import { getTransactions } from "@/api/organizations/get-transactions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserContext } from "@/context/user-context"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { FinanceCharts } from "./finance-charts"
import { getDashboard } from "@/api/organizations/get-dashboard"
import { BanknoteArrowDown, BanknoteArrowUp, CircleDollarSignIcon } from "lucide-react"
import { formatCurrency } from "@/helpers/format-currency"
import { Skeleton } from "@/components/ui/skeleton"

export interface Transaction {
  transactions: {
    id: number
    amount: number
    description: string
    transaction_type: 'income' | 'expense'
    date: string
  }
}

export function TransactionsCard() {
  const { organizationId } = useContext(UserContext)
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions', organizationId],
    queryFn: () => getTransactions(organizationId!),
  })

  const { data: dataDashboard, isLoading: loadingDashboard } = useQuery({
    queryKey: ['dashboard', organizationId],
    queryFn: () => getDashboard(organizationId!),
  })

  return (
    <div className="grid grid-cols-4 gap-4 mt-10">
      <Card>
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="flex items-center gap-2">
            Receita total
            <BanknoteArrowUp className="text-teal-400" />
          </CardTitle>
          {isLoading || loadingDashboard ? (
            <Skeleton className="w-24 h-4" />
          ) : (
            <CardDescription>{formatCurrency(dataDashboard?.total_income)}</CardDescription>  
          )}
        </CardHeader>

        <CardContent>
          <span className="text-zinc-400">
            A soma de todos os valores que entraram na sua organização. Acompanhe o crescimento do seu negócio.
          </span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="flex items-center gap-2">
            Despesa total
            <BanknoteArrowDown className="text-indigo-400" />
          </CardTitle>
          {isLoading || loadingDashboard ? (
            <Skeleton className="w-24 h-4" />
          ) : (
            <CardDescription>{formatCurrency(dataDashboard?.total_expenses)}</CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <span className="text-zinc-400">
            O total de todos os gastos da sua organização. Gerencie seus custos e otimize seus recursos.
          </span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="flex items-center gap-2">
            Saldo total
            <CircleDollarSignIcon className="text-cyan-400" />
          </CardTitle>
          {isLoading || loadingDashboard ? (
            <Skeleton className="w-24 h-4" />
          ) : (
            <CardDescription>{formatCurrency(dataDashboard?.total_balance)}</CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <span className="text-zinc-400">
            O resultado das suas finanças. Uma visão clara e imediata do lucro ou prejuízo do seu negócio.
          </span>
        </CardContent>
      </Card>
      {!isLoading && (
        <FinanceCharts transactions={transactions || []} />
      )}
    </div>
  )
}