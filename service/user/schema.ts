import z from 'zod'

export const newUserSchema = z.object({
  email: z.string().min(1, 'Enter your email').email('Enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export type NewUserValues = z.infer<typeof newUserSchema>

export const signUpSchema = newUserSchema.extend({
  accept_terms: z.literal(true, 'You must accept the Terms of Service and Privacy Policy'),
  captcha: z.string().min(1, 'Complete the captcha')
})

export type SignUpValues = z.infer<typeof signUpSchema>

export const profileSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(100),
  gender: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.enum(['male', 'female']).optional()
  ),
  picture: z.string().nullable().optional(),
  public: z.boolean().optional()
})

export type ProfileValues = z.infer<typeof profileSchema>
export type ProfileInputValues = z.input<typeof profileSchema>
