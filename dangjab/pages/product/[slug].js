// pages/index.js
import React from 'react';
import Layout from '@/components/Layout';
import ProductCustomizer from '@/components/ProductCustomizer'
import ReviewsSection from '@/components/ReviewsSection'
import ProductDescription from '@/components/ProductDescription';


export default function HomePage() {
  return (
    <Layout>
      <ProductCustomizer />
      <ReviewsSection />
      <ProductDescription />
    </Layout>
  );
}