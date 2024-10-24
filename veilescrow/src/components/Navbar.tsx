"use client";

import React, { useState } from 'react';
import { ConnectButton } from 'thirdweb/react';
import { client } from "../app/client"; 
import Link from 'next/link';
import Image from 'next/image';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['700'] });

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="mb-8 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="TrustLoop Logo" width={32} height={32} className="mr-2" />
          <span className={`text-xl sm:text-3xl font-bold ${poppins.className}`}>TrustLoop</span>
        </Link>
        <button
          className="sm:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <div className="hidden sm:flex items-center space-x-4">
          <Link href="/profile" className="bg-white text-indigo-600 py-2.5 px-5 rounded-full hover:bg-indigo-100 transition-colors flex items-center shadow-md text-base">
            <img src="/profile.svg" alt="Profile" className="w-5 h-5 mr-2" />
            Profile
          </Link>
          <ConnectButton client={client} />
        </div>
      </div>
      {isMenuOpen && (
        <div className="mt-4 sm:hidden space-y-2">
          <Link href="/profile" className="block bg-white text-indigo-600 py-2.5 px-5 rounded-full hover:bg-indigo-100 transition-colors flex items-center shadow-md text-base">
            <img src="/profile.svg" alt="Profile" className="w-5 h-5 mr-2" />
            Profile
          </Link>
          <ConnectButton client={client} />
        </div>
      )}
    </header>
  );
};

export default Navbar;
