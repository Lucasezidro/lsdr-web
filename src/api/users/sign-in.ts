import { api } from "../client"

interface SignInRequest {
  email: string
  password: string
}

export async function signIn({ email, password }: SignInRequest) {
  const result = await api.post('/auth/login', {
    email,
    password,
  })

  return result.data
}