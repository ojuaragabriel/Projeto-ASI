'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const { username, password } = Object.fromEntries(formData.entries());

    // Hardcoded credentials for MVP
    if (username === 'admin' && password === 'admin') {
      const cookieStore = cookies();
      cookieStore.set('session', 'ok', { 
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 24, // 1 day
          path: '/',
      });
      redirect('/escolher-materias');
    } else {
      return 'Usuário ou senha inválidos.';
    }
  } catch (error) {
     if ((error as Error).message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    return 'Ocorreu um erro. Tente novamente.';
  }
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete('session');
}