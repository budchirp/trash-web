import z from 'zod'

export const credentialsSchema = z.object({
  email: z.string().min(1, 'Enter your email').email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password')
})

export type NewSessionValues = z.infer<typeof credentialsSchema>

export const signInSchema = credentialsSchema.extend({
  captcha: z.string().min(1, 'Complete the captcha')
})

export type SignInValues = z.infer<typeof signInSchema>
