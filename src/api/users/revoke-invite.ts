import { api } from "../client";

export async function revokeInvite(userId: number) {
  const result = await api.patch(`/users/${userId}/accept_invitation`)

  return result.data
}