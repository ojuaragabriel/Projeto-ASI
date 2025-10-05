'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { z } from 'zod';

const LoginSchema = z.object({
  name: z.string().min(1, 'Nome de usuário é obrigatório.'),
  password: z.string().min(1, 'Senha é obrigatória.'),
  role: z.enum(['professor', 'colegiado', 'departamento']),
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const parsedData = LoginSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!parsedData.success) {
      return parsedData.error.errors.map((e) => e.message).join(', ');
    }
    
    const { name, role, password } = parsedData.data;

    // MVP Login: user/pass 'admin' is valid for any role
    if (password !== 'admin' || name !== 'admin') {
      return 'Usuário ou senha inválidos.';
    }

    const cookieStore = cookies();
    cookieStore.set('user_name', name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    cookieStore.set('role', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });

  } catch (error) {
    if ((error as Error).message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    console.error(error);
    return 'Ocorreu um erro inesperado. Tente novamente.';
  }
  
  const role = formData.get('role');
  redirect(`/${role}`);
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete('user_name');
  cookieStore.delete('role');
  redirect('/login');
}
