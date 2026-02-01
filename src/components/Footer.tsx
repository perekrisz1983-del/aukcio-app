"use client";

import React from 'react';
import { MadeWithDyad } from './made-with-elmony';
import { Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  const socialLinks = {
    facebook: 'https://www.facebook.com/pcas.slovakia',
    youtube: 'https://www.youtube.com/user/pcasdogrescue21',
  };

  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <p className="font-semibold text-white">PCAS Állatmentő Egyesület</p>
          <p className="text-sm">&copy; {new Date().getFullYear()} Minden jog fenntartva.</p>
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
      <div className="bg-gray-900">
        <MadeWithDyad />
      </div>
    </footer>
  );
};

export default Footer;