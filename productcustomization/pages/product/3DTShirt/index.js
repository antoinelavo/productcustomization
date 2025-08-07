// /pages/product/3DTShirt/index.js - HARDCODED VERSION (NO API)
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ProductCustomizer from '@/components/ProductCustomizer/ProductCustomizer';
import ReviewsSection from '@/components/ReviewsSection';
import ProductDescription from '@/components/ProductDescription';
import ProductInfo from '@/components/ProductInfo';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getProductConfig } from '@/components/ProductCustomizer/config/productConfig';

// ✅ HARDCODED PRODUCT DATA
const HARDCODED_PRODUCT = {
  id: '3DTShirt',
  name: '3D 티셔츠',
  price: 25000,
  description: '고품질 면 소재로 제작된 커스터마이징 가능한 3D 티셔츠입니다.',
  category: 'clothing',
  brand: 'CustomWear',
  images: [
    '/images/3dtshirt-default.jpg',
    '/images/3dtshirt-front.jpg',
    '/images/3dtshirt-back.jpg'
  ],
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  colors: ['white', 'black', 'navy', 'red', 'gray'],
  inStock: true,
  rating: 4.5,
  reviewCount: 127,
  type: '3DTShirt'
};

export default function Product3DTShirt() {
  const router = useRouter();
  
  // Hard-code the slug since this is a specific route
  const slug = '3DTShirt';
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use slug as the product type directly
  const productType = slug;
  const productConfig = getProductConfig(productType);

  // Dynamic customization state based on product config
  const [customizationData, setCustomizationData] = useState(null);

  // Initialize customization data when product config is available
  const initializeCustomizationData = (config) => {
    return {
      selectedColor: config.defaultColor,
      uploadedImage: null,
      selectedSize: config.defaultSize,
      selectedTemplate: null,
      textSettings: {
        topText: '',
        bottomText: '',
        leftText: '',
        rightText: '',
        textColor: '#8B4513',
        fontSize: 'medium'
      }
    };
  };

  // ✅ SIMULATE LOADING WITH HARDCODED DATA (NO API CALL)
  useEffect(() => {
    const loadProduct = () => {
      setLoading(true);
      setError(null);
      
      // Simulate loading time
      setTimeout(() => {
        try {
          // Use hardcoded product data
          setProduct(HARDCODED_PRODUCT);
          setLoading(false);
        } catch (err) {
          console.error('Error loading product:', err);
          setError('상품을 불러올 수 없습니다.');
          setLoading(false);
        }
      }, 500); // Simulate 500ms loading time
    };

    loadProduct();
  }, []);

  // Initialize customization when product config is available
  useEffect(() => {
    if (productConfig) {
      const initialCustomization = initializeCustomizationData(productConfig);
      setCustomizationData(initialCustomization);
    }
  }, [productConfig]);

  // Loading state
  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Product not found (shouldn't happen with hardcoded data)
  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">상품을 찾을 수 없습니다</h1>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // Wait for customization data to be initialized
  if (!customizationData) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  return (
    <Layout>
      <ProductCustomizer 
        productType={productType}
      />
      
      <ProductInfo 
        product={product} 
        productConfig={productConfig}
        customizationData={customizationData}
      />
      
      <ProductDescription product={product} />
      
      <ReviewsSection productSlug={slug} />
    </Layout>
  );
}

// ✅ NO getStaticProps, getStaticPaths, or getServerSideProps functions!