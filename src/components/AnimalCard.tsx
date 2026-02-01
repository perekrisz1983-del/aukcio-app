"use client";

import React, { useState } from 'react';
import { Animal } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomButton } from './CustomButton';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import AdoptionFormModal from './AdoptionFormModal';

interface AnimalCardProps {
  animal: Animal;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal }) => {
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false);

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
      <CardHeader className="p-0">
        <div className="aspect-w-16 aspect-h-9">
          <img src={animal.image_url} alt={animal.name} className="object-cover w-full h-48" />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-2xl font-bold mb-2">{animal.name}</CardTitle>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">{animal.gender}</Badge>
          <Badge variant="secondary">{animal.size}</Badge>
          <Badge variant="secondary">{animal.age_category}</Badge>
        </div>
        <p className="text-muted-foreground text-sm">{animal.description}</p>
      </CardContent>
      <CardFooter className="p-4 bg-gray-50/50 grid grid-cols-2 gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <CustomButton variant="outline">Támogatni szeretném</CustomButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Támogatás</DialogTitle>
              <DialogDescription>
                Munkánkat és védenceinket az alábbi számlaszámon támogathatja. Köszönjük!
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p><strong>Név:</strong> PCAS Alapítvány</p>
              <p><strong>Bankszámlaszám:</strong> 12345678-12345678-12345678</p>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={isAdoptionModalOpen} onOpenChange={setIsAdoptionModalOpen}>
          <DialogTrigger asChild>
            <CustomButton>Örökbefogadás</CustomButton>
          </DialogTrigger>
          <AdoptionFormModal animal={animal} onClose={() => setIsAdoptionModalOpen(false)} />
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default AnimalCard;