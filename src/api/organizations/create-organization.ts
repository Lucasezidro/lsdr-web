import { cookies } from "next/headers"
import { api } from "../client"
import { useAuth } from "@/hooks/useAuth"

interface CreateOrganizationRequest {
  company_name: string
  document_number: string
  email: string
  phone: string
  website_url: string
  description: string
  founding_date: string
}

export async function createOrganization({
  company_name,
  document_number,
  founding_date,
  email,
  phone,
  website_url,
  description,
}: CreateOrganizationRequest) {
  const { token } = useAuth()

  const result = await api.post('/organizations', {
    company_name,
    document_number,
    founding_date,
    email,
    phone,
    website_url,
    description,
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })

  return result.data
}