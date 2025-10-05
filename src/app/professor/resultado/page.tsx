'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { 
    alocacoesIniciais as allAlocacoes,
    disciplinas as allDisciplinas,
    professores,
} from '@/lib/mock-data';
import DashboardLayout from '../layout';
import { cn } from '@/lib/utils';

type StatusFiltro = 'all' | 'alocado-mim' | 'alocado-outro' | 'nao-alocado';

export default function ResultadoPage({ selectedSemester }: { selectedSemester: string }) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [statusFiltro, setStatusFiltro] = React.useState<StatusFiltro>('all');
    
    // Mock: Encontrar o professor logado.
    const professorLogado = professores.find(p => p.nome === 'Você');

    const alocacoesDoSemestre = React.useMemo(() => {
        return allDisciplinas.map(disciplina => {
            const alocacao = allAlocacoes.find(a => a.disciplinaId === disciplina.id && a.semestre === selectedSemester);
            const professor = alocacao?.professorId ? professores.find(p => p.id === alocacao.professorId) : null;
            
            let status: 'Alocado para você' | 'Alocado' | 'Não alocado' = 'Não alocado';
            if (professor) {
                status = professor.id === professorLogado?.id ? 'Alocado para você' : 'Alocado';
            }

            return {
                disciplina,
                professor,
                status,
            };
        })
        .filter(item => item.disciplina.nome.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(item => {
            if (statusFiltro === 'all') return true;
            if (statusFiltro === 'alocado-mim') return item.status === 'Alocado para você';
            if (statusFiltro === 'alocado-outro') return item.status === 'Alocado';
            if (statusFiltro === 'nao-alocado') return item.status === 'Não alocado';
            return true;
        });
    }, [selectedSemester, searchTerm, statusFiltro, professorLogado]);

    const getBadgeVariant = (status: string) => {
        if (status === 'Alocado para você') return 'default';
        if (status === 'Alocado') return 'secondary';
        return 'outline';
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Resultado da Alocação de Matérias ({selectedSemester})</h1>
                    <p className="text-muted-foreground">Veja quais professores foram alocados para cada disciplina.</p>
                </div>
                
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                             <CardTitle>Disciplinas e Alocações</CardTitle>
                             <div className="flex items-center space-x-2">
                                <Input 
                                    placeholder="Filtrar por disciplina..." 
                                    className="max-w-sm" 
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                                <Select value={statusFiltro} onValueChange={(v) => setStatusFiltro(v as StatusFiltro)}>
                                    <SelectTrigger className="w-[220px]">
                                        <SelectValue placeholder="Filtrar por status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os Status</SelectItem>
                                        <SelectItem value="alocado-mim">Alocado para você</SelectItem>
                                        <SelectItem value="alocado-outro">Alocado (Outro)</SelectItem>
                                        <SelectItem value="nao-alocado">Não alocado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Disciplina</TableHead>
                                    <TableHead>Professor Alocado</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {alocacoesDoSemestre.map(({ disciplina, professor, status }) => (
                                    <TableRow key={disciplina.id} className={cn(status === 'Alocado para você' && 'bg-primary/10')}>
                                        <TableCell className="font-medium">{disciplina.nome} ({disciplina.codigo})</TableCell>
                                        <TableCell>{professor?.nome || <span className="text-muted-foreground">Ninguém</span>}</TableCell>
                                        <TableCell>
                                            <Badge variant={getBadgeVariant(status)}>
                                                {status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                 {alocacoesDoSemestre.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                                            Nenhuma disciplina encontrada para os filtros selecionados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
