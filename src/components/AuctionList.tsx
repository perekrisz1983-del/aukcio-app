"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { List, Edit3, Trash2, MoreVertical, Truck, CheckCircle, PackageCheck, Mail } from "lucide-react";
import { Auction, AuctionStatus } from "../types";
import { CustomButton } from "./CustomButton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AuctionListProps {
  auctions: Auction[];
  filter: string;
  setFilter: (filter: string) => void;
  onEdit: (auction: Auction) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: AuctionStatus, trackingNumber?: string) => void;
}

const formatHungarianPrice = (price: number) => {
  return new Intl.NumberFormat("hu-HU", { style: "currency", currency: "HUF", minimumFractionDigits: 0 }).format(price);
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString("hu-HU", {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
};

const StatusActions = ({ auction, onStatusChange }: { auction: Auction, onStatusChange: AuctionListProps['onStatusChange'] }) => {
  const [isTrackingDialogOpen, setIsTrackingDialogOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleShip = () => {
    onStatusChange(auction.id, 'Postázva', trackingNumber);
    setIsTrackingDialogOpen(false);
    setTrackingNumber("");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CustomButton variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></CustomButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Státusz váltása</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(auction.status === 'Aktív' || auction.status === 'Lejárt') && auction.winner_id && (
          <DropdownMenuItem onClick={() => onStatusChange(auction.id, 'Fizetésre vár')}>
            <Mail className="mr-2 h-4 w-4" /> Nyertes értesítése
          </DropdownMenuItem>
        )}
        {auction.status === 'Fizetésre vár' && (
          <DropdownMenuItem onClick={() => onStatusChange(auction.id, 'Fizetve / Postázásra vár')}>
            <CheckCircle className="mr-2 h-4 w-4" /> Fizetés beérkezett
          </DropdownMenuItem>
        )}
        {auction.status === 'Fizetve / Postázásra vár' && (
          <Dialog open={isTrackingDialogOpen} onOpenChange={setIsTrackingDialogOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Truck className="mr-2 h-4 w-4" /> Csomag postázása
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Postázási adatok</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <Label htmlFor="tracking">Követési kód</Label>
                <Input id="tracking" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
              </div>
              <DialogFooter>
                <CustomButton onClick={handleShip}>Mentés és postázás</CustomButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {auction.status === 'Postázva' && (
          <DropdownMenuItem onClick={() => onStatusChange(auction.id, 'Lezárt / Teljesült')}>
            <PackageCheck className="mr-2 h-4 w-4" /> Aukció lezárása
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const AuctionList: React.FC<AuctionListProps> = ({ auctions, filter, setFilter, onEdit, onDelete, onStatusChange }) => {
  const getStatusBadge = (status: AuctionStatus) => {
    const variants: { [key in AuctionStatus]: string } = {
      'Aktív': 'bg-green-500 text-white',
      'Tervezett': 'bg-gray-400 text-white',
      'Lejárt': 'bg-red-600 text-white',
      'Fizetésre vár': 'bg-yellow-500 text-white',
      'Fizetve / Postázásra vár': 'bg-blue-500 text-white',
      'Postázva': 'bg-purple-500 text-white',
      'Lezárt / Teljesült': 'bg-gray-800 text-white',
    };
    return <Badge variant="default" className={variants[status] || 'bg-gray-500'}>{status}</Badge>;
  };

  return (
    <Card className="mt-8 rounded-xl shadow-md border border-border">
      <CardHeader><CardTitle className="flex items-center text-2xl"><List className="mr-2 h-6 w-6 text-primary" />Aukciók listája</CardTitle></CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="all">Összes</TabsTrigger>
            <TabsTrigger value="tervezett">Tervezett</TabsTrigger>
            <TabsTrigger value="aktív">Aktív</TabsTrigger>
            <TabsTrigger value="lejárt">Lejárt</TabsTrigger>
            <TabsTrigger value="fizetesre-var">Fizetésre vár</TabsTrigger>
            <TabsTrigger value="fizetve-postazasra-var">Fizetve / Postázásra vár</TabsTrigger>
            <TabsTrigger value="postazva">Postázva</TabsTrigger>
            <TabsTrigger value="lezart-teljesult">Lezárt / Teljesült</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="mt-4 rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cím</TableHead>
                <TableHead>Státusz</TableHead>
                <TableHead>Aktuális licit</TableHead>
                <TableHead>Lejárat</TableHead>
                <TableHead className="text-right">Műveletek</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auctions.length > 0 ? (
                auctions.map((auction) => (
                  <TableRow key={auction.id}>
                    <TableCell className="font-mono text-xs">{auction.auction_id_human}</TableCell>
                    <TableCell className="font-medium">{auction.title}</TableCell>
                    <TableCell>{getStatusBadge(auction.status)}</TableCell>
                    <TableCell>{formatHungarianPrice(auction.current_bid)}</TableCell>
                    <TableCell>{formatDate(auction.end_time)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <StatusActions auction={auction} onStatusChange={onStatusChange} />
                        <CustomButton variant="ghost" size="icon" onClick={() => onEdit(auction)}><Edit3 className="h-4 w-4 text-blue-600" /></CustomButton>
                        <AlertDialog>
                          <AlertDialogTrigger asChild><CustomButton variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-600" /></CustomButton></AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Biztosan törli ezt az aukciót?</AlertDialogTitle><AlertDialogDescription>A "{auction.title}" című aukció véglegesen törlődni fog.</AlertDialogDescription></AlertDialogHeader>
                            <AlertDialogFooter><AlertDialogCancel>Mégse</AlertDialogCancel><AlertDialogAction onClick={() => onDelete(auction.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Törlés</AlertDialogAction></AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={6} className="h-24 text-center">Nincsenek a szűrőnek megfelelő aukciók.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};