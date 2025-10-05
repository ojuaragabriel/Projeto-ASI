'use client';
import { useUser } from '@/hooks/use-user';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardRootPage() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user?.role) {
      // Redirect to the role's specific root page
      if (user.role === 'professor') redirect('/professor');
      if (user.role === 'coordenador') redirect('/coordenador');
      if (user.role === 'colegiado') redirect('/colegiado');
    }
  }, [user, isLoading]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <p>Carregando...</p>
    </div>
  );
}
