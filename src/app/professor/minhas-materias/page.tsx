'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    horariosIniciais as allHorarios,
    alocacoesIniciais as allAlocacoes,
    disciplinas as allDisciplinas,
    professores,
    departamentos,
    areas,
    Horario,
    Disciplina,
} from '@/lib/mock-data';
import DashboardLayout from '../layout';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Building } from 'lucide-react';

export default function MinhasMateriasPage({ selectedSemester }: { selectedSemester: string }) {
    
    // Mock: Encontrar o professor logado.
    const professorLogado = professores.find(p => p.nome === 'Você');

    const minhasAlocacoesIds = allAlocacoes
        .filter(a => a.professorId === professorLogado?.id && a.semestre === selectedSemester)
        .map(a => a.disciplinaId);
        
    const minhasDisciplinas = allDisciplinas.filter(d => minhasAlocacoesIds.includes(d.id));

    const meusHorarios = allHorarios.filter(h => minhasAlocacoesIds.includes(h.disciplinaId) && h.semestre === selectedSemester);

    const getHorariosForDisciplina = (disciplinaId: string) => {
        return meusHorarios
            .filter(h => h.disciplinaId === disciplinaId)
            .map(h => `${h.dia}, ${h.slot}`)
            .join(' | ');
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Minhas Matérias ({selectedSemester})</h1>
                    <p className="text-muted-foreground">Suas disciplinas e horários alocados para o semestre.</p>
                </div>
                
                {minhasDisciplinas.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {minhasDisciplinas.map(disciplina => {
                            const depto = departamentos.find(d => d.id === disciplina.departamentoId);
                            const area = areas.find(a => a.id === disciplina.areaId);
                            const horarios = getHorariosForDisciplina(disciplina.id);
                            const turma = meusHorarios.find(h => h.disciplinaId === disciplina.id)?.turma || 'N/A';

                            return (
                                <Card key={disciplina.id}>
                                    <CardHeader>
                                        <div className='flex justify-between items-start'>
                                            <CardTitle>{disciplina.nome}</CardTitle>
                                            <Badge variant="secondary">{disciplina.codigo}</Badge>
                                        </div>
                                        <CardDescription>
                                            {depto?.nome} {area ? `/ ${area.nome}` : ''}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center text-sm">
                                            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                                            <span>Carga: {disciplina.cargaHoraria}h semanais</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Building className="w-4 h-4 mr-2 text-muted-foreground" />
                                            <span>Turma: {turma}</span>
                                        </div>
                                        <div className="flex items-start text-sm">
                                            <Calendar className="w-4 h-4 mr-2 mt-1 text-muted-foreground" />
                                            <span>{horarios || 'Horário a definir'}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                     <Card className="col-span-full">
                        <CardContent className="flex flex-col items-center justify-center h-64">
                            <h3 className="text-xl font-semibold">Nenhuma matéria alocada</h3>
                            <p className="text-muted-foreground">Você não tem matérias alocadas para o semestre {selectedSemester}.</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}
