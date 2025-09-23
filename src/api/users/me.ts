import { api } from "../client"

export interface MeResponse {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
  organization_id: number | null
  invited_organization_id: number | null
  invitation_status: 'pending_invitation' | 'accepted' | 'revoked'
  predefined_avatar_url: string | null
  occupation: string | null
  salary: string | null
  phone_number: string | null
  manager_id: number | null
  avatar_url: string
  address: Address
  organization: Organization
}

export interface Address {
  id: number
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  zip_code: string
}

export interface Organization {
  id: number
  company_name: string
}

export async function me(): Promise<MeResponse> {

  const result = await api.get('/me')

  return result.data
}