'use client'

import { getTransactions, TransactionsResponse } from "@/api/organizations/get-transactions"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserContext } from "@/context/user-context"
import { transactionsTypeStyle } from "@/helpers/translate-transactions"
import { usePermissions } from "@/hooks/usePermissions"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Edit, Trash } from "lucide-react"
import { useContext } from "react"
import { Controller, useForm } from "react-hook-form"
import { transactionSchema } from "./schemas"
import z from "zod"
import { formatCurrency } from "@/helpers/format-currency"
import { getDashboard } from "@/api/organizations/get-dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { updateTransaction, UpdateTransactionRequest } from "@/api/organizations/update-transaction"
import { deleteTransaction } from "@/api/organizations/delete-transaction"
import { toast } from "sonner"
import { CreateTransaction } from "./create-transaction"

type TransactionsFormData = z.infer<typeof transactionSchema>

export function TransactionsList() {
  const queryClient = useQueryClient()
  const { role, organizationId } = useContext(UserContext)
  const { isAdmin } = usePermissions(role)
  const { register, handleSubmit, reset, control } = useForm<TransactionsFormData>({
    resolver: zodResolver(transactionSchema),
  })

  const { data: transactions } = useQuery({
    queryKey: ['transactions', organizationId],
    queryFn: () => getTransactions(organizationId!),
  })

  const { data: dataDashboard, isLoading: loadingDashboard } = useQuery({
    queryKey: ['dashboard', organizationId],
    queryFn: () => getDashboard(organizationId!),
  })

  const { mutateAsync: updateTransactionFn } = useMutation({
    mutationFn: (data: UpdateTransactionRequest) => updateTransaction(data),
    onSuccess: () => {
      queryClient.refetchQueries({ 
        queryKey: ['transactions', organizationId],
        type: 'active',
      }),
      queryClient.refetchQueries({ 
        queryKey: ['dashboard', organizationId],
        type: 'active',
      })
    },
  })

  const { mutateAsync: deleteTransactionFn } = useMutation({
    mutationFn: ({ orgId, transactionId }: { orgId: number; transactionId: number }) => deleteTransaction(orgId, transactionId),
    onSuccess: () => {
      queryClient.refetchQueries({ 
        queryKey: ['transactions', organizationId],
        type: 'active',
      }),
      queryClient.refetchQueries({ 
        queryKey: ['dashboard', organizationId],
        type: 'active',
      })
    },
  })

  function handleOpenDialog(transaction: TransactionsResponse) {
    reset({
      description: transaction.description,
      amount: transaction.amount,
      transaction_type: transaction.transaction_type,
      date: transaction.date,
    })
  }

  async function handleUpdateTransaction(transactionId: number, data: TransactionsFormData) {
    await updateTransactionFn({
      transactionId,
      orgId: organizationId!,
      description: data.description,
      amount: data.amount,
      transaction_type: data.transaction_type,
      date: data.date,
    }).then(() => {
      toast.success('Transação atualizada com sucesso!')
    }).catch((e) => {
      toast.error('Erro ao atualizar a transação. Tente novamente.')
      console.error(e)
    })
  }

  async function handleDeleteTransaction(orgId: number, transactionId: number) {
    await deleteTransactionFn({ orgId, transactionId }).then(() => {
      toast.success('Transação removida com sucesso!')
    }).catch((e) => {
      toast.error('Erro ao remover a transação. Tente novamente.')
      console.error(e)
    })
  }

  return (
    <div className="flex flex-col gap-8 mt-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Transações</h1>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-4 w-[200px] bg-zinc-800 rounded-lg p-4">
            <h1 className="text-lg font-bold text-zinc-400">Entradas</h1>
            {loadingDashboard ? (
              <Skeleton className="w-10 h-4" />
            ) : (
              <span className="text-sm font-bold text-emerald-400">{formatCurrency(dataDashboard?.total_income)}</span>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 w-[200px] bg-zinc-800 rounded-lg p-4">
            <h1 className="text-lg font-bold text-zinc-400">Saídas</h1>
            {loadingDashboard ? (
              <Skeleton className="w-10 h-4" />
            ) : (
              <span className="text-sm font-bold text-red-400">{formatCurrency(dataDashboard?.total_expenses)}</span>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 w-[200px] bg-zinc-800 rounded-lg p-4">
            <h1 className="text-lg font-bold text-zinc-400">Total</h1>
            {loadingDashboard ? (
              <Skeleton className="w-10 h-4" />
            ) : (
              <span className="text-sm font-bold text-indigo-400">{formatCurrency(dataDashboard?.total_balance)}</span>
            )}
          </div>
        </div>
      </div>

      {isAdmin && (
        <div>
          <CreateTransaction />
        </div>
      )}

      <Separator className="my-10" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Descrição</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Data da transação</TableHead>
            <TableHead>Tipo da transação</TableHead>
            <TableHead>Relação com a meta</TableHead>
            {isAdmin && <TableHead>Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions && transactions.map(transaction => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>{formatCurrency(Number(transaction.amount))}</TableCell>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>
                <Badge className={transactionsTypeStyle[transaction.transaction_type]}>
                  {transaction.transaction_type}
                </Badge>
              </TableCell>
              <TableCell>
                {transaction.goal_id ? `Relacionado à meta ${transaction.goal_id}` : 'Não relacionado à nenhuma meta'}
              </TableCell>
              {isAdmin && <TableCell className="flex items-center">
                <Dialog onOpenChange={(open) => open && handleOpenDialog(transaction)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="cursor-pointer"
                    >
                      <Edit className="text-cyan-400" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar dados da transação</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit((data) => handleUpdateTransaction(transaction.id, data))}>
                      <div className="mt-4 flex flex-col gap-4">
                        <Label>Descrição</Label>
                        <Input defaultValue={transaction.description} {...register('description')} />

                        <Label>Valor</Label>
                        <Input defaultValue={`R$ ${transaction.amount}`} {...register('amount')} />

                        <Label>Data da transação</Label>
                        <Input type="date" defaultValue={transaction.date} {...register('date')} />

                        <Label>Tipo da transação</Label>
                        <Controller
                          name="transaction_type"
                          control={control}
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={transaction.transaction_type} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Selecione o tipo da transação</SelectLabel>
                                  <SelectItem value="income">Income</SelectItem>
                                  <SelectItem value="expense">expense</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <Button
                          type="submit"
                          className="w-full cursor-pointer bg-cyan-400 hover:bg-cyan-500 text-zinc-900 font-bold mt-4"
                        >
                          Salvar
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
                |
                <AlertDialog onOpenChange={(open) => open && handleOpenDialog(transaction)}>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" className="cursor-pointer">
                      <Trash className="text-red-400" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza que deseja remover a transação {transaction.description}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteTransaction(transaction.organization_id, transaction.id)} className="cursor-pointer bg-red-400 font-bold">
                        Sim, remover {transaction.description}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}