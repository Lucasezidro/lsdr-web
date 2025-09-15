'use server'

import { signIn } from '@/api/users/sign-in'
import { AxiosError } from 'axios'
import { cookies } from 'next/headers'
import { z } from 'zod'

const signInSchema = z.object({
  email: z.email({ message: 'Por favor, digite um e-mail válido.' }),
  password: z.string().min(1, { message: 'A senha é obrigatória.' }),
})

export async function signInAction(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { email, password } = result.data

  try {
    const { token, user } = await signIn({
      email,
      password,
    })

    ;(await cookies()).set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    ;(await cookies()).set('userId', user.id)
  } catch (err) {
    if (err instanceof AxiosError) {
      const { message } = err

      return { success: false, message, errors: null }
    }

    console.error(err)

    return {
      success: false,
      message: 'Um erro inesperado ocorreu, tente novamente em alguns minutos.',
      errors: null,
    }
  }

  return { success: true, message: null, errors: null }
}