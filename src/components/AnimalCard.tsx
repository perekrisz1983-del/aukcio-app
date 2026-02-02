"use client";

import React, { useState } from 'react';
import { Animal } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CustomButton } from './CustomButton';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import AdoptionFormModal from './AdoptionFormModal';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        <CustomButton asChild variant="outline">
          <Link to="/support">Támogatás</Link>
        </CustomButton>
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