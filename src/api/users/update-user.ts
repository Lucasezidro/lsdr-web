import { api } from "../client";

interface UpdateUserRequest {
  userId: number
  name: string
  email: string
  phone_number: string
}

export async function updateUser({ userId, email, name, phone_number }: UpdateUserRequest) {
  const result = await api.patch(`/users/${userId}`, {
    user: {
      email,
      name,
      phone_number
    }
  })


  return result.data
}