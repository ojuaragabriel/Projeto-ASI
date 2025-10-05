'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { 
  disciplinas as initialDisciplinas, 
  departamentos, 
  areas,
  cursos,
  Departamento,
  Disciplina,
  Professor,
  Alocacao,
} from '@/lib/mock-data';
import DashboardLayout from '../layout';
import { cn } from '@/lib/utils';

export default function CoordenadorDisciplinasPage() {
    const [disciplinas, setDisciplinas] = React.useState<Disciplina[]>(initialDisciplinas);
    
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filterDepto, setFilterDepto] = React.useState('all');
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingDisciplina, setEditingDisciplina] = React.useState<Disciplina | null>(null);

    // Mock: O coordenador logado é de Engenharia de Computação
    const meuCurso = cursos.find(c => c.id === 'cur01'); 

    const handleAddOrEditDisciplina = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newDisciplinaData = {
            id: editingDisciplina?.id || `dis${Date.now()}`,
            codigo: formData.get('codigo') as string,
            nome: formData.get('nome') as string,
            cargaHoraria: Number(formData.get('cargaHoraria')),
            departamentoId: formData.get('departamentoId') as string,
            areaId: formData.get('areaId') as string | undefined,
        };

        if (editingDisciplina) {
            setDisciplinas(disciplinas.map(d => d.id === newDisciplinaData.id ? newDisciplinaData : d));
        } else {
            setDisciplinas([...disciplinas, newDisciplinaData]);
        }
        setIsFormOpen(false);
        setEditingDisciplina(null);
    };

    const openEditForm = (disciplina: Disciplina) => {
      setEditingDisciplina(disciplina);
      setIsFormOpen(true);
    };

    const handleDeleteDisciplina = (id: string) => {
        setDisciplinas(disciplinas.filter(d => d.id !== id));
    };

    const disciplinasVisiveis = React.useMemo(() => {
        return disciplinas
            .filter(d => d.nome.toLowerCase().includes(searchTerm.toLowerCase()))
            .filter(d => filterDepto === 'all' || d.departamentoId === filterDepto);
    }, [disciplinas, searchTerm, filterDepto]);

    return (
        <DashboardLayout>
             <TooltipProvider>
            <div className="space-y-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">Gerenciamento de Disciplinas</h1>
                        <p className="text-muted-foreground">Adicione, edite e gerencie as disciplinas da instituição.</p>
                    </div>
                    <Button onClick={() => { setEditingDisciplina(null); setIsFormOpen(true); }}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nova Matéria
                    </Button>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Disciplinas</CardTitle>
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
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Disciplina</TableHead>
                                    <TableHead>Departamento</TableHead>
                                    <TableHead>Área</TableHead>
                                    <TableHead>Carga Horária</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {disciplinasVisiveis.map((d) => {
                                    const depto = departamentos.find(dep => dep.id === d.departamentoId);
                                    const area = d.areaId ? areas.find(a => a.id === d.areaId) : null;
                                    return (
                                        <TableRow key={d.id}>
                                            <TableCell className="font-mono">{d.codigo}</TableCell>
                                            <TableCell className="font-medium">{d.nome}</TableCell>
                                            <TableCell>
                                                {depto?.nome || 'N/A'}
                                                { depto?.id !== meuCurso?.departamentoId &&
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Badge variant="outline" className="ml-2">Depto. de Origem</Badge>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Esta disciplina não pertence ao departamento principal do seu curso.</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                }
                                            </TableCell>
                                            <TableCell>{area?.nome || <span className="text-muted-foreground">N/A</span>}</TableCell>
                                            <TableCell>{d.cargaHoraria}h</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent>
                                                        <DropdownMenuItem onClick={() => openEditForm(d)}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteDisciplina(d.id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Remover
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                         {disciplinasVisiveis.length === 0 && (
                            <div className="text-center py-10 text-muted-foreground">
                                Nenhuma disciplina encontrada.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            </TooltipProvider>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingDisciplina ? 'Editar' : 'Adicionar'} Disciplina</DialogTitle>
                        <DialogDescription>
                           Preencha as informações da disciplina.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddOrEditDisciplina} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="codigo">Código</Label>
                            <Input id="codigo" name="codigo" required defaultValue={editingDisciplina?.codigo} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nome">Nome da Disciplina</Label>
                            <Input id="nome" name="nome" required defaultValue={editingDisciplina?.nome}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cargaHoraria">Carga Horária Semanal</Label>
                            <Input id="cargaHoraria" name="cargaHoraria" type="number" required defaultValue={editingDisciplina?.cargaHoraria}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label htmlFor="departamentoId">Departamento</Label>
                              <Select name="departamentoId" required defaultValue={editingDisciplina?.departamentoId}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Selecione o departamento" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      {departamentos.map(depto => (
                                          <SelectItem key={depto.id} value={depto.id}>{depto.nome}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>
                           <div className="space-y-2">
                              <Label htmlFor="areaId">Área (opcional)</Label>
                              <Select name="areaId" defaultValue={editingDisciplina?.areaId}>
                                  <SelectTrigger>
                                      <SelectValue placeholder="Selecione a área" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="">Nenhuma</SelectItem>
                                      {areas.map(area => (
                                          <SelectItem key={area.id} value={area.id}>{area.nome}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
                            <Button type="submit">Salvar</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    );
}
