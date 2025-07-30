// /pages/customize-tshirt.js (or your preferred route)
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import ProductCustomizer from '@/components/ProductCustomizer';
import ReviewsSection from '@/components/ReviewsSection';
import ProductDescription from '@/components/ProductDescription';
import ProductInfo from '@/components/ProductInfo';

export default function TShirtCustomizerPage() {
  // Default t-shirt product data
  const defaultProduct = {
    id: 'default-tshirt',
    name: '커스텀 티셔츠',
    description: '나만의 디자인으로 만드는 특별한 티셔츠',
    basePrice: 25000,
    images: [
      '/images/tshirt-white.jpg',
      '/images/tshirt-black.jpg',
      '/images/tshirt-gray.jpg'
    ],
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL'],
    availableColors: ['#ffffff', '#000000', '#808080', '#ff0000', '#0000ff'],
    category: 'apparel',
    inStock: true
  };

  // Customization state management
  const [customizationData, setCustomizationData] = useState({
    selectedColor: '#ffffff',
    uploadedImage: null,
    selectedSize: 'M',
    textSettings: {
      topText: '',
      bottomText: '',
      leftText: '',
      rightText: '',
      textColor: '#8B4513',
      fontSize: 'medium'
    }
  });

  // Handler to update customization data from ProductCustomizer
  const handleCustomizationChange = (newCustomizationData) => {
    setCustomizationData(newCustomizationData);
    console.log('🎨 Customization updated:', newCustomizationData);
  };

  return (
    <Layout>
      {/* Product Customizer with connected state */}
      <ProductCustomizer 
        product={defaultProduct}
        customizationData={customizationData}
        onCustomizationChange={handleCustomizationChange}
      />
      
      {/* Product Info Section with customization data */}
      <ProductInfo 
        product={defaultProduct} 
        customizationData={customizationData}
      />
      
      {/* Product Description */}
      <ProductDescription product={defaultProduct} />
      
      {/* Reviews Section */}
      <ReviewsSection product={defaultProduct} />
    </Layout>
  );
}