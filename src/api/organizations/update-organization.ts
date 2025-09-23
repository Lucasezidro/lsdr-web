import { api } from "../client";

interface UpdateOrganizationRequest {
  orgId: number
  company_name: string
  phone: string
  email: string
  description: string
  website_url: string
  founding_date: string
}

export async function updateOrganization({ 
  orgId,
  company_name,
  phone,
  email,
  description,
  website_url,
  founding_date,
 }: UpdateOrganizationRequest) {
  const result = await api.put(`/organizations/${orgId}`, {
    company_name,
    phone,
    email,
    description,
    website_url,
    founding_date,
  })


  return result.data
}