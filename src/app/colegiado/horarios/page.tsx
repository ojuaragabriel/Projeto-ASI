'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
    horariosIniciais,
    disciplinas,
    professores,
    alocacoesIniciais,
    Horario,
    SEMESTERS
} from '@/lib/mock-data';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const DIAS_SEMANA: Horario['dia'][] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const SLOTS_HORARIO: Horario['slot'][] = ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'];

export default function GradeHorariosPage({ selectedSemester }: { selectedSemester: string }) {
    const [horarios, setHorarios] = React.useState<Horario[]>(horariosIniciais);
    const [alocacoes, setAlocacoes] = React.useState(alocacoesIniciais);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    
    const horariosDoSemestre = horarios.filter(h => h.semestre === selectedSemester);
    const alocacoesDoSemestre = alocacoes.filter(a => a.semestre === selectedSemester);

    const handleAddHorario = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newHorario: Horario = {
            id: `h${Date.now()}`,
            disciplinaId: formData.get('disciplinaId') as string,
            turma: 'T1', // Mock
            semestre: selectedSemester,
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
        const horarioNoSlot = horariosDoSemestre.find(h => h.dia === dia && h.slot === slot);
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

    const professorCarga = React.useMemo(() => {
        const cargas: { [key: string]: { carga: number, min: number, max: number } } = {};
        professores.forEach(p => {
            cargas[p.id] = { carga: 0, min: p.minHoras, max: p.maxHoras };
        });

        alocacoesDoSemestre
            .filter(a => a.professorId)
            .forEach(a => {
                const disciplina = disciplinas.find(d => d.id === a.disciplinaId);
                if (disciplina && a.professorId && cargas[a.professorId]) {
                    cargas[a.professorId].carga += disciplina.cargaHoraria;
                }
            });
        return cargas;
    }, [alocacoesDoSemestre]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Horários e Alocação ({selectedSemester})</h1>
                    <p className="text-muted-foreground">Gerencie os horários e a alocação de professores para as disciplinas.</p>
                </div>
            </div>
            
            <Tabs defaultValue="horarios">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="horarios">Grade de Horários</TabsTrigger>
                    <TabsTrigger value="alocacao">Alocação de Professores</TabsTrigger>
                </TabsList>
                <TabsContent value="horarios">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Grade Semanal</CardTitle>
                                    <CardDescription>Visualize e adicione aulas na grade semanal.</CardDescription>
                                </div>
                                <Button onClick={() => setIsFormOpen(true)}>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Adicionar Horário
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-6 gap-1">
                                <div /> 
                                {DIAS_SEMANA.map(dia => <div key={dia} className="text-center font-bold p-2">{dia}</div>)}
                                
                                {SLOTS_HORARIO.map(slot => (
                                    <React.Fragment key={slot}>
                                        <div className="text-center font-bold p-2 flex items-center justify-center text-sm">{slot}</div>
                                        {DIAS_SEMANA.map(dia => renderSlot(dia, slot))}
                                    </React.Fragment>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="alocacao">
                     <Card>
                        <CardHeader>
                            <CardTitle>Carga Horária dos Professores</CardTitle>
                            <CardDescription>Acompanhe a carga horária alocada em tempo real.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {professores.map(p => {
                                const carga = professorCarga[p.id];
                                const percentual = (carga.carga / carga.max) * 100;
                                const isOverloaded = carga.carga > carga.max;
                                const isUnderloaded = carga.carga < carga.min && carga.carga > 0;

                                return (
                                    <div key={p.id} className="p-4 border rounded-lg">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-sm font-medium">{p.nome}</p>
                                            <p className="text-sm text-muted-foreground">{carga.carga}h / {carga.max}h</p>
                                        </div>
                                        <Progress value={percentual} className="h-2" />
                                        {isOverloaded && <p className="text-xs text-destructive mt-1">Carga horária máxima excedida.</p>}
                                        {isUnderloaded && <p className="text-xs text-amber-500 mt-1">Abaixo da carga mínima.</p>}
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>


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
        </div>
    );
}
