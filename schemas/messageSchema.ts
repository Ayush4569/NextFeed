import { z } from 'zod'

export const messageSchema = z.object(
    {
        content: z.string().min(1, { message: 'Message content is required' }).max(100, { message: 'Message content must be less than 100 characters' }),
    }
)