import { z } from 'zod'

export const usernameSchema = z
.string()
.min(3)
.max(20)
.regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters')


export const signupSchema = z.object({
    username: usernameSchema,
    email: z.string().email('Invalid email address'),
    password:z.string().min(6,{message:'Password must be at least 6 characters long'}),
})