import { z } from 'zod'

export const siginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
})