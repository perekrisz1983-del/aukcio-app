"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CustomButton } from "@/components/CustomButton";
import { PlusCircle, Upload, X } from "lucide-react";
import { Animal } from "../types";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from 'uuid';
import { showError, showSuccess } from "@/utils/toast";

export const animalFormSchema = z.object({
  name: z.string().min(2, "A névnek legalább 2 karakter hosszúnak kell lennie."),
  description: z.string().min(10, "A leírásnak legalább 10 karakter hosszúnak kell lennie."),
  gender: z.enum(['Kan', 'Szuka'], { required_error: "Kérjük, válassza ki a nemét." }),
  size: z.enum(['Kicsi', 'Közepes', 'Nagy'], { required_error: "Kérjük, válassza ki a méretét." }),
  age_category: z.enum(['Kölyök (0-1 év)', 'Felnőtt (1-8 év)', 'Idős (8+ év)'], { required_error: "Kérjük, válassza ki a korosztályt." }),
  images: z.array(z.string()).min(1, "Legalább egy kép feltöltése kötelező."),
});

interface AnimalFormProps {
  onSave: (data: z.infer<typeof animalFormSchema>) => void;
  editingAnimal: Animal | null;
  onCancelEdit: () => void;
}

export const AnimalForm: React.FC<AnimalFormProps> = ({ onSave, editingAnimal, onCancelEdit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof animalFormSchema>>({
    resolver: zodResolver(animalFormSchema),
    defaultValues: {
      name: "", description: "", gender: undefined, size: undefined, age_category: undefined, images: [],
    },
  });

  useEffect(() => {
    if (editingAnimal) {
      form.reset({
        ...editingAnimal,
        images: editingAnimal.images || [],
      });
    } else {
      form.reset({
        name: "", description: "", gender: undefined, size: undefined, age_category: undefined, images: [],
      });
    }
  }, [editingAnimal, form]);

  const images = form.watch("images");

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const currentImages = form.getValues("images");
    const uploadPromises = Array.from(files).map(async (file) => {
      const fileName = `${uuidv4()}-${file.name}`;
      const { error } = await supabase.storage.from('animal-images').upload(fileName, file);
      if (error) {
        throw new Error(`Képfeltöltési hiba: ${error.message}`);
      }
      const { data } = supabase.storage.from('animal-images').getPublicUrl(fileName);
      return data.publicUrl;
    });

    try {
      const newImageUrls = await Promise.all(uploadPromises);
      form.setValue("images", [...currentImages, ...newImageUrls], { shouldValidate: true });
      showSuccess(`${files.length} kép sikeresen feltöltve!`);
    } catch (error: any) {
      showError(error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = async (indexToRemove: number) => {
    const currentImages = form.getValues("images");
    const imageUrlToRemove = currentImages[indexToRemove];
    const fileName = imageUrlToRemove.split('/').pop();

    if (fileName) {
      const { error } = await supabase.storage.from('animal-images').remove([fileName]);
      if (error) {
        showError(`Hiba a kép törlésekor a tárhelyről: ${error.message}`);
      }
    }

    form.setValue("images", currentImages.filter((_, index) => index !== indexToRemove), { shouldValidate: true });
  };

  return (
    <Card className="rounded-xl shadow-md border border-border">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <PlusCircle className="mr-2 h-6 w-6 text-primary" />
          {editingAnimal ? 'Állat adatainak szerkesztése' : 'Új állat hozzáadása'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Név</FormLabel>
                <FormControl><Input placeholder="Pl. Morzsi" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Leírás</FormLabel>
                <FormControl><Textarea placeholder="Részletes leírás az állatról..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField control={form.control} name="gender" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nem</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Válasszon..." /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="Kan">Kan</SelectItem><SelectItem value="Szuka">Szuka</SelectItem></SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="size" render={({ field }) => (
                <FormItem>
                  <FormLabel>Méret</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Válasszon..." /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="Kicsi">Kicsi</SelectItem><SelectItem value="Közepes">Közepes</SelectItem><SelectItem value="Nagy">Nagy</SelectItem></SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="age_category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Korosztály</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Válasszon..." /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Kölyök (0-1 év)">Kölyök (0-1 év)</SelectItem>
                      <SelectItem value="Felnőtt (1-8 év)">Felnőtt (1-8 év)</SelectItem>
                      <SelectItem value="Idős (8+ év)">Idős (8+ év)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="images" render={() => (
              <FormItem>
                <FormLabel>Képek feltöltése</FormLabel>
                <FormControl>
                  <div>
                    <Input type="file" accept="image/png, image/jpeg, image/webp" className="hidden" ref={fileInputRef} onChange={handleImageUpload} disabled={isUploading} multiple />
                    <CustomButton type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                      <Upload className="mr-2 h-4 w-4" /> {isUploading ? 'Feltöltés...' : 'Képek kiválasztása'}
                    </CustomButton>
                  </div>
                </FormControl>
                <FormMessage />
                {images && images.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {images.map((url, index) => (
                      <div key={index} className="relative h-32 w-32 rounded-lg border p-1">
                        <img src={url} alt={`Előnézet ${index + 1}`} className="object-contain w-full h-full" />
                        <CustomButton type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => handleRemoveImage(index)}><X className="h-4 w-4" /></CustomButton>
                      </div>
                    ))}
                  </div>
                )}
              </FormItem>
            )} />
            <div className="flex items-center gap-4">
              <CustomButton type="submit" className="w-full md:w-auto" disabled={isUploading}>
                {editingAnimal ? 'Módosítás mentése' : 'Állat mentése'}
              </CustomButton>
              {editingAnimal && (
                <CustomButton type="button" variant="outline" onClick={onCancelEdit}>Mégse</CustomButton>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};