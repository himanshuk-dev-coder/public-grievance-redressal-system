import z from "zod";

const envSchema = z.object({
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    FRONTEND_URL: z.url().trim().min(1),
    GOOGLE_REDIRECT_URI: z.url().trim().min(1)
});


export const env = envSchema.parse(process.env);