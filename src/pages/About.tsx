"use client";

import React from "react";

const About = () => {
  return (
    <div className="bg-gray-50 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">
              Rólunk
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Ismerd meg a PCAS Állatmentő Egyesület történetét és küldetését.
            </p>
          </div>

          <div className="prose prose-lg max-w-none prose-h2:text-gray-800 prose-h2:font-semibold prose-p:text-gray-700 prose-p:leading-relaxed">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="md:w-1/3 flex-shrink-0">
                <img
                  src="https://lnhuhshrgudtyfslitcf.supabase.co/storage/v1/object/public/animal-images/betty.png"
                  alt="Vidra Betty, a PCAS alapítója"
                  className="rounded-xl shadow-md w-full h-auto object-cover"
                />
              </div>
              <div className="md:w-2/3">
                <h2>Bemutatkozás</h2>
                <p>
                  Vidra Betty vagyok a PCAS Állatmentő Egyesület alapítója és vezetője. Sokak szerint megszállott. Igazuk van! Nem vagyok képes belenyugodni, hogy élőlények, akik itt élnek velünk a Föld bolygón, és akiket mi szelídítettünk magunkhoz valamikor, most ennyit, és ilyen kegyetlenül szenvedjenek.
                </p>
                <p>
                  A PCAS nem állatvédő, hanem állatmentő szervezetként jött létre. Sokan nem tudják, mi a különféleség a két tevékenység között. Az állatmentő feladatainak fókuszában a mentés áll, ezért a tevékenységben a mentés minden esetben jelen van. Ezért sokkal kevesebb idő és energia marad az oktatásra, az emberek hozzáállásának a befolyásolására a témával kapcsolatban.
                </p>
              </div>
            </div>

            <p>
              Úgy vagyok összerakva, azt a feladatot kaptam születésemkor, hogy azokat a lényeket segítsem, akik nem tudnak önmagukért szót emelni, és akik minden fájdalom, szenvedés, kínzás ellenére képesek újra hinni, bízni és feltétel nélkül rajongani az EMBER-ért, ha az szeretettel fordul felé. Ha hasonlóan érzel, segíts nekünk!
            </p>
            <p>
              A PCAS fő tevékenysége a gyepmesteri telepekre bekerülő állatok mentése, de természetesen nem csak kutyákkal foglalkozunk. Gyakran előfordul, hogy sérült cicáknak segítünk, de mentünk madarakat, hüllőket, és ha szükséges – más szervezetekkel együttműködve – vadállatokat és haszonállatokat is. Utóbbi kettő sajnos elég bonyolult a hatályos jogi környezet és infrastrukturális háttér különbözősége miatt!
            </p>

            <h2>Szívügyünk a súlyosan sérült állatok mentése</h2>
            <p>
              Az évek alatt igen magas számú sérült-, hiányzó végtagú, gerincsérült, lebénult, vak és egyéb testi fogyatékkal rendelkező, elsőre talán esélytelennek tűnő állatnak adtunk lehetőséget, hogy adott esetben számtalan műtétet követően, rehabilitáció után sikeresen tudjon beilleszkedni, és teljes, társállathoz méltó életet tudjon élni.
            </p>
            <p>
              Minden egyes esettel váltunk mi magunk is egyre tapasztaltabbá, gyakorlatiasabbá. Volt, hogy az orvosaink is csodálkozva álltak egy-egy védencünk felett és csodával közel azonos szinten tekintettek gyógyulásukra. Hisszük és valljuk, hogy a traumás helyzetben lévő állatoknak mi vagyunk a hangja és az esélye arra, hogy ne az életük elvétele legyen az egyetlen lehetőség. Ameddig nem képesek újra kommunikálni és kifejezni az élethez való ragaszkodásukat, addig nekünk kell ezt megtennünk helyettük és képviselni a jogukat az élethez.
            </p>
            <p>
              Emellett folyamatosan dolgozunk mentési-, felvilágosítási- és tapasztalatgyűjtési céllal Kelet-Magyarország mélyszegénységgel sújtott és kóbor kutyák számát tekintve kiemelkedően infektált területein is. Az eredmények területenként bár eltérőek, de a folyamatos jelenlétünknek köszönhetően mégis pozitív irányba látszik elmozdulni.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;