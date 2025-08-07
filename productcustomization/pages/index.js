// pages/index.js
import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import EmailSignup from '@/components/EmailSignup';

export default function HomePage() {
  return (
    <Layout>
      <HeroSection />
      <FeaturedProducts />
      <EmailSignup />
    </Layout>
  );
}