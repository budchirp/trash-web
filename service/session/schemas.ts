import z from 'zod'

export const newSessionSchema = z.object({
  email: z.string().min(1, 'Enter your email').email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password')
})

export type NewSessionValues = z.infer<typeof newSessionSchema>
