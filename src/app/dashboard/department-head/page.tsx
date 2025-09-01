'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, History, Star } from "lucide-react";
import { departmentAllocations, professors } from "../data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from '@/hooks/use-toast';

type AllocationState = {
    [key: string]: {
        professor: string;
        workload: string;
    };
};

export default function DepartmentHeadPage() {
    const [allocations, setAllocations] = React.useState<AllocationState>({});
    const { toast } = useToast();

    const handleProfessorSelect = (disciplineId: string, professorName: string) => {
        const workload = Math.random() > 0.5 ? '20/40h' : '12/40h'; // Mock workload
        setAllocations(prev => ({
            ...prev,
            [disciplineId]: { professor: professorName, workload },
        }));
    };

    const handleSave = () => {
        toast({
            title: "Alocação Salva",
            description: "As alocações de professores foram enviadas para revisão do coordenador.",
            className: "bg-green-100 dark:bg-green-900 border-green-400",
        });
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Alocação do Chefe de Departamento</h1>
            <TooltipProvider>
                <Card>
                    <CardHeader>
                        <CardTitle>Alocação de Disciplinas</CardTitle>
                        <CardDescription>Atribua professores do seu departamento às disciplinas solicitadas.</CardDescription>
                        <div className="flex items-center space-x-2 pt-4">
                            <Select defaultValue="cs">
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Filtrar por curso" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cs">Ciência da Computação</SelectItem>
                                    <SelectItem value="phy">Física</SelectItem>
                                    <SelectItem value="math">Matemática</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Curso</TableHead>
                                    <TableHead>Disciplina</TableHead>
                                    <TableHead>Professor Alocado</TableHead>
                                    <TableHead className="text-center">C.H. Disciplina</TableHead>
                                    <TableHead className="text-center">C.H. Professor</TableHead>
                                    <TableHead className="text-center">Apoio</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {departmentAllocations.map((alloc) => (
                                    <TableRow key={alloc.id}>
                                        <TableCell>{alloc.course}</TableCell>
                                        <TableCell className="font-medium">{alloc.discipline}</TableCell>
                                        <TableCell>
                                            <Select onValueChange={(value) => handleProfessorSelect(alloc.id, value)}>
                                                <SelectTrigger className="w-[220px]">
                                                    <SelectValue placeholder="Selecione um docente" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Docentes do Departamento</SelectLabel>
                                                        {professors.map(p => (
                                                            <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="text-center">{alloc.workload}h</TableCell>
                                        <TableCell className="text-center font-mono">
                                            {allocations[alloc.id]?.workload || '-'}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-3">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-amber-500" disabled={alloc.preferences.length === 0}>
                                                            <Star className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="font-semibold">Preferências Manifestadas:</p>
                                                        {alloc.preferences.length > 0 ? (
                                                           alloc.preferences.map(p => <p key={p}>{p}</p>)
                                                        ) : <p>Nenhuma</p>}
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={alloc.history.length === 0}>
                                                            <History className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="font-semibold">Lecionou anteriormente:</p>
                                                         {alloc.history.length > 0 ? (
                                                           alloc.history.map(p => <p key={p}>{p}</p>)
                                                        ) : <p>Nenhum</p>}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </TooltipProvider>
            <div className="flex justify-end">
                <Button size="lg" onClick={handleSave}>Salvar Alocação</Button>
            </div>
        </div>
    );
}
