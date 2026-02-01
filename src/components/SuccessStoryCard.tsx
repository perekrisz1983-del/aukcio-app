"use client";

import React from 'react';
import { Animal } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';

interface SuccessStoryCardProps {
  animal: Animal;
}

const SuccessStoryCard: React.FC<SuccessStoryCardProps> = ({ animal }) => {
  const hasImages = animal.images && animal.images.length > 0;

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105">
      <CardHeader className="p-0 relative">
        <div className="aspect-w-16 aspect-h-9">
          {hasImages ? (
            <img src={animal.images[0]} alt={animal.name} className="object-cover w-full h-48" />
          ) : (
            <div className="object-cover w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">Nincs kép</div>
          )}
        </div>
        <Badge className="absolute top-2 right-2 bg-green-600 text-white text-sm py-1 px-3">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          Gazdára talált!
        </Badge>
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
      <CardFooter className="p-4 bg-gray-50/50">
        <p className="text-sm text-center w-full text-gray-600">
          Ő már szerető otthonra lelt. Köszönjük a támogatást!
        </p>
      </CardFooter>
    </Card>
  );
};

export default SuccessStoryCard;