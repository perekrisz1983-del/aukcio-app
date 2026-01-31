"use client";

import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { CustomButton } from "@/components/CustomButton";
import { MadeWithDyad } from "@/components/made-with-elmony";
import { Clock, Heart, Award, Users, LifeBuoy, Activity, Home } from "lucide-react";
import { cn } from "@/lib/utils";

// Counter Component Logic
const Counter = ({ to, duration = 2000 }: { to: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const end = to;
          const startTime = Date.now();

          const animate = () => {
            const currentTime = Date.now();
            const progress = Math.min(1, (currentTime - startTime) / duration);
            const currentNum = Math.floor(progress * (end - start) + start);
            setCount(currentNum);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [to, duration]);

  return <span ref={ref}>{count.toLocaleString("hu-HU")}</span>;
};

const Index = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div
        className="relative h-[500px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=1920)",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-5xl mx-auto text-white p-4">
          <h1 className="text-2xl md:text-5xl font-extrabold mb-6 drop-shadow-lg md:whitespace-nowrap">
            Életeket mentünk, nap mint nap
          </h1>
          <p className="text-xl md:text-2xl mb-10 drop-shadow-md">
            Csatlakozz küldetésünkhöz: mentsünk meg, rehabilitáljunk és adjunk új otthont a rászoruló állatoknak.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <CustomButton asChild className="px-6 py-2 rounded-lg">
              <Link to="/auction">Örökbefogadás most</Link>
            </CustomButton>
            <CustomButton asChild variant="outline" className="px-8 py-3 text-lg font-semibold bg-white border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white">
              <Link to="/support">Támogasd a munkánkat</Link>
            </CustomButton>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Clock, number: 11, text: "év tapasztalat", suffix: "+" },
              { icon: Heart, number: 2500, text: "megmentett állat", suffix: "+" },
              { icon: Award, number: 500, text: "sikeres örökbefogadás", suffix: "+" },
              { icon: Users, number: 100, text: "önkéntes", suffix: "+" },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center transition-transform transform hover:-translate-y-2">
                <stat.icon className="h-12 w-12 mx-auto text-primary mb-4" />
                <p className="text-4xl font-bold text-gray-800">
                  <Counter to={stat.number} />
                  {stat.suffix}
                </p>
                <p className="text-gray-500 mt-2">{stat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">Küldetésünk</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Hisszük, hogy minden állat megérdemel egy második esélyt. Munkánk három alappilléren nyugszik, hogy a rászoruló állatok biztonságos és szerető otthonra leljenek.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: LifeBuoy, title: "Mentés", description: "Veszélyben lévő, elhagyott állatokat mentünk, és biztonságos menedéket nyújtunk nekik." },
              { icon: Activity, title: "Rehabilitáció", description: "Orvosi ellátást, szocializációt és képzést biztosítunk, hogy felkészítsük őket az új életre." },
              { icon: Home, title: "Gazdisítás", description: "Gondosan megkeressük minden védencünk számára a tökéletes, végleges otthont." },
            ].map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">
              Segíts Te is még ma!
            </h2>
            <p className="max-w-3xl mx-auto mb-8 text-lg">
              „Támogatásoddal segíted életmentő munkánk folytatását. Vegyél részt aukcióinkon, fogadj örökbe egy négylábú barátot, vagy válj támogatónkká!”
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <CustomButton asChild className="px-8 py-3 bg-white text-primary rounded-lg hover:bg-gray-100 font-semibold text-base">
                <Link to="/auction">Aukciók megtekintése</Link>
              </CustomButton>
              <CustomButton asChild variant="outline" className="px-8 py-3 font-semibold bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-primary text-base">
                <Link to="/auction">Gazdikereső böngészése</Link>
              </CustomButton>
            </div>
          </div>
        </div>
      </section>

      <MadeWithDyad />
    </div>
  );
};

export default Index;