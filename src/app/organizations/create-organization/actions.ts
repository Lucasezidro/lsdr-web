'use server'

import { createOrganization } from '@/api/organizations/create-organization'
import { AxiosError } from 'axios'
import { z } from 'zod'

const createOrganizationSchema = z.object({
  company_name: z.string(),
  document_number: z.string(),
  founding_date: z.string(),
  email: z.email({ message: 'Por favor, digite um e-mail válido.' }),
  phone: z.string(),
  website_url: z.string(),
  description: z.string(),

})

export async function createOrganizationAction(data: FormData) {
  const result = createOrganizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { 
    company_name,
    document_number,
    founding_date,
    email,
    phone,
    website_url,
    description,
   } = result.data

  try {
    await createOrganization({
      company_name,
      document_number,
      founding_date,
      email,
      phone,
      website_url,
      description,
    })
  } catch (err) {
    if (err instanceof AxiosError) {
      const { message } = err

      return { success: false, message, errors: null }
    }

    console.error(err)

    return {
      success: false,
      message: 'Um erro inesperado ocorreu, tente novamente em alguns minutos.',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}