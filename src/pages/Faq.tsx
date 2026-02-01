"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from '@/components/ui/card';

const faqData = [
  {
    question: "Mennyibe kerül az örökbefogadás?",
    answer: "Az örökbefogadás ingyenes, de az oltások és a chip árának megtérítését, illetve adományt szívesen fogadunk az egyesület támogatására."
  },
  {
    question: "Bárhova örökbe adtok kutyát?",
    answer: "Elsősorban Magyarország területén keresünk gazdát, de egyedi elbírálás alapján külföldre is, amennyiben a szállítás és az ellenőrzés megoldott."
  },
  {
    question: "Ivartalanítva vannak az állatok?",
    answer: "Igen, minden felnőtt állatot ivartalanítva adunk örökbe, kölykök esetén pedig ivartalanítási kötelezettséggel."
  },
  {
    question: "Hogyan tudok segíteni, ha nem fogadhatok örökbe?",
    answer: "Ideiglenes befogadással, sétáltatással, tárgyi adományokkal (táp, pokróc) vagy pénzbeli támogatással is hatalmas segítséget nyújtasz!"
  }
];

const FaqPage = () => {
  return (
    <div className="bg-gray-50 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">
              Gyakran Ismételt Kérdések
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Válaszok a leggyakoribb kérdésekre az örökbefogadással és a támogatással kapcsolatban.
            </p>
          </div>
          <Card className="p-6 sm:p-8 rounded-xl shadow-lg">
            <Accordion type="single" collapsible className="w-full">
              {faqData.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-left font-semibold text-lg">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-gray-700">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;