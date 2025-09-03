'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mySubjects } from "../dashboard/data";
import DashboardLayout from '../dashboard/layout';
import { Book, Clock, Users } from 'lucide-react';

export default function MinhasMateriasPage() {
    return (
        <DashboardLayout>
            <div className="space-y-8">
                <h1 className="text-3xl font-bold">Minhas Matérias</h1>
                <p className="text-muted-foreground">Aqui estão as disciplinas que foram alocadas para você no semestre 2025.1.</p>

                {mySubjects.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {mySubjects.map((subject) => (
                            <Card key={subject.id}>
                                <CardHeader>
                                    <CardTitle>{subject.name}</CardTitle>
                                    <CardDescription>{subject.course}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span>Turma: {subject.class}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>Horário: {subject.schedule}</span>
                                    </div>
                                     <div className="flex items-center gap-2">
                                        <Book className="h-4 w-4 text-muted-foreground" />
                                        <span>Carga Horária: {subject.workload}h semanais</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="flex flex-col items-center justify-center p-12 text-center">
                        <CardHeader>
                            <CardTitle>Nenhuma matéria alocada</CardTitle>
                            <CardDescription>Ainda não há disciplinas alocadas para você neste semestre.</CardDescription>
                        </CardHeader>
                    </Card>
                )}
            </div>
        </DashboardLayout>
    );
}