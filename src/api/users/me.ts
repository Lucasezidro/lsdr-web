import { api } from "../client";

export async function me() {

  const result = await api.get('/me')

  return result.data
}