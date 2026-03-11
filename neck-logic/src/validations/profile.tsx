import { z } from 'zod';

export const profileSchema = z.object({
    name: z.string()
        .min(2, 'O nome deve ter no mínimo 2 caracteres.')
        .max(100, 'O nome excedeu o limite de caracteres.'),
    email: z.string()
        .email('Formato de e-mail inválido.')
        .max(255, 'O e-mail excedeu o limite de caracteres.')
});

export const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'A senha atual é obrigatória.'),
    newPassword: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres.'),
    confirmPassword: z.string().min(1, 'A confirmação da nova senha é obrigatória.')
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "A nova senha e a confirmação não coincidem.",
    path: ["confirmPassword"]
});

export type ProfileSchema = z.infer<typeof profileSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>;