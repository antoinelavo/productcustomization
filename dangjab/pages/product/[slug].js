// /pages/product/[slug].js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ProductCustomizer from '@/components/ProductCustomizer';
import ReviewsSection from '@/components/ReviewsSection';
import ProductDescription from '@/components/ProductDescription';
import ProductInfo from '@/components/ProductInfo';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function ProductPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✨ NEW: Customization state management
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

  // ✨ NEW: Handler to update customization data from ProductCustomizer
  const handleCustomizationChange = (newCustomizationData) => {
    setCustomizationData(newCustomizationData);
    console.log('🎨 Customization updated:', newCustomizationData);
  };

  // Fetch product data
  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch product');
        }

        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // ✨ NEW: Reset customization when product changes
  useEffect(() => {
    if (product) {
      // Reset customization data for new product
      setCustomizationData({
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
    }
  }, [product?.id]); // Reset when product ID changes

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

  // Product not found
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

  return (
    <Layout>
      {/* Product Customizer with connected state */}
      <ProductCustomizer 
        product={product}
        customizationData={customizationData}
        onCustomizationChange={handleCustomizationChange}
      />
      
      {/* Product Info Section with customization data */}
      <ProductInfo 
        product={product} 
        customizationData={customizationData}
      />
      
      {/* Product Description */}
      <ProductDescription product={product} />
      
      {/* Reviews Section */}
      <ReviewsSection productSlug="tshirt" />
    </Layout>
  );
}