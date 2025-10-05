import { UserRole } from '@/hooks/use-user';
import { Book, Users, FileText, ListChecks, AreaChart, BookCheck, BookCopy, Library, CalendarCheck } from 'lucide-react';

export const getNavItems = (role?: UserRole) => {
    switch (role) {
        case 'professor':
            return [
                { href: '/professor/preferencias', icon: ListChecks, label: 'Escolher Matérias' },
                { href: '/professor/resultado', icon: AreaChart, label: 'Resultado de Matérias' },
                { href: '/professor/minhas-materias', icon: BookCheck, label: 'Minhas Matérias' },
            ];
        case 'colegiado':
            return [
                { href: '/colegiado/ofertas', icon: BookCopy, label: 'Ofertas do Curso' },
                { href: '/colegiado/disciplinas', icon: Library, label: 'Disciplinas por Depto.' },
                { href: '/colegiado/horarios', icon: CalendarCheck, label: 'Horários e Alocação' },
            ];
        case 'departamento':
            return [
                { href: '/departamento/disciplinas', icon: Book, label: 'Catálogo de Disciplinas' },
                { href: '/departamento/professores', icon: Users, label: 'Professores & Carga' },
                { href: '/departamento/relatorios', icon: FileText, label: 'Relatórios' },
            ];
        default:
            return [];
    }
};
