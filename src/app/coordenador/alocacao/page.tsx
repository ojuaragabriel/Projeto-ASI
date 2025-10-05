'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

import { 
  alocacoesIniciais,
  disciplinas as allDisciplinas,
  professores as allProfessores,
  Alocacao,
  Disciplina,
  Professor
} from '@/lib/mock-data';
import DashboardLayout from '../layout';

export default function AlocacaoPage({ selectedSemester }: { selectedSemester: string }) {
    const [alocacoes, setAlocacoes] = React.useState<Alocacao[]>(alocacoesIniciais);
    const { toast } = useToast();

    const handleAlocacaoChange = (disciplinaId: string, professorId: string | null) => {
        setAlocacoes(prev => {
            const existingAlocacao = prev.find(a => a.disciplinaId === disciplinaId && a.semestre === selectedSemester);
            if (existingAlocacao) {
                return prev.map(a => 
                    a.disciplinaId === disciplinaId && a.semestre === selectedSemester
                    ? { ...a, professorId, status: professorId ? 'alocada' : 'ofertada' }
                    : a
                );
            }
            // Should not happen in this UI, as we only edit existing allocations for the semester
            return prev;
        });
    };

    const handleSaveChanges = () => {
        // In a real app, this would be a server action.
        console.log("Saving new allocations:", alocacoes.filter(o => o.semestre === selectedSemester));
        toast({
            title: 'Alocação Salva!',
            description: `As alocações para o semestre ${selectedSemester} foram atualizadas.`,
        });
    };

    const professorCarga = React.useMemo(() => {
        const cargas: { [key: string]: { carga: number, min: number, max: number } } = {};
        allProfessores.forEach(p => {
            cargas[p.id] = { carga: 0, min: p.minHoras, max: p.maxHoras };
        });

        alocacoes
            .filter(a => a.semestre === selectedSemester && a.professorId)
            .forEach(a => {
                const disciplina = allDisciplinas.find(d => d.id === a.disciplinaId);
                if (disciplina && a.professorId && cargas[a.professorId]) {
                    cargas[a.professorId].carga += disciplina.cargaHoraria;
                }
            });
        return cargas;
    }, [alocacoes, selectedSemester]);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">Alocação de Professores ({selectedSemester})</h1>
                        <p className="text-muted-foreground">Atribua professores às disciplinas ofertadas.</p>
                    </div>
                    <Button onClick={handleSaveChanges}>Salvar Alocações</Button>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Alocação de Disciplinas</CardTitle>
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
                                    {allDisciplinas.map(d => {
                                        const alocacao = alocacoes.find(a => a.disciplinaId === d.id && a.semestre === selectedSemester);
                                        const status = alocacao ? (alocacao.professorId ? 'alocada' : 'ofertada') : 'nao-ofertada';
                                        
                                        if (status === 'nao-ofertada') return null;

                                        return (
                                            <TableRow key={d.id}>
                                                <TableCell className="font-medium">{d.nome} ({d.codigo})</TableCell>
                                                <TableCell>
                                                    <Select 
                                                        value={alocacao?.professorId || 'null'}
                                                        onValueChange={(profId) => handleAlocacaoChange(d.id, profId === 'null' ? null : profId)}
                                                    >
                                                        <SelectTrigger className="w-[250px]">
                                                            <SelectValue placeholder="Selecione um professor" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="null">Ninguém (Apenas Ofertada)</SelectItem>
                                                            {allProfessores.map(p => (
                                                                <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={status === 'alocada' ? 'default' : 'secondary'}>
                                                        {status === 'alocada' ? 'Alocada' : 'Ofertada'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Carga Horária dos Professores</CardTitle>
                            <CardDescription>Acompanhe a carga horária em tempo real.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {allProfessores.map(p => {
                                const carga = professorCarga[p.id];
                                const percentual = (carga.carga / carga.max) * 100;
                                const isOverloaded = carga.carga > carga.max;
                                const isUnderloaded = carga.carga < carga.min && carga.carga > 0;

                                return (
                                    <div key={p.id}>
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
                </div>
            </div>
        </DashboardLayout>
    );
}
