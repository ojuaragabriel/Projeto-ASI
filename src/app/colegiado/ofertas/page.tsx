'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  disciplinas as allDisciplinas,
  cursos,
  departamentos,
  ofertasIniciais,
  Disciplina,
  Oferta,
} from '@/lib/mock-data';
import DashboardLayout from '../layout';

export default function OfertasPage({ selectedSemester }: { selectedSemester: string }) {
    const [disciplinas, setDisciplinas] = React.useState<Disciplina[]>(allDisciplinas);
    const [ofertas, setOfertas] = React.useState<Oferta[]>(ofertasIniciais);
    const { toast } = useToast();

    // Mock: Colegiado de Engenharia de Computação
    const meuColegiadoId = 'c01'; 
    const meuCurso = cursos.find(c => c.colegiadoId === meuColegiadoId);

    const ofertasDoSemestre = ofertas.filter(o => o.semestre === selectedSemester && o.cursoId === meuCurso?.id);
    const disciplinasOfertadasIds = new Set(ofertasDoSemestre.map(o => o.disciplinaId));

    const handleToggleOferta = (disciplinaId: string) => {
        setOfertas(currentOfertas => {
            const isOfertada = currentOfertas.some(o => o.disciplinaId === disciplinaId && o.semestre === selectedSemester && o.cursoId === meuCurso?.id);
            if (isOfertada) {
                return currentOfertas.filter(o => !(o.disciplinaId === disciplinaId && o.semestre === selectedSemester && o.cursoId === meuCurso?.id));
            } else {
                return [...currentOfertas, { cursoId: meuCurso!.id, disciplinaId, semestre: selectedSemester }];
            }
        });
    };

    const handleSaveChanges = () => {
        // In a real app, this would be a server action.
        // Here, we just show a toast.
        console.log("Saving new offers:", ofertas.filter(o => o.semestre === selectedSemester));
        toast({
            title: 'Oferta Salva!',
            description: `As disciplinas para o semestre ${selectedSemester} foram atualizadas.`,
        });
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold">Ofertas do Curso ({selectedSemester})</h1>
                            <p className="text-muted-foreground">
                                Gerencie as disciplinas ofertadas para o curso de {meuCurso?.nome}.
                            </p>
                        </div>
                        <Button onClick={handleSaveChanges}>
                            Salvar Oferta ({disciplinasOfertadasIds.size})
                        </Button>
                    </div>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Checklist de Disciplinas</CardTitle>
                        <CardDescription>Selecione as disciplinas que serão ofertadas neste semestre.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">Ofertada</TableHead>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Disciplina</TableHead>
                                    <TableHead>Departamento de Origem</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {disciplinas.map((disciplina) => {
                                    const depto = departamentos.find(d => d.id === disciplina.departamentoId);
                                    const isFromMyCourseDept = depto?.id === meuCurso?.departamentoId;

                                    return (
                                        <TableRow key={disciplina.id} data-state={disciplinasOfertadasIds.has(disciplina.id) ? 'selected' : ''}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={disciplinasOfertadasIds.has(disciplina.id)}
                                                    onCheckedChange={() => handleToggleOferta(disciplina.id)}
                                                    aria-label={`Selecionar ${disciplina.nome}`}
                                                />
                                            </TableCell>
                                            <TableCell className="font-mono">{disciplina.codigo}</TableCell>
                                            <TableCell className="font-medium">{disciplina.nome}</TableCell>
                                            <TableCell>
                                                {depto?.nome}
                                                {!isFromMyCourseDept && (
                                                    <Badge variant="outline" className="ml-2">Depto. Externo</Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
