'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from '@/components/ui/progress';
import { alocacoesIniciais, disciplinas, professores, departamentos, areas, Departamento } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/hooks/use-user';

export default function RelatoriosPage({ selectedSemester }: { selectedSemester: string }) {
    const { user } = useUser();
    
    // Mock: Diretor do Depto de Ciências Exatas
    const meuDepartamentoId = 'd01'; 
    const depto = departamentos.find(d => d.id === meuDepartamentoId) as Departamento;

    const [filterArea, setFilterArea] = React.useState('all');

    const professoresDoDepto = professores.filter(p => p.departamentoId === meuDepartamentoId);

    const alocacoesVisiveis = React.useMemo(() => {
        return professoresDoDepto
            .map(prof => {
                const disciplinasAlocadas = alocacoesIniciais
                    .filter(a => a.professorId === prof.id && a.semestre === selectedSemester)
                    .map(a => disciplinas.find(d => d.id === a.disciplinaId))
                    .filter((d): d is NonNullable<typeof d> => d !== undefined)
                    .filter(d => filterArea === 'all' || d.areaId === filterArea);

                const cargaTotal = disciplinasAlocadas.reduce((acc, d) => acc + d.cargaHoraria, 0);
                const cargaPercentual = (cargaTotal / prof.maxHoras) * 100;

                return {
                    professor: prof,
                    disciplinas: disciplinasAlocadas,
                    cargaTotal,
                    cargaPercentual,
                };
            })
            .filter(item => item.disciplinas.length > 0 || filterArea === 'all');

    }, [filterArea, professoresDoDepto, selectedSemester]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Relatórios do Departamento ({selectedSemester})</h1>
                <p className="text-muted-foreground">Análise detalhada da alocação de docentes e disciplinas.</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Alocação por Docente</CardTitle>
                    <div className="flex justify-between items-center">
                        <CardDescription>
                            Detalhamento da carga horária e disciplinas por docente do departamento.
                        </CardDescription>
                        {depto.areas && (
                            <Select value={filterArea} onValueChange={setFilterArea}>
                                <SelectTrigger className="w-[220px]">
                                    <SelectValue placeholder="Filtrar por Área" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as Áreas</SelectItem>
                                    {depto.areas.map(area => (
                                        <SelectItem key={area.id} value={area.id}>{area.nome}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Docente</TableHead>
                                <TableHead>Disciplinas Alocadas</TableHead>
                                <TableHead className="text-right">Carga Horária Total</TableHead>
                                <TableHead className="w-[200px]">Ocupação da Carga Máxima</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {alocacoesVisiveis.map(({ professor, disciplinas, cargaTotal, cargaPercentual }) => (
                                <TableRow key={professor.id}>
                                    <TableCell className="font-medium">
                                        {professor.nome}
                                        {professor.areaId && <p className="text-xs text-muted-foreground">{areas.find(a => a.id === professor.areaId)?.nome}</p>}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {disciplinas.length > 0 ? disciplinas.map(d => (
                                                <Badge key={d.id} variant="secondary">{d.codigo}</Badge>
                                            )) : <span className="text-xs text-muted-foreground">Nenhuma disciplina na área</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">{cargaTotal}h / {professor.maxHoras}h</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Progress value={cargaPercentual} className="h-2" />
                                            <span className="text-xs font-mono text-muted-foreground">{cargaPercentual.toFixed(0)}%</span>
                                        </div>
                                         {cargaTotal > professor.maxHoras && <p className="text-xs text-destructive mt-1">Carga horária máxima excedida.</p>}
                                         {cargaTotal < professor.minHoras && cargaTotal > 0 && <p className="text-xs text-amber-500 mt-1">Abaixo da carga mínima.</p>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     {alocacoesVisiveis.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                            Nenhum docente com alocação encontrada para os filtros selecionados.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
