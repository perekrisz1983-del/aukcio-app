"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { showError, showSuccess } from '@/utils/toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CustomButton } from '@/components/CustomButton';
import { Chrome } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Érvénytelen email cím.' }),
  password: z.string().min(1, { message: 'A jelszó megadása kötelező.' }),
});

const signupSchema = z.object({
  email: z.string().email({ message: 'Érvénytelen email cím.' }),
  password: z.string().min(6, { message: 'A jelszónak legalább 6 karakter hosszúnak kell lennie.' }),
});

const AuthPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      showError(error.message);
    } else {
      showSuccess('Sikeres bejelentkezés!');
      navigate('/');
    }
    setLoading(false);
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });
    if (error) {
      showError(error.message);
    } else {
      showSuccess('Sikeres regisztráció! Kérjük, erősítse meg az email címét.');
      // Send welcome email without blocking the UI
      fetch('/api/send-welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: values.email }),
      }).catch(err => console.error("Failed to send welcome email:", err));
    }
    setLoading(false);
  };

  const handleSignInWithGoogle = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({ provider: 'google' });
    setLoading(false);
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] p-4">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Bejelentkezés</TabsTrigger>
          <TabsTrigger value="signup">Regisztráció</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Bejelentkezés</CardTitle>
              <CardDescription>Jelentkezzen be a licitáláshoz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                  <FormField control={loginForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="nev@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={loginForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Jelszó</FormLabel>
                        <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                          Elfelejtett jelszó?
                        </Link>
                      </div>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <CustomButton type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Folyamatban...' : 'Bejelentkezés'}
                  </CustomButton>
                </form>
              </Form>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Vagy</span></div>
              </div>
              <CustomButton variant="outline" className="w-full" onClick={handleSignInWithGoogle} disabled={loading}>
                <Chrome className="mr-2 h-4 w-4" /> Bejelentkezés Google fiókkal
              </CustomButton>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Regisztráció</CardTitle>
              <CardDescription>Hozzon létre egy fiókot a részvételhez.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...signupForm}>
                <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                  <FormField control={signupForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="nev@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signupForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jelszó</FormLabel>
                      <FormControl><Input type="password" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <CustomButton type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Folyamatban...' : 'Regisztráció'}
                  </CustomButton>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;