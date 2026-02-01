"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { List, Edit3, Trash2, MoreVertical } from "lucide-react";
import { Animal, AnimalStatus } from "../types";
import { CustomButton } from "./CustomButton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AnimalListProps {
  animals: Animal[];
  onEdit: (animal: Animal) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: AnimalStatus) => void;
}

const StatusActions = ({ animal, onStatusChange }: { animal: Animal, onStatusChange: AnimalListProps['onStatusChange'] }) => {
  const statuses: AnimalStatus[] = ['Gazdira vár', 'Lefoglalva', 'Gazdára talált'];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CustomButton variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></CustomButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Státusz váltása</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {statuses.filter(s => s !== animal.status).map(status => (
          <DropdownMenuItem key={status} onClick={() => onStatusChange(animal.id, status)}>
            {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const AnimalList: React.FC<AnimalListProps> = ({ animals, onEdit, onDelete, onStatusChange }) => {
  const getStatusBadge = (status: AnimalStatus) => {
    const variants: { [key in AnimalStatus]: string } = {
      'Gazdira vár': 'bg-green-500 text-white',
      'Lefoglalva': 'bg-yellow-500 text-white',
      'Gazdára talált': 'bg-gray-800 text-white',
    };
    return <Badge variant="default" className={variants[status]}>{status}</Badge>;
  };

  return (
    <Card className="mt-8 rounded-xl shadow-md border border-border">
      <CardHeader><CardTitle className="flex items-center text-2xl"><List className="mr-2 h-6 w-6 text-primary" />Örökbefogadható állatok</CardTitle></CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Név</TableHead>
                <TableHead>Státusz</TableHead>
                <TableHead>Nem</TableHead>
                <TableHead>Méret</TableHead>
                <TableHead>Kor</TableHead>
                <TableHead className="text-right">Műveletek</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {animals.length > 0 ? (
                animals.map((animal) => (
                  <TableRow key={animal.id}>
                    <TableCell className="font-medium">{animal.name}</TableCell>
                    <TableCell>{getStatusBadge(animal.status)}</TableCell>
                    <TableCell>{animal.gender}</TableCell>
                    <TableCell>{animal.size}</TableCell>
                    <TableCell>{animal.age_category}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <StatusActions animal={animal} onStatusChange={onStatusChange} />
                        <CustomButton variant="ghost" size="icon" onClick={() => onEdit(animal)}><Edit3 className="h-4 w-4 text-blue-600" /></CustomButton>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><CustomButton variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-600" /></CustomButton></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Biztosan törli ezt az állatot?</AlertDialogTitle><AlertDialogDescription>A(z) "{animal.name}" nevű állat adatai véglegesen törlődnek.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Mégse</AlertDialogCancel><AlertDialogAction onClick={() => onDelete(animal.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Törlés</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={6} className="h-24 text-center">Nincsenek rögzített állatok.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};