'use client'

import { getOrganization } from "@/api/organizations/get-organization"
import { UserContext } from "@/context/user-context"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { TransactionsCard } from "./transactions-card"


export function OrganizationDetails() {
  const { organizationId } = useContext(UserContext)
  const { data } = useQuery({
    queryKey: ['organization', organizationId],
    queryFn: () => getOrganization(organizationId!),
  })
  
  return (
    <div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-extrabold">{data?.company_name}</h1>
        <span className="text-zinc-400">{data?.description}</span>
      </div>

      <TransactionsCard />
    </div>
  )
}