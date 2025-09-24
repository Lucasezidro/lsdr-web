'use client'

import { me } from "@/api/users/me";
import { useQuery } from "@tanstack/react-query";
import { createContext } from "react";

export type UserContextType = {
  userId: number | null
  organizationId: number | null
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
}

export const UserContext = createContext({} as UserContextType)

type UserProviderProps = {
  children: React.ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: me,
  })

  const userId = data?.id ?? null
  const organizationId = data?.organization_id ?? null
  const role = data?.role ?? null

  return (
    <UserContext.Provider value={{ userId, organizationId, role }}>
      {children}
    </UserContext.Provider>
  )
}