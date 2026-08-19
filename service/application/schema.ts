import z from 'zod'

export const applicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Enter an application name')
    .max(100, 'Name must be at most 100 characters'),
  description: z
    .string()
    .trim()
    .min(1, 'Enter a description')
    .max(500, 'Description must be at most 500 characters')
})

export type ApplicationValues = z.infer<typeof applicationSchema>
export type ApplicationInputValues = z.input<typeof applicationSchema>
