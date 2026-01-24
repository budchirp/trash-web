import z from 'zod'

export const newUserSchema = z.object({
  email: z.email(),
  username: z.string().min(3),
  password: z.string().min(8)
})

export type NewUserValues = z.infer<typeof newUserSchema>
