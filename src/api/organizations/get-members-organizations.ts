import { api } from "../client";

export interface MembersOrganizationResponse {
  id: number
  name: string
  email: string
  role: "ADMIN" | "MANAGER" | "EMPLOYEE"
  avatar_url: string
  predefined_avatar_url: string | null
  invitation_status: string | null
  organization_id: number
  occupation: string | null
  created_at: string 
  updated_at: string 
}

export async function getMembersOrganizations(orgId: number): Promise<MembersOrganizationResponse[]> {
  const result = await api.get(`organizations/${orgId}/members`)

  return result.data
}