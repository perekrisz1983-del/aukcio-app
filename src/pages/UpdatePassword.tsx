"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/CustomButton';
import { useNavigate } from 'react-router-dom';

const updatePasswordSchema = z.object({
  password: z.string().min(6, { message: 'A jelszónak legalább 6 karakter hosszúnak kell lennie.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "A két jelszó nem egyezik.",
  path: ["confirmPassword"],
});

const UpdatePasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const handleUpdatePassword = async (values: z.infer<typeof updatePasswordSchema>) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      showError(error.message);
    } else {
      showSuccess('Jelszó sikeresen megváltoztatva!');
      navigate('/auth');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Új jelszó beállítása</CardTitle>
          <CardDescription>Adja meg az új jelszavát.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdatePassword)} className="space-y-4">
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Új jelszó</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Új jelszó megerősítése</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <CustomButton type="submit" className="w-full" disabled={loading}>
                {loading ? 'Mentés...' : 'Jelszó frissítése'}
              </CustomButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePasswordPage;