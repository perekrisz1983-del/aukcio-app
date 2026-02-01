"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomButton } from '@/components/CustomButton';
import { Banknote, Copy, Heart, CreditCard } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

const Support = () => {
  const bankDetails = {
    beneficiary: 'PCAS Állatmentő Egyesület',
    accountNumber: '68800099-11083030-00000000',
    iban: 'HU04688000991108303000000000',
    paypal: 'petscare2000@gmail.com',
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      showSuccess('Számlaszám másolva!');
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

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                  <p className="text-lg font-semibold text-gray-800 font-mono tracking-tight">{bankDetails.accountNumber}</p>
                  <CustomButton variant="outline" size="icon" onClick={() => handleCopy(bankDetails.accountNumber)}>
                    <Copy className="h-4 w-4" />
                  </CustomButton>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">IBAN (nemzetközi utaláshoz)</p>
                <p className="text-lg font-semibold text-gray-800 font-mono tracking-tight">{bankDetails.iban}</p>
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
                <p className="text-lg font-semibold text-gray-800">{bankDetails.paypal}</p>
                <p className="text-xs text-gray-500 mt-1">
                  A fenti email címet használhatja a PayPal rendszerében a támogatás elküldéséhez.
                </p>
              </div>
              <CustomButton asChild className="w-full mt-4">
                <a href="https://www.paypal.com/hu/home" target="_blank" rel="noopener noreferrer">
                  Tovább a PayPal-re
                </a>
              </CustomButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;