'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    horariosIniciais,
    disciplinas,
    Horario,
    SEMESTERS
} from '@/lib/mock-data';
import DashboardLayout from '../../dashboard/layout';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const DIAS_SEMANA: Horario['dia'][] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const SLOTS_HORARIO: Horario['slot'][] = ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'];

export default function GradeHorariosPage() {
    const [horarios, setHorarios] = React.useState<Horario[]>(horariosIniciais);
    const [isFormOpen, setIsFormOpen] = React.useState(false);

    const handleAddHorario = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newHorario: Horario = {
            id: `h${Date.now()}`,
            disciplinaId: formData.get('disciplinaId') as string,
            turma: 'T1', // Mock
            semestre: SEMESTERS[0], // Mock
            dia: formData.get('dia') as Horario['dia'],
            slot: formData.get('slot') as Horario['slot'],
        };
        setHorarios([...horarios, newHorario]);
        setIsFormOpen(false);
    };
    
    const handleDeleteHorario = (id: string) => {
        setHorarios(horarios.filter(h => h.id !== id));
    };

    const renderSlot = (dia: Horario['dia'], slot: Horario['slot']) => {
        const horarioNoSlot = horarios.find(h => h.dia === dia && h.slot === slot && h.semestre === SEMESTERS[0]);
        const disciplina = horarioNoSlot ? disciplinas.find(d => d.id === horarioNoSlot.disciplinaId) : null;
        
        return (
            <div key={`${dia}-${slot}`} className={cn(
                "h-24 border-dashed border flex flex-col p-2 justify-center items-center rounded-lg relative group",
                horarioNoSlot ? 'bg-secondary/50' : 'bg-card'
            )}>
                {disciplina ? (
                    <>
                        <p className="text-sm font-semibold text-center">{disciplina.nome}</p>
                        <p className="text-xs text-muted-foreground">{disciplina.codigo}</p>
                        <p className="text-xs text-muted-foreground">Turma {horarioNoSlot.turma}</p>
                        <Button 
                            variant="destructive" 
                            size="icon" 
                            className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteHorario(horarioNoSlot.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </>
                ) : (
                    <span className="text-muted-foreground text-xs">Vago</span>
                )}
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">Grade de Horários</h1>
                        <p className="text-muted-foreground">Gerencie os horários das disciplinas para o semestre 2025.1.</p>
                    </div>
                    <Button onClick={() => setIsFormOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Adicionar Horário
                    </Button>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Semestre 2025.1</CardTitle>
                        <CardDescription>Visualize e adicione aulas na grade semanal.</CardDescription>
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

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Aula na Grade</DialogTitle>
                        <DialogDescription>
                           Selecione a disciplina, o dia e o horário.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddHorario} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="disciplinaId">Disciplina</Label>
                            <Select name="disciplinaId" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a disciplina" />
                                </SelectTrigger>
                                <SelectContent>
                                    {disciplinas.map(d => (
                                        <SelectItem key={d.id} value={d.id}>{d.codigo} - {d.nome}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dia">Dia da Semana</Label>
                                <Select name="dia" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o dia" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DIAS_SEMANA.map(dia => (
                                            <SelectItem key={dia} value={dia}>{dia}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slot">Horário</Label>
                                <Select name="slot" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o slot" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SLOTS_HORARIO.map(slot => (
                                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                            <Button type="submit">Adicionar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
