import { api } from "../client";

interface AdminUpdateUserRequest {
  userId: number
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
  occupation?: string
}

export async function adminUpdateUser({ userId, role, occupation }: AdminUpdateUserRequest) {
  const result = await api.patch(`/users/${userId}`, {
    user: {
      role,
      occupation,
    }
  })


  return result.data
}