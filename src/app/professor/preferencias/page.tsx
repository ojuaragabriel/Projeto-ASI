'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
    disciplinas as allDisciplinas,
    departamentos,
    areas,
    professores,
    alocacoesIniciais,
    preferenciasIniciais,
    Preferencia,
} from '@/lib/mock-data';
import DashboardLayout from '../layout';

export default function PreferenciasPage({ selectedSemester }: { selectedSemester: string }) {
    const { toast } = useToast();
    const professorLogado = professores.find(p => p.nome === 'Você');

    const [preferencias, setPreferencias] = React.useState<Preferencia[]>(preferenciasIniciais);
    const [justificativa, setJustificativa] = React.useState('');
    
    const minhasPreferencias = preferencias.find(p => p.professorId === professorLogado?.id && p.semestre === selectedSemester);
    const [selectedDisciplinas, setSelectedDisciplinas] = React.useState<Set<string>>(
        new Set(minhasPreferencias?.disciplinasIds || [])
    );

    React.useEffect(() => {
        const minhasPrefs = preferencias.find(p => p.professorId === professorLogado?.id && p.semestre === selectedSemester);
        setSelectedDisciplinas(new Set(minhasPrefs?.disciplinasIds || []));
        setJustificativa(minhasPrefs?.justificativa || '');
    }, [selectedSemester, preferencias, professorLogado]);

    const disciplinasDisponiveis = React.useMemo(() => {
        const disciplinasAlocadas = new Set(
            alocacoesIniciais
                .filter(a => a.semestre === selectedSemester && a.professorId)
                .map(a => a.disciplinaId)
        );
        return allDisciplinas.filter(d => !disciplinasAlocadas.has(d.id));
    }, [selectedSemester]);

    const handleToggleDisciplina = (disciplinaId: string) => {
        setSelectedDisciplinas(prev => {
            const newSet = new Set(prev);
            if (newSet.has(disciplinaId)) {
                newSet.delete(disciplinaId);
            } else {
                newSet.add(disciplinaId);
            }
            return newSet;
        });
    };

    const handleEnviar = () => {
        const newPreferencia: Preferencia = {
            professorId: professorLogado!.id,
            semestre: selectedSemester,
            disciplinasIds: Array.from(selectedDisciplinas),
            justificativa,
        };

        setPreferencias(prev => {
            const otherPrefs = prev.filter(p => !(p.professorId === professorLogado!.id && p.semestre === selectedSemester));
            return [...otherPrefs, newPreferencia];
        });

        toast({
            title: "Preferências Enviadas!",
            description: `Suas preferências para o semestre ${selectedSemester} foram salvas.`,
        });
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Manifestação de Preferências ({selectedSemester})</h1>
                    <p className="text-muted-foreground">Selecione as disciplinas que você tem interesse em lecionar.</p>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Disciplinas Disponíveis</CardTitle>
                        <CardDescription>Marque as disciplinas de seu interesse para o próximo semestre.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]"></TableHead>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Departamento/Área</TableHead>
                                    <TableHead>Carga Semanal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {disciplinasDisponiveis.map(disciplina => {
                                    const depto = departamentos.find(d => d.id === disciplina.departamentoId);
                                    const area = areas.find(a => a.id === disciplina.areaId);
                                    return (
                                        <TableRow key={disciplina.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedDisciplinas.has(disciplina.id)}
                                                    onCheckedChange={() => handleToggleDisciplina(disciplina.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">{disciplina.nome}</TableCell>
                                            <TableCell>{disciplina.codigo}</TableCell>
                                            <TableCell>{depto?.nome}{area ? ` / ${area.nome}`: ''}</TableCell>
                                            <TableCell>{disciplina.cargaHoraria}h</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Justificativa (Opcional)</CardTitle>
                        <CardDescription>
                            Use este espaço para fornecer informações adicionais, como ordem de preferência ou outras observações.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea 
                            value={justificativa}
                            onChange={(e) => setJustificativa(e.target.value)}
                            placeholder="Ex: 1. Cálculo I, 2. Álgebra Linear..."
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button 
                        size="lg"
                        onClick={handleEnviar}
                        disabled={selectedDisciplinas.size === 0}
                    >
                        Enviar Preferências ({selectedDisciplinas.size})
                    </Button>
                </div>
            </div>
        </DashboardLayout>
    );
}
