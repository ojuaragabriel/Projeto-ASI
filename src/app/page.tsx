'use client';
import { redirect } from 'next/navigation';
import { useUser } from '@/hooks/use-user';
import { useEffect } from 'react';

export default function RootPage() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (isLoading) {
      return; // Wait until user data is loaded
    }
    if (user?.role) {
      redirect(`/dashboard`);
    } else {
      redirect('/login');
    }
  }, [user, isLoading]);

  // Render a loading state while waiting for redirection
  return <div className="h-screen w-screen flex justify-center items-center">Carregando...</div>;
}
