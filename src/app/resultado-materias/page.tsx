'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { allocationResults } from "../dashboard/data";
import DashboardLayout from '../dashboard/layout';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function ResultadoMateriasPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <h1 className="text-3xl font-bold">Resultado da Alocação de Matérias</h1>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Semestre 2025.1</CardTitle>
                        <CardDescription>Visualize o resultado final da alocação de professores para as disciplinas.</CardDescription>
                        <div className="flex items-center space-x-2 pt-4">
                            <Input placeholder="Filtrar por disciplina..." className="max-w-sm" />
                            <Select>
                                <SelectTrigger className="w-[220px]">
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os status</SelectItem>
                                    <SelectItem value="allocated">Alocado</SelectItem>
                                    <SelectItem value="not-allocated">Não alocado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Disciplina</TableHead>
                                    <TableHead>Professor Alocado</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allocationResults.map((result) => (
                                    <TableRow key={result.id} className={cn(result.status === 'Alocado para você' && 'bg-primary/10 hover:bg-primary/20')}>
                                        <TableCell className="font-medium">{result.name}</TableCell>
                                        <TableCell>{result.professor || <span className="text-muted-foreground">Ninguém</span>}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={
                                                result.status === 'Alocado' ? 'secondary' :
                                                result.status === 'Alocado para você' ? 'default' :
                                                'outline'
                                            }>
                                                {result.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}