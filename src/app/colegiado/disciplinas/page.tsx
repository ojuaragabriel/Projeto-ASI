'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { 
  disciplinas as initialDisciplinas, 
  departamentos as allDepartamentos,
  areas as allAreas,
  Disciplina,
} from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import groupBy from 'lodash/groupBy';

export default function DisciplinasColegiadoPage() {
    const [disciplinas, setDisciplinas] = React.useState<Disciplina[]>(initialDisciplinas);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filterDepto, setFilterDepto] = React.useState('all');
    const [filterArea, setFilterArea] = React.useState('all');

    const departamentos = allDepartamentos;
    const areas = allAreas;

    const filteredDisciplinas = React.useMemo(() => {
        return disciplinas
            .filter(d => d.nome.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(d => filterDepto === 'all' || d.departamentoId === filterDepto)
            .filter(d => {
                if (filterDepto === 'all' || filterArea === 'all') return true;
                const depto = departamentos.find(dep => dep.id === filterDepto);
                if (!depto?.areas) return true;
                return d.areaId === filterArea;
            });
    }, [disciplinas, searchTerm, filterDepto, filterArea]);

    const groupedDisciplinas = React.useMemo(() => {
        return groupBy(filteredDisciplinas, 'departamentoId');
    }, [filteredDisciplinas]);

    const handleAreaFilterChange = (areaId: string) => {
        setFilterArea(areaId);
    };

    React.useEffect(() => {
        setFilterArea('all');
    }, [filterDepto]);


    return (
        <TooltipProvider>
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">Disciplinas por Departamento</h1>
                        <p className="text-muted-foreground">Visualize todas as disciplinas da instituição, agrupadas por departamento.</p>
                    </div>
                     <Tooltip>
                        <TooltipTrigger asChild>
                           <span tabIndex={0}>
                                <Button disabled>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Nova Disciplina
                                </Button>
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>A criação de disciplinas é feita pelo Departamento.</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                        <div className="flex items-center space-x-2 pt-4">
                            <Input 
                                placeholder="Filtrar por nome..." 
                                className="max-w-sm" 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                            <Select value={filterDepto} onValueChange={setFilterDepto}>
                                <SelectTrigger className="w-[300px]">
                                    <SelectValue placeholder="Filtrar por departamento" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos os Departamentos</SelectItem>
                                    {departamentos.map(depto => (
                                        <SelectItem key={depto.id} value={depto.id}>{depto.nome}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {departamentos.find(d => d.id === filterDepto)?.areas && (
                                 <Select value={filterArea} onValueChange={handleAreaFilterChange}>
                                    <SelectTrigger className="w-[220px]">
                                        <SelectValue placeholder="Filtrar por Área" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas as Áreas</SelectItem>
                                        {departamentos.find(d => d.id === filterDepto)?.areas?.map(area => (
                                            <SelectItem key={area.id} value={area.id}>{area.nome}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {Object.entries(groupedDisciplinas).map(([deptoId, deptoDisciplinas]) => {
                                const depto = departamentos.find(d => d.id === deptoId);
                                if (!depto) return null;
                                
                                return (
                                    <div key={deptoId}>
                                        <h3 className="text-xl font-semibold mb-2">{depto.nome}</h3>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Código</TableHead>
                                                    <TableHead>Disciplina</TableHead>
                                                    <TableHead>Área</TableHead>
                                                    <TableHead>Carga Horária</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {deptoDisciplinas.map((d) => (
                                                    <TableRow key={d.id}>
                                                        <TableCell className="font-mono">{d.codigo}</TableCell>
                                                        <TableCell className="font-medium">{d.nome}</TableCell>
                                                        <TableCell>
                                                            {d.areaId ? areas.find(a => a.id === d.areaId)?.nome : 'N/A'}
                                                        </TableCell>
                                                        <TableCell>{d.cargaHoraria}h</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )
                            })}
                             {filteredDisciplinas.length === 0 && (
                                <div className="text-center py-10 text-muted-foreground">
                                    Nenhuma disciplina encontrada para os filtros selecionados.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TooltipProvider>
    );
}
