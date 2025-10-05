'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

import { 
  disciplinas as initialDisciplinas, 
  departamentos, 
  areas,
  Departamento,
  Disciplina,
} from '@/lib/mock-data';

export default function CatalogoDisciplinasPage() {
    const [disciplinas, setDisciplinas] = React.useState<Disciplina[]>(initialDisciplinas);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingDisciplina, setEditingDisciplina] = React.useState<Disciplina | null>(null);

    // Mock: O diretor logado é de Ciências Exatas
    const meuDepartamentoId = 'd01'; 
    const meuDepto = departamentos.find(d => d.id === meuDepartamentoId);

    const handleAddOrEditDisciplina = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newDisciplinaData = {
            id: editingDisciplina?.id || `dis${Date.now()}`,
            codigo: formData.get('codigo') as string,
            nome: formData.get('nome') as string,
            cargaHoraria: Number(formData.get('cargaHoraria')),
            departamentoId: formData.get('departamentoId') as string,
            areaId: (formData.get('areaId') as string) || undefined,
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
        // Apenas para disciplinas do próprio departamento
        const disciplina = disciplinas.find(d => d.id === id);
        if (disciplina?.departamentoId === meuDepartamentoId) {
            setDisciplinas(disciplinas.filter(d => d.id !== id));
        }
    };
    
    const selectedDeptoForForm = departamentos.find(d => d.id === (document.querySelector('[name="departamentoId"]') as HTMLSelectElement)?.value)

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold">Catálogo de Disciplinas</h1>
                    <p className="text-muted-foreground">Adicione, edite e gerencie as disciplinas do seu departamento.</p>
                </div>
                <Button onClick={() => { setEditingDisciplina(null); setIsFormOpen(true); }}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Disciplina
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Disciplinas de {meuDepto?.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Disciplina</TableHead>
                                <TableHead>Área</TableHead>
                                <TableHead>Carga Horária</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {disciplinas.filter(d => d.departamentoId === meuDepartamentoId).map((d) => {
                                const area = d.areaId ? areas.find(a => a.id === d.areaId) : null;
                                return (
                                    <TableRow key={d.id}>
                                        <TableCell className="font-mono">{d.codigo}</TableCell>
                                        <TableCell className="font-medium">{d.nome}</TableCell>
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
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingDisciplina ? 'Editar' : 'Adicionar'} Disciplina</DialogTitle>
                        <DialogDescription>
                           Preencha as informações da disciplina. O código é único e não pode ser alterado após a criação.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddOrEditDisciplina} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="codigo">Código</Label>
                            <Input id="codigo" name="codigo" required defaultValue={editingDisciplina?.codigo} disabled={!!editingDisciplina}/>
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
                                <Select name="departamentoId" required defaultValue={editingDisciplina?.departamentoId || meuDepartamentoId} disabled>
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
                                  <SelectTrigger disabled={!meuDepto?.areas}>
                                      <SelectValue placeholder="Selecione a área" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="">Nenhuma</SelectItem>
                                      {meuDepto?.areas?.map(area => (
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
        </div>
    );
}
