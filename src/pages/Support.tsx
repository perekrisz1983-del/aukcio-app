"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomButton } from '@/components/CustomButton';
import { Banknote, Copy, Heart, CreditCard, Youtube, Gift } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const Support = () => {
  const bankDetails = {
    beneficiary: 'PCAS Állatmentő Egyesület',
    accountNumber: '68800099-11083030-00000000',
    iban: 'HU04688000991108303000000000',
    paypalEmail: 'petscare2000@gmail.com',
    paypalUrl: 'https://www.paypal.com/donate/?business=petscare2000@gmail.com&no_recurring=0&currency_code=HUF',
    adjukosszeUrl: 'https://adjukossze.hu/szervezet/pcas-pets-care-allatmento-es-kornyezetvedo-egyesulet-2783',
    youtubeUrl: 'https://www.youtube.com/user/pcasdogrescue21',
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showSuccess(`${type} másolva!`);
    });
  };

  return (
    <div className="bg-gray-50 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Heart className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-4 text-4xl font-extrabold text-primary sm:text-5xl">
            Támogasd a munkánkat!
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            Minden adomány, legyen bármilyen kicsi, óriási segítség a mentett állatok számára. A te támogatásodból fedezzük az orvosi költségeket, az élelmet és a biztonságos elhelyezésüket. Köszönjük, hogy mellettünk állsz!
          </p>
        </div>

        <div className="mt-12 max-w-4xl mx-auto space-y-8">
          {/* Adjukossze.hu Card */}
          <Card className="shadow-lg rounded-xl border-2 border-primary bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Gift className="mr-3 h-8 w-8 text-primary" />
                Rendszeres támogatás
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-lg text-gray-800">
                Egyszeri és rendszeres támogatás az Adjukössze.hu-n keresztül.
              </p>
              <CustomButton asChild className="w-full sm:w-auto">
                <a href={bankDetails.adjukosszeUrl} target="_blank" rel="noopener noreferrer">
                  Támogatás az Adjukössze.hu-n
                </a>
              </CustomButton>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Bank Transfer Card */}
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Banknote className="mr-3 h-8 w-8 text-primary" />
                  Banki átutalás
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-left">
                <div>
                  <p className="text-sm font-medium text-gray-500">Kedvezményezett</p>
                  <p className="text-lg font-semibold text-gray-800">{bankDetails.beneficiary}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Belföldi számlaszám</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-semibold text-gray-800 font-mono tracking-tight break-all">{bankDetails.accountNumber}</p>
                    <CustomButton variant="outline" size="icon" onClick={() => handleCopy(bankDetails.accountNumber, 'Számlaszám')}>
                      <Copy className="h-4 w-4" />
                    </CustomButton>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">IBAN (nemzetközi utaláshoz)</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-semibold text-gray-800 font-mono tracking-tight break-all">{bankDetails.iban}</p>
                    <CustomButton variant="outline" size="icon" onClick={() => handleCopy(bankDetails.iban, 'IBAN')}>
                      <Copy className="h-4 w-4" />
                    </CustomButton>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* PayPal Card */}
            <Card className="shadow-lg rounded-xl flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <CreditCard className="mr-3 h-8 w-8 text-primary" />
                  PayPal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-left flex-grow flex flex-col justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">PayPal email cím</p>
                  <p className="text-lg font-semibold text-gray-800">{bankDetails.paypalEmail}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Kattints a gombra a biztonságos és közvetlen adományozáshoz.
                  </p>
                </div>
                <CustomButton asChild className="w-full mt-4">
                  <a href={bankDetails.paypalUrl} target="_blank" rel="noopener noreferrer">
                    Támogatás PayPal-en keresztül
                  </a>
                </CustomButton>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* YouTube Section */}
        <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto shadow-lg rounded-xl p-8">
                <Youtube className="mx-auto h-12 w-12 text-red-600" />
                <h2 className="mt-4 text-2xl font-bold text-gray-800">Ismerd meg munkánkat!</h2>
                <p className="mt-2 text-gray-600">
                    Nézd meg videóinkat YouTube csatornánkon, és lásd a saját szemeddel, hova kerül a támogatásod.
                </p>
                <CustomButton asChild variant="outline" className="mt-6">
                    <a href={bankDetails.youtubeUrl} target="_blank" rel="noopener noreferrer">
                        Irány a YouTube csatorna
                    </a>
                </CustomButton>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;