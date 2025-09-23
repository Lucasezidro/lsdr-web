'use client'

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { createTransactionSchema } from "./schemas";
import z from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction, CreateTransactionRequest } from "@/api/organizations/create-transaction";
import { useContext } from "react";
import { UserContext } from "@/context/user-context";
import { toast } from "sonner";

type CreateTransactionFormData = z.infer<typeof createTransactionSchema>

export function CreateTransaction() {
  const queryClient = useQueryClient()
  const { organizationId } = useContext(UserContext)
  const { register, control, handleSubmit, reset } = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema)
  })

  const { mutateAsync } = useMutation({
    mutationFn: (data: CreateTransactionRequest) => createTransaction(data),
    onSuccess: () => {
      queryClient.refetchQueries({ 
        queryKey: ['transactions', organizationId],
        type: 'active',
      }),
      queryClient.refetchQueries({ 
        queryKey: ['dashboard', organizationId],
        type: 'active',
      })
    }
  })

  async function handleCreateTransaction(data: CreateTransactionFormData) {
    await mutateAsync({
      orgId: organizationId!,
      transaction: {
        description: data.transaction.description,
        amount: data.transaction.amount,
        date: data.transaction.date,
        transaction_type: data.transaction.transaction_type,
      }
    }).then(() => {
      toast.success('Transação criada com sucesso!')
      reset()
    }).catch((e) => {
      toast.error('Erro ao criar transação. Tente novamente.')
      console.error(e)
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="cursor-pointer"
          variant="outline"
        >
          Cadastrar transação
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar transação</DialogTitle>
        </DialogHeader>

        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit(handleCreateTransaction)}>
          <Label className="text-zinc-400 font-bold">Descrição</Label>
          <Input {...register('transaction.description')} />

          <Label className="text-zinc-400 font-bold">Valor</Label>
          <Input {...register('transaction.amount')} />

          <Label className="text-zinc-400 font-bold">Data da transação</Label>
           <Input type="date" {...register('transaction.date')} max={new Date().toISOString().split("T")[0]}  />

          <Label className="text-zinc-400 font-bold">Tipo de transação</Label>
          <Controller 
            name='transaction.transaction_type'
            control={control}
            render={({ field }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="income" id="income" />
                  <Label htmlFor="income">Entrada</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="expense" id="expense" />
                  <Label htmlFor="expense">Saída</Label>
                </div>
              </RadioGroup>
            )}
          />

          <Button 
            type="submit"
            className="mt-2 bg-cyan-500 hover:bg-cyan-600 font-bold cursor-pointer"
          >
            Cadastrar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}