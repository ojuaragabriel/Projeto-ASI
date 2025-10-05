'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Ban, Check, PlusCircle } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { 
    alocacoesIniciais, 
    disciplinas as allDisciplinas, 
    professores as allProfessores, 
    Alocacao,
    Disciplina,
    Professor
} from '@/lib/mock-data';
import DashboardLayout from '../dashboard/layout';

export default function ProfessorPage() {
    const { user } = useUser();
    const [alocacoes, setAlocacoes] = React.useState<Alocacao[]>(alocacoesIniciais);

    // Mock: Encontrar o professor logado. Na vida real, viria do `user`.
    const professorLogado = allProfessores.find(p => p.nome === 'Você');

    const minhasAlocacoes = alocacoes.filter(a => a.professorId === professorLogado?.id && a.semestre === '2025.1');
    const disciplinasOfertadas = alocacoes.filter(a => a.professorId === null && a.semestre === '2025.1');

    const minhasDisciplinas = minhasAlocacoes.map(a => {
        return allDisciplinas.find(d => d.id === a.disciplinaId);
    }).filter((d): d is Disciplina => d !== undefined);

    const cargaHorariaTotal = minhasDisciplinas.reduce((acc, d) => acc + d.cargaHoraria, 0);
    const cargaPercentual = professorLogado ? (cargaHorariaTotal / professorLogado.maxHoras) * 100 : 0;

    const handleAceitarDisciplina = (disciplinaId: string) => {
        setAlocacoes(prevAlocacoes => {
            // Remove a oferta da lista de ofertadas
            const novasAlocacoes = prevAlocacoes.filter(a => a.disciplinaId !== disciplinaId);
            // Adiciona a alocação para o professor
            novasAlocacoes.push({
                disciplinaId,
                professorId: professorLogado!.id,
                semestre: '2025.1',
                status: 'alocada'
            });
            return novasAlocacoes;
        });
    };

    return (
        <DashboardLayout>
            <TooltipProvider>
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold">Minhas Disciplinas</h1>
                        <p className="text-muted-foreground">Visualize suas disciplinas alocadas e escolha novas ofertas para o semestre 2025.1.</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Resumo da Carga Horária - 2025.1</CardTitle>
                            <CardDescription>
                                Sua carga horária total para o semestre é de {cargaHorariaTotal}h.
                                (Mín: {professorLogado?.minHoras}h / Máx: {professorLogado?.maxHoras}h)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Progress value={cargaPercentual} className="h-3" />
                             {cargaHorariaTotal > (professorLogado?.maxHoras || 0) && 
                                <p className="text-xs text-destructive mt-2">Atenção: Sua carga horária máxima foi excedida.</p>}
                            {cargaHorariaTotal < (professorLogado?.minHoras || 0) && cargaHorariaTotal > 0 &&
                                <p className="text-xs text-amber-500 mt-2">Atenção: Sua carga horária está abaixo do mínimo.</p>}
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Disciplinas Alocadas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {minhasDisciplinas.length > 0 ? minhasDisciplinas.map((subject) => (
                                    <div key={subject.id} className="p-4 rounded-lg border bg-secondary/30">
                                        <p className="font-semibold">{subject.nome} ({subject.codigo})</p>
                                        <p className="text-sm text-muted-foreground">Carga Horária: {subject.cargaHoraria}h</p>
                                    </div>
                                )) : <p className="text-sm text-muted-foreground">Nenhuma disciplina alocada.</p>}
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button disabled className="w-full mt-4">
                                            <Ban className="mr-2 h-4 w-4" />
                                            Criar Nova Disciplina
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Apenas coordenadores de colegiado podem criar disciplinas.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Disciplinas Ofertadas</CardTitle>
                                <CardDescription>Disciplinas disponíveis que você pode escolher.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {disciplinasOfertadas.map(oferta => {
                                    const disciplina = allDisciplinas.find(d => d.id === oferta.disciplinaId);
                                    if (!disciplina) return null;
                                    return (
                                        <div key={disciplina.id} className="p-4 rounded-lg border flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold">{disciplina.nome} ({disciplina.codigo})</p>
                                                <p className="text-sm text-muted-foreground">Carga Horária: {disciplina.cargaHoraria}h</p>
                                            </div>
                                            <Button size="sm" onClick={() => handleAceitarDisciplina(disciplina.id)}>
                                                <Check className="mr-2 h-4 w-4" />
                                                Aceitar
                                            </Button>
                                        </div>
                                    )
                                })}
                                {disciplinasOfertadas.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma disciplina ofertada no momento.</p>}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TooltipProvider>
        </DashboardLayout>
    );
}
