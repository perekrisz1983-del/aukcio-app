"use client";

import React, { useState } from 'react';
import { MadeWithDyad } from './made-with-elmony';
import { Facebook, Youtube } from 'lucide-react';
import { Input } from './ui/input';
import { CustomButton } from './CustomButton';
import { supabase } from '@/lib/supabase';
import { showError, showSuccess } from '@/utils/toast';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const socialLinks = {
    facebook: 'https://www.facebook.com/pcas.allatmentes/#',
    youtube: 'https://www.youtube.com/user/pcasdogrescue21',
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showError("Kérjük, adja meg az email címét.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('subscribers').insert({ email });
    if (error) {
      if (error.code === '23505') { // unique violation
        showError("Ezzel az email címmel már feliratkoztak.");
      } else {
        showError(`Hiba történt: ${error.message}`);
      }
    } else {
      showSuccess("Sikeresen feliratkozott a hírlevelünkre!");
      setEmail('');
    }
    setLoading(false);
  };

  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h3 className="font-semibold text-white text-lg">Maradj képben!</h3>
            <p className="mt-2 text-sm">Iratkozz fel, hogy értesülj a friss mentésekről és eseményekről.</p>
            <form onSubmit={handleSubscribe} className="mt-4 flex flex-col sm:flex-row gap-2">
              <Input 
                type="email" 
                placeholder="Email címed" 
                className="bg-gray-700 border-gray-600 text-white" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              <CustomButton type="submit" disabled={loading} className="shrink-0">
                {loading ? 'Folyamatban...' : 'Feliratkozás'}
              </CustomButton>
            </form>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:justify-end lg:flex lg:gap-16">
            <div>
              <h3 className="font-semibold text-white">Oldalak</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link to="/auction" className="hover:text-white">Aukciók</Link></li>
                <li><Link to="/orokbefogadas" className="hover:text-white">Örökbefogadás</Link></li>
                <li><Link to="/sikersztorik" className="hover:text-white">Sikersztorik</Link></li>
                <li><Link to="/support" className="hover:text-white">Támogatás</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white">Rólunk</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white">Történetünk</Link></li>
                <li><Link to="/gyik" className="hover:text-white">GYIK</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <p className="text-sm">&copy; {new Date().getFullYear()} PCAS Állatmentő Egyesület. Minden jog fenntartva.</p>
          </div>
          <div className="flex items-center space-x-4">
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-white transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-white transition-colors">
              <Youtube className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
      <div className="bg-gray-900">
        <MadeWithDyad />
      </div>
    </footer>
  );
};

export default Footer;