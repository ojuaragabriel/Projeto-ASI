'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Users, Book, CheckCircle, Percent } from 'lucide-react';
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { alocacoesIniciais, disciplinas, professores, departamentos } from '@/lib/mock-data';
import DashboardLayout from '../dashboard/layout';

const KpiCard = ({ title, value, icon: Icon, description }: { title: string, value: string, icon: React.ElementType, description: string }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
);

export default function DepartamentoPage() {
    const meuDepartamentoId = 'd01'; // Mock: Diretor do Depto de Ciências Exatas
    
    const disciplinasDoDepto = disciplinas.filter(d => d.departamentoId === meuDepartamentoId);
    const professoresDoDepto = professores.filter(p => p.departamentoId === meuDepartamentoId);
    const alocacoesDoSemestre = alocacoesIniciais.filter(a => a.semestre === '2025.1');
    
    const disciplinasAlocadas = alocacoesDoSemestre.filter(a => 
        disciplinasDoDepto.some(d => d.id === a.disciplinaId) && a.professorId
    ).length;

    const taxaAlocacao = disciplinasDoDepto.length > 0
        ? ((disciplinasAlocadas / disciplinasDoDepto.length) * 100).toFixed(0)
        : '0';

    const cargaHorariaPorProfessor = professoresDoDepto.map(prof => {
        const carga = alocacoesDoSemestre
            .filter(a => a.professorId === prof.id)
            .reduce((acc, a) => {
                const disciplina = disciplinas.find(d => d.id === a.disciplinaId);
                return acc + (disciplina?.cargaHoraria || 0);
            }, 0);
        return { name: prof.nome.split(' ').slice(1).join(' '), carga, maxHoras: prof.maxHoras };
    });

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard do Departamento</h1>
                    <p className="text-muted-foreground">
                        Visão geral e KPIs para o {departamentos.find(d => d.id === meuDepartamentoId)?.nome}.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <KpiCard 
                        title="Total de Disciplinas" 
                        value={disciplinasDoDepto.length.toString()} 
                        icon={Book}
                        description="Disciplinas sob responsabilidade do depto."
                    />
                    <KpiCard 
                        title="Total de Docentes" 
                        value={professoresDoDepto.length.toString()} 
                        icon={Users}
                        description="Docentes vinculados ao departamento."
                    />
                    <KpiCard 
                        title="Disciplinas Alocadas" 
                        value={disciplinasAlocadas.toString()} 
                        icon={CheckCircle}
                        description="Com professores atribuídos para 2025.1"
                    />
                    <KpiCard 
                        title="Taxa de Alocação" 
                        value={`${taxaAlocacao}%`}
                        icon={Percent}
                        description="Percentual de disciplinas alocadas."
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Carga Horária por Docente (2025.1)</CardTitle>
                        <CardDescription>Visualização da carga horária alocada vs. limite máximo.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={cargaHorariaPorProfessor}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}h`}
                                />
                                <Tooltip 
                                    cursor={{fill: 'hsl(var(--secondary))'}}
                                    contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}
                                />
                                <Legend />
                                <Bar dataKey="carga" name="Carga Alocada" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="maxHoras" name="Carga Máxima" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
                            </RechartsBarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
