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
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Érvénytelen email cím.' }),
});

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const handlePasswordReset = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      showError(error.message);
    } else {
      showSuccess('Jelszó-visszaállító email elküldve. Kérjük, ellenőrizze a postafiókját.');
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Elfelejtett jelszó</CardTitle>
          <CardDescription>
            {submitted 
              ? 'A jelszó-visszaállító linket elküldtük a megadott email címre. Kérjük, kövesse az ott található utasításokat.'
              : 'Adja meg az email címét, és küldünk egy linket a jelszó visszaállításához.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!submitted ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handlePasswordReset)} className="space-y-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input placeholder="nev@email.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <CustomButton type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Küldés...' : 'Jelszó-visszaállító link küldése'}
                </CustomButton>
              </form>
            </Form>
          ) : (
             <Link to="/auth">
                <CustomButton variant="outline" className="w-full">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Vissza a bejelentkezéshez
                </CustomButton>
             </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;