'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from '@/components/ui/progress';
import { alocacoesIniciais, disciplinas, professores as allProfessores, departamentos, areas } from '@/lib/mock-data';

export default function ProfessoresCargaPage({ selectedSemester }: { selectedSemester: string }) {
    
    const meuDepartamentoId = 'd01'; 

    const professoresDoDepto = allProfessores.filter(p => p.departamentoId === meuDepartamentoId);

    const professorCarga = React.useMemo(() => {
        const cargas: { [key: string]: { carga: number, min: number, max: number } } = {};
        professoresDoDepto.forEach(p => {
            cargas[p.id] = { carga: 0, min: p.minHoras, max: p.maxHoras };
        });

        alocacoesIniciais
            .filter(a => a.semestre === selectedSemester && a.professorId)
            .forEach(a => {
                const disciplina = disciplinas.find(d => d.id === a.disciplinaId);
                const professorId = a.professorId;
                if (disciplina && professorId && cargas[professorId]) {
                    cargas[professorId].carga += disciplina.cargaHoraria;
                }
            });
        return cargas;
    }, [selectedSemester, professoresDoDepto]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Professores e Carga Horária ({selectedSemester})</h1>
                <p className="text-muted-foreground">Acompanhe a carga horária alocada para os docentes do seu departamento.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Quadro de Docentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Docente</TableHead>
                                <TableHead>Área</TableHead>
                                <TableHead className="text-right">Carga Alocada</TableHead>
                                <TableHead className="w-[250px]">Ocupação da Carga Horária</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {professoresDoDepto.map(prof => {
                                const cargaData = professorCarga[prof.id];
                                const percentual = (cargaData.carga / cargaData.max) * 100;

                                return (
                                    <TableRow key={prof.id}>
                                        <TableCell className="font-medium">{prof.nome}</TableCell>
                                        <TableCell>{prof.areaId ? areas.find(a => a.id === prof.areaId)?.nome : 'N/A'}</TableCell>
                                        <TableCell className="text-right">{cargaData.carga}h / {cargaData.max}h</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={percentual} className="h-2" />
                                                <span className="text-xs font-mono text-muted-foreground">{percentual.toFixed(0)}%</span>
                                            </div>
                                            {cargaData.carga > cargaData.max && <p className="text-xs text-destructive mt-1">Carga máxima excedida.</p>}
                                            {cargaData.carga < cargaData.min && cargaData.carga > 0 && <p className="text-xs text-amber-500 mt-1">Abaixo da carga mínima.</p>}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
