'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser } from '@/hooks/use-user';
import { 
    horariosIniciais,
    alocacoesIniciais,
    disciplinas,
    professores,
    Horario,
} from '@/lib/mock-data';
import DashboardLayout from '../../dashboard/layout';
import { cn } from '@/lib/utils';

const DIAS_SEMANA: Horario['dia'][] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const SLOTS_HORARIO: Horario['slot'][] = ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'];

export default function MeusHorariosPage() {
    const { user } = useUser();
    
    // Mock: Encontrar o professor logado.
    const professorLogado = professores.find(p => p.nome === 'Você');

    const minhasAlocacoesIds = alocacoesIniciais
        .filter(a => a.professorId === professorLogado?.id && a.semestre === '2025.1')
        .map(a => a.disciplinaId);
        
    const meusHorarios = horariosIniciais.filter(h => minhasAlocacoesIds.includes(h.disciplinaId));

    const renderSlot = (dia: Horario['dia'], slot: Horario['slot']) => {
        const horarioNoSlot = meusHorarios.find(h => h.dia === dia && h.slot === slot);
        const disciplina = horarioNoSlot ? disciplinas.find(d => d.id === horarioNoSlot.disciplinaId) : null;
        
        return (
            <div key={`${dia}-${slot}`} className={cn(
                "h-24 border-dashed border flex flex-col p-2 justify-center items-center rounded-lg",
                horarioNoSlot ? 'bg-primary/20 border-primary' : 'bg-card'
            )}>
                {disciplina ? (
                    <>
                        <p className="text-sm font-semibold text-center">{disciplina.nome}</p>
                        <p className="text-xs text-muted-foreground">{disciplina.codigo}</p>
                        <p className="text-xs text-muted-foreground">Turma {horarioNoSlot.turma}</p>
                    </>
                ) : (
                    <span className="text-muted-foreground text-xs">Livre</span>
                )}
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Meus Horários</h1>
                    <p className="text-muted-foreground">Sua grade de horários para o semestre 2025.1.</p>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Grade Semanal</CardTitle>
                        <CardDescription>Suas aulas distribuídas durante a semana.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-6 gap-1">
                            {/* Header Vazio */}
                            <div /> 
                            {/* Headers de Dia */}
                            {DIAS_SEMANA.map(dia => <div key={dia} className="text-center font-bold p-2">{dia}</div>)}
                            
                            {/* Linhas de Horário */}
                            {SLOTS_HORARIO.map(slot => (
                                <React.Fragment key={slot}>
                                    <div className="text-center font-bold p-2 flex items-center justify-center text-sm">{slot}</div>
                                    {DIAS_SEMANA.map(dia => renderSlot(dia, slot))}
                                </React.Fragment>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
