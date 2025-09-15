import { api } from "../client";

export async function uploadAvatar(userId: number | null, file: FormData) {
  const result = await api.patch(`/users/${userId}`, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return result.data;
}