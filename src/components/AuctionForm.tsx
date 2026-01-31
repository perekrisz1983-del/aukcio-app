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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Auction } from "../types";

export const auctionFormSchema = z.object({
  title: z.string().min(5, "A címnek legalább 5 karakter hosszúnak kell lennie."),
  description: z.string().min(10, "A leírásnak legalább 10 karakter hosszúnak kell lennie."),
  category: z.string({ required_error: "Kérjük, válasszon kategóriát." }).min(1, "Kérjük, válasszon kategóriát."),
  condition: z.enum(['Új', 'Használt'], { required_error: "Kérjük, adja meg az állapotot." }),
  starting_price: z.coerce.number().min(1, "A kezdő ár nem lehet nulla."),
  start_time: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "Érvénytelen kezdési dátum." }),
  end_time: z.string().refine((val) => val && !isNaN(Date.parse(val)), { message: "Érvénytelen lejárati időpont." }),
  image_urls: z.array(z.string()).min(1, "Legalább egy kép feltöltése kötelező."),
  bid_increment: z.coerce.number().min(100, "A licitlépcsőnek legalább 100 Ft-nak kell lennie."),
  has_buy_now: z.enum(["igen", "nem"]),
  buy_now_price: z.coerce.number().optional(),
}).refine(data => {
    if (data.has_buy_now === 'igen') {
        return data.buy_now_price && data.buy_now_price > data.starting_price;
    }
    return true;
}, {
    message: "A villámárnak nagyobbnak kell lennie a kezdő árnál.",
    path: ["buy_now_price"],
});

const processImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Hiba a canvas kontextus betöltésekor.'));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/webp', 0.8));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

interface AuctionFormProps {
  onSaveAuction: (data: z.infer<typeof auctionFormSchema>) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  editingAuction: Auction | null;
  onCancelEdit: () => void;
}

export const AuctionForm: React.FC<AuctionFormProps> = ({ onSaveAuction, categories, onAddCategory, editingAuction, onCancelEdit }) => {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof auctionFormSchema>>({
    resolver: zodResolver(auctionFormSchema),
    defaultValues: {
      title: "", description: "", category: "", condition: 'Használt',
      starting_price: 1000, image_urls: [], bid_increment: 100,
      has_buy_now: "nem", buy_now_price: undefined, start_time: '', end_time: '',
    },
  });

  useEffect(() => {
    if (editingAuction) {
      const formValues = {
        ...editingAuction,
        has_buy_now: editingAuction.has_buy_now ? "igen" : "nem",
        start_time: editingAuction.start_time ? new Date(editingAuction.start_time).toISOString().slice(0, 16) : '',
        end_time: editingAuction.end_time ? new Date(editingAuction.end_time).toISOString().slice(0, 16) : '',
      };
      form.reset(formValues as any);
    } else {
      form.reset({
        title: "", description: "", category: "", condition: 'Használt',
        starting_price: 1000, image_urls: [], bid_increment: 100,
        has_buy_now: "nem", buy_now_price: undefined, start_time: '', end_time: '',
      });
    }
  }, [editingAuction, form]);

  const hasBuyNow = form.watch("has_buy_now");
  const imageUrls = form.watch("image_urls");

  function onSubmit(values: z.infer<typeof auctionFormSchema>) {
    onSaveAuction(values);
    form.reset();
  }

  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
      setIsCategoryDialogOpen(false);
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      try {
        const imagePromises = Array.from(files).map(processImage);
        const processedImages = await Promise.all(imagePromises);
        const currentImages = form.getValues("image_urls");
        form.setValue("image_urls", [...currentImages, ...processedImages], { shouldValidate: true });
      } catch (error) {
        console.error("Képfeldolgozási hiba:", error);
        form.setError("image_urls", { type: "manual", message: "Hiba történt a kép feldolgozása során." });
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const currentImages = form.getValues("image_urls");
    form.setValue("image_urls", currentImages.filter((_, index) => index !== indexToRemove), { shouldValidate: true });
  };

  return (
    <Card className="rounded-xl shadow-md border border-border">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl">
          <PlusCircle className="mr-2 h-6 w-6 text-primary" />
          {editingAuction ? 'Aukció szerkesztése' : 'Új aukció létrehozása'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Form Fields... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Cím</FormLabel>
                  <FormControl><Input placeholder="Pl. Ritka festmény" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="category" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategória</FormLabel>
                    <div className="flex items-center gap-2">
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Válasszon..." /></SelectTrigger></FormControl>
                        <SelectContent>{categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                      </Select>
                      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                        <DialogTrigger asChild><CustomButton type="button" variant="outline" size="icon" className="shrink-0"><PlusCircle className="h-4 w-4" /></CustomButton></DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader><DialogTitle>Új kategória</DialogTitle></DialogHeader>
                          <div className="grid gap-4 py-4"><Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Pl. Játékok" /></div>
                          <DialogFooter><CustomButton type="button" onClick={handleAddNewCategory}>Mentés</CustomButton></DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="condition" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Állapot</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Válasszon..." /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Új">Új</SelectItem>
                        <SelectItem value="Használt">Használt</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Leírás</FormLabel>
                <FormControl><Textarea placeholder="Részletes leírás az aukciós tételről..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="image_urls" render={() => (
              <FormItem>
                <FormLabel>Képek feltöltése</FormLabel>
                <FormControl>
                  <div>
                    <Input type="file" accept="image/png, image/jpeg" className="hidden" ref={fileInputRef} onChange={handleImageChange} multiple />
                    <CustomButton type="button" variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" /> Képek kiválasztása</CustomButton>
                  </div>
                </FormControl>
                <FormMessage />
                {imageUrls && imageUrls.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative h-32 w-32 rounded-lg border p-1">
                        <img src={url} alt={`Előnézet ${index + 1}`} className="object-contain w-full h-full" />
                        <CustomButton type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => handleRemoveImage(index)}><X className="h-4 w-4" /></CustomButton>
                      </div>
                    ))}
                  </div>
                )}
              </FormItem>
            )} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField control={form.control} name="starting_price" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kezdő ár (Ft)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="bid_increment" render={({ field }) => (
                <FormItem>
                  <FormLabel>Licitlépcső</FormLabel>
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Válassz..." /></SelectTrigger></FormControl>
                    <SelectContent>{[100, 200, 500, 1000].map(val => <SelectItem key={val} value={String(val)}>{val} Ft</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="has_buy_now" render={({ field }) => (
                <FormItem>
                  <FormLabel>Van villámár?</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Válassz..." /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="nem">Nem</SelectItem><SelectItem value="igen">Igen</SelectItem></SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              {hasBuyNow === 'igen' && (
                <FormField control={form.control} name="buy_now_price" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Villámár (Ft)</FormLabel>
                    <FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="start_time" render={({ field }) => (
                <FormItem>
                  <FormLabel>Kezdő időpont</FormLabel>
                  <FormControl><Input type="datetime-local" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="end_time" render={({ field }) => (
                <FormItem>
                  <FormLabel>Lejárati időpont</FormLabel>
                  <FormControl><Input type="datetime-local" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="flex items-center gap-4">
              <CustomButton type="submit" className="w-full md:w-auto">
                {editingAuction ? 'Módosítás mentése' : 'Aukció létrehozása'}
              </CustomButton>
              {editingAuction && (
                <CustomButton type="button" variant="outline" onClick={onCancelEdit}>
                  Mégse
                </CustomButton>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};