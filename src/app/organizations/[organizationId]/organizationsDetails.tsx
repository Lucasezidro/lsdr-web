'use client'

import { getOrganization } from "@/api/organizations/get-organization"
import { UserContext } from "@/context/user-context"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { TransactionsCard } from "./transactions-card"
import { usePermissions } from "@/hooks/usePermissions"
import { MembersList } from "./members-list"

export function OrganizationDetails() {
  const { organizationId, role } = useContext(UserContext)
  const { canManagement } = usePermissions(role)

  const { data } = useQuery({
    queryKey: ['organization', organizationId],
    queryFn: () => getOrganization(organizationId!),
  })
  
  return (
    <div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-4xl font-extrabold">{data?.company_name}</h1>
        <span className="text-zinc-400 text-center text-sm">{data?.description}</span>
      </div>

      {canManagement && <TransactionsCard />}

      {role === 'EMPLOYEE' && <MembersList />}
    </div>
  )
}