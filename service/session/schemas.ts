import z from 'zod'

export const newSessionSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
})

export type NewSessionValues = z.infer<typeof newSessionSchema>
