import z from 'zod';
import { LoginMethod } from 'prisma/prisma-client';

export const loginMethod: z.ZodType<LoginMethod> = z.nativeEnum(LoginMethod);

export const loginSchema = z.object({
  method: loginMethod,
  data: z.any(),
  imageUrl: z.string().optional(),
});

export const createUserDtoSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  login: loginSchema,
});

export type CreateUserDto = z.infer<typeof createUserDtoSchema>;
