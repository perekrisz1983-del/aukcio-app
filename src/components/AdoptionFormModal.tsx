"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CustomButton } from '@/components/CustomButton';
import { showError, showSuccess } from '@/utils/toast';
import { Animal } from '@/types';

const adoptionSchema = z.object({
  fullName: z.string().min(3, 'A név megadása kötelező.'),
  email: z.string().email('Érvénytelen email cím.'),
  phone: z.string().min(8, 'Érvényes telefonszám megadása kötelező.'),
  message: z.string().min(10, 'Kérjük, írjon egy rövid bemutatkozást (min. 10 karakter).'),
});

interface AdoptionFormModalProps {
  animal: Animal;
  onClose: () => void;
}

const AdoptionFormModal: React.FC<AdoptionFormModalProps> = ({ animal, onClose }) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof adoptionSchema>>({
    resolver: zodResolver(adoptionSchema),
    defaultValues: { fullName: '', email: '', phone: '', message: '' },
  });

  const onSubmit = async (values: z.infer<typeof adoptionSchema>) => {
    setLoading(true);
    try {
      const response = await fetch('/api/send-adoption-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, animalName: animal.name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Hiba történt a küldés során.');
      }

      showSuccess('Jelentkezését sikeresen elküldtük! Hamarosan felvesszük Önnel a kapcsolatot.');
      onClose();
    } catch (error: any) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Örökbefogadás: {animal.name}</DialogTitle>
        <DialogDescription>Kérjük, töltse ki az alábbi űrlapot a jelentkezéshez.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <FormField control={form.control} name="fullName" render={({ field }) => (
            <FormItem><FormLabel>Teljes név</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email cím</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem><FormLabel>Telefonszám</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="message" render={({ field }) => (
            <FormItem><FormLabel>Bemutatkozás</FormLabel><FormControl><Textarea placeholder="Írjon pár szót magáról, és miért szeretné örökbefogadni..." {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <DialogFooter>
            <CustomButton type="submit" disabled={loading}>{loading ? 'Küldés...' : 'Jelentkezés küldése'}</CustomButton>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default AdoptionFormModal;