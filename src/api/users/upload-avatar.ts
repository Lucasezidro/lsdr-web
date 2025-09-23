import { api } from "../client";

export async function uploadAvatar(avatarUrl: string, userId: number | null) {
  const result = await api.patch(`/users/${userId}`, {
    user: {
      predefined_avatar_url: avatarUrl
    }
  })

  return result.data;
}