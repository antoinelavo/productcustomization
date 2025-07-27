// /pages/checkout/success.js
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useRouter } from 'next/router';
import { CheckCircle, Package, Truck, Clock, Mail, Phone, MapPin, ArrowRight, Home } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { orderId } = router.query;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (orderIdParam) => {
    try {
      setLoading(true);
      console.log('🔍 Fetching order details for:', orderIdParam);
      
      // For now, we'll create a simple success message
      // Later we can add an API call to get full order details
      
      // TODO: Replace with actual API call when order tracking is implemented
      // const response = await fetch(`/api/orders/${orderIdParam}`);
      // const data = await response.json();
      // setOrderDetails(data);
      
      // Temporary order details (remove when API is ready)
      setTimeout(() => {
        setOrderDetails({
          orderId: orderIdParam,
          status: 'confirmed',
          estimatedDelivery: getEstimatedDelivery(),
        });
        setLoading(false);
      }, 500);
      
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('주문 정보를 불러오는 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 5); // 5 days from now
    
    return deliveryDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleTrackOrder = () => {
    if (orderId) {
      router.push(`/orders/${orderId}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">주문 정보를 확인하고 있습니다...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={handleGoHome}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">주문이 완료되었습니다!</h1>
            <p className="text-gray-600 text-lg">
              주문해 주셔서 감사합니다. 곧 제작을 시작하겠습니다.
            </p>
          </div>

          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h2 className="text-xl font-bold">주문 번호</h2>
                  <p className="text-blue-100 font-mono text-lg">{orderId}</p>
                </div>
                <Package className="w-8 h-8" />
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Order Status */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    주문 상태
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium">✅ 주문 접수 완료</p>
                    <p className="text-green-600 text-sm mt-1">
                      결제가 완료되어 제작 준비 중입니다
                    </p>
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center">
                    <Truck className="w-5 h-5 mr-2 text-blue-600" />
                    예상 배송일
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">{orderDetails?.estimatedDelivery}</p>
                    <p className="text-blue-600 text-sm mt-1">
                      제작 완료 후 1-2일 내 발송 예정
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">다음 단계</h2>
            
            <div className="space-y-4">
              {/* Step 1 */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">주문 확인 이메일</h3>
                  <p className="text-gray-600 text-sm">
                    입력해주신 이메일로 주문 확인서를 발송해드렸습니다.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">디자인 제작</h3>
                  <p className="text-gray-600 text-sm">
                    고객님의 커스터마이징 요청에 따라 디자인을 제작합니다. (1-2일 소요)
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">제작 및 발송</h3>
                  <p className="text-gray-600 text-sm">
                    제품 제작 완료 후 배송을 시작하며, 송장번호를 안내해드립니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">문의하기</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">이메일</p>
                  <p className="text-gray-600">support@yourstore.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">고객센터</p>
                  <p className="text-gray-600">02-1234-5678</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleTrackOrder}
              className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Package className="w-5 h-5" />
              <span>주문 상세보기</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleContinueShopping}
              className="flex-1 bg-gray-100 text-gray-900 py-4 px-6 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <span>쇼핑 계속하기</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleGoHome}
              className="sm:w-auto bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>홈으로</span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>주문 관련 문의사항이 있으시면 언제든지 고객센터로 연락해주세요.</p>
            <p className="mt-1">주문번호를 준비해두시면 더 빠른 상담이 가능합니다.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}