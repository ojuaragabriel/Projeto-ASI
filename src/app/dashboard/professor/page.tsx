'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { professorPreferences } from "../data";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';

export default function ProfessorPreferencesPage() {
    const [selected, setSelected] = React.useState<string[]>([]);
    const { toast } = useToast();

    const handleSelect = (id: string) => {
        setSelected(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        toast({
            title: "Preferências Enviadas",
            description: `Você manifestou interesse em ${selected.length} disciplina(s).`,
            className: "bg-green-100 dark:bg-green-900 border-green-400",
        });
        setSelected([]);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Manifestação de Preferências</h1>
                <p className="text-muted-foreground">Selecione as disciplinas que você tem interesse em lecionar no próximo semestre (2025.1).</p>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Disciplinas Disponíveis</CardTitle>
                    <CardDescription>Marque as caixas de seleção para indicar seu interesse.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {professorPreferences.map((pref) => (
                        <div key={pref.id} 
                             className={`p-4 rounded-lg border transition-all ${selected.includes(pref.id) ? 'border-primary bg-primary/5' : ''}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Checkbox 
                                        id={pref.id}
                                        checked={selected.includes(pref.id)}
                                        onCheckedChange={() => handleSelect(pref.id)}
                                        className="h-5 w-5"
                                    />
                                    <Label htmlFor={pref.id} className="flex-grow cursor-pointer">
                                        <p className="font-semibold text-base">{pref.name}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{pref.course}</span>
                                            &middot;
                                            <span>{pref.workload}h semanais</span>
                                        </div>
                                    </Label>
                                </div>
                                {selected.includes(pref.id) && <Star className="h-5 w-5 text-amber-500 fill-current" />}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Justificativa (Opcional)</CardTitle>
                    <CardDescription>Se desejar, adicione uma justificativa para suas escolhas (ex: projeto de pesquisa na área).</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea placeholder="Sua justificativa aqui..." />
                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Button size="lg" onClick={handleSubmit} disabled={selected.length === 0}>
                    Enviar Preferências ({selected.length})
                </Button>
            </div>
        </div>
    );
}
