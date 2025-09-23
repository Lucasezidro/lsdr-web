import { api } from "../client";

interface InviteMemberRequest {
  orgId: number
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE'
}

interface InviteMemberResponse {
  message: string
}

export async function inviteMember({ orgId, email, role }: InviteMemberRequest): Promise<InviteMemberResponse> {
  const result = await api.post(`/organizations/${orgId}/invite`, {
    email,
    role
  })

  return result.data
}