import { api } from "../client"

interface SignUpRequest {
  user: {
    email: string
    password: string
    password_confirmation: string
    name: string
    role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
    address_attributes: {
      street: string
      city: string
      state: string
      zip_code: string
      neighborhood: string
      complement?: string
      number: string
    }
  }
}

export async function signUp(userData: SignUpRequest) {
  const result = await api.post('/users', {
    user: userData
  })

  return result.data
}