"use client"

import CallToAction from '@/components/Marketplace/CTA';
import Header from '@/components/Marketplace/Header';
import Product from '@/components/Marketplace/Product';
import React, { useState } from 'react';

const MarketplacePage: React.FC = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = (value: string) => {
    setInputValue(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(() => {
      setSearchKeyword(value);
    }, 600);

    setSearchTimeout(newTimeout);
  };

  React.useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-black to-gray-900">
      <Header
        searchKeyword={inputValue}
        onSearchChange={handleSearch}
        loading={loading}
      />
      <Product
        searchKeyword={searchKeyword}
        onLoadingChange={setLoading}
      />
      <CallToAction />
    </div>
  );
};

export default MarketplacePage;