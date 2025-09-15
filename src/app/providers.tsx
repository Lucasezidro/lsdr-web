'use client'

import { UserProvider } from "@/context/user-context"
import { queryClient } from "@/lib/react-query"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Toaster richColors />
        {children}
      </UserProvider>
    </QueryClientProvider>
  )
}