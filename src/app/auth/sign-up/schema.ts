import z from "zod";

export const signUpSchema = z.object({
  user: z.object({
    email: z.string().email({ message: 'Por favor, digite um e-mail válido.' }),
    password: z.string().min(1, { message: 'A senha é obrigatória.' }),
    password_confirmation: z.string().min(1, { message: 'A senha é obrigatória.' }),
    name: z.string().min(1, { message: 'O nome é obrigatório.' }),
    role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']).default('EMPLOYEE'),
    address_attributes: z.object({
      street: z.string().min(1, { message: 'A rua é obrigatória.' }),
      city: z.string().min(1, { message: 'A cidade é obrigatória.' }),
      state: z.string().min(1, { message: 'O estado é obrigatório.' }),
      zip_code: z.string().min(1, { message: 'O CEP é obrigatório.' }),
      neighborhood: z.string().min(1, { message: 'O bairro é obrigatório.' }),
      number: z.string().min(1, { message: 'O número é obrigatório.' }),
      complement: z.string().optional(),
    })
  })
})
