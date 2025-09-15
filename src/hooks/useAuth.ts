import { cookies } from "next/headers"

export const useAuth = () => {
  const isAuthenticated = !!cookies().get('token')?.value

  const token = cookies().get('token')?.value

  return {
    isAuthenticated,
    token,
  }
}