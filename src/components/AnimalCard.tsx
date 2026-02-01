"use client";

import React, { useState } from 'react';
import { Animal } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomButton } from './CustomButton';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import AdoptionFormModal from './AdoptionFormModal';
import { ChevronLeft, ChevronRight, X, Gift } from 'lucide-react';

interface AnimalCardProps {
  animal: Animal;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal }) => {
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasImages = animal.images && animal.images.length > 0;
  const hasMultipleImages = hasImages && animal.images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!animal.images) return;
    setCurrentImageIndex((prev) => (prev + 1) % animal.images.length);
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!animal.images) return;
    setCurrentImageIndex((prev) => (prev - 1 + animal.images.length) % animal.images.length);
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
      <CardHeader className="p-0">
        <Dialog onOpenChange={(isOpen) => !isOpen && setCurrentImageIndex(0)}>
          <DialogTrigger asChild>
            <div className="aspect-w-16 aspect-h-9 cursor-pointer">
              {hasImages ? (
                <img src={animal.images[0]} alt={animal.name} className="object-cover w-full h-48" />
              ) : (
                <div className="object-cover w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">Nincs kép</div>
              )}
            </div>
          </DialogTrigger>
          {hasImages && (
            <DialogContent className="max-w-5xl w-full p-2 bg-transparent border-0 flex justify-center items-center">
              <div className="relative">
                <img src={animal.images[currentImageIndex]} alt={`${animal.name} - ${currentImageIndex + 1}`} className="max-h-[90vh] w-auto object-contain rounded-lg" />
                <DialogClose asChild>
                  <CustomButton variant="ghost" size="icon" className="absolute top-2 right-2 h-9 w-9 rounded-full bg-black/50 text-white hover:bg-black/70 z-50"><X className="h-5 w-5" /></CustomButton>
                </DialogClose>
                {hasMultipleImages && (
                  <>
                    <CustomButton variant="outline" size="icon" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-black/30 hover:bg-black/50 text-white" onClick={prevImage}><ChevronLeft /></CustomButton>
                    <CustomButton variant="outline" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 bg-black/30 hover:bg-black/50 text-white" onClick={nextImage}><ChevronRight /></CustomButton>
                  </>
                )}
              </div>
            </DialogContent>
          )}
        </Dialog>
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
                Munkánkat és védenceinket az alábbi módokon támogathatja. Köszönjük!
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
               <div className="p-4 rounded-lg border bg-slate-50 text-center">
                <h3 className="font-semibold flex items-center justify-center"><Gift className="mr-2 h-5 w-5 text-primary" /> Rendszeres támogatás</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">Állíts be ismétlődő utalást egyszerűen!</p>
                <CustomButton asChild size="sm">
                  <a href="https://adjukossze.hu/szervezet/pcas-pets-care-allatmento-es-kornyezetvedo-egyesulet-2783" target="_blank" rel="noopener noreferrer">
                    Támogatás az Adjukössze.hu-n
                  </a>
                </CustomButton>
              </div>
              <div>
                <h3 className="font-semibold">Banki átutalás</h3>
                <p><strong>Kedvezményezett:</strong> PCAS Állatmentő Egyesület</p>
                <p><strong>Számlaszám:</strong> 68800099-11083030-00000000</p>
              </div>
               <div>
                <h3 className="font-semibold">PayPal</h3>
                <p className="mb-2"><strong>Email:</strong> petscare2000@gmail.com</p>
                <CustomButton asChild size="sm" variant="outline">
                   <a href="https://www.paypal.com/donate/?business=petscare2000@gmail.com&no_recurring=0&currency_code=HUF" target="_blank" rel="noopener noreferrer">
                    Direkt támogatás PayPal-lel
                  </a>
                </CustomButton>
              </div>
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