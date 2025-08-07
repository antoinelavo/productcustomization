// @/components/EmailSignup.jsx
import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';

export default function EmailSignup() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setEmail('');
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <section className="py-16 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-200">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center border-2 border-green-300">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              쿠폰이 발송되었습니다! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              이메일로 <span className="font-bold text-green-600">10% 할인 코드</span>를 보내드렸어요.
            </p>
            
            <div className="bg-yellow-50 rounded-xl p-4 mb-6 border-2 border-yellow-300">
              <p className="text-sm text-gray-700">
                할인 코드: <span className="font-bold text-gray-900">WELCOME10</span>
                <br />유효기간: 30일
              </p>
            </div>
            
            <button 
              onClick={() => setIsSubmitted(false)}
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              쇼핑 계속하기
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 md:p-10 shadow-xl border-2 border-gray-200">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              쿠폰이 발급되었습니다!
            </h2>
          </div>

          {/* Physical Coupon Design */}
          <div className="max-w-lg mx-auto mb-10">
            <div className="bg-gray-100 rounded-2xl p-8 border-2 border-gray-300 shadow-lg relative">
              {/* Coupon perforations effect */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-300"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-4 h-4 bg-white rounded-full border-2 border-gray-300"></div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-4">
                  10% 할인
                </div>
                
                {/* Dashed line separator */}
                <div className="border-t-2 border-dashed border-gray-400 my-6"></div>
                
                <div className="text-gray-600">
                  <div className="text-sm mb-2">만료기한</div>
                  <div className="text-lg font-semibold">~2025.09.22 23:59</div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Input Section */}
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-8">
              이메일 주소를 입력하시면 쿠폰을 즉시 발송해드려요!
              <br />신상품 소식과 특가 정보도 함께 받아보세요.
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소 입력"
                  required
                  className="flex-1 px-4 py-4 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-yellow-300 focus:border-yellow-400 transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg whitespace-nowrap"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      발송중...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      쿠폰 받기
                      <Mail className="w-5 h-5 ml-2" />
                    </span>
                  )}
                </button>
              </div>
            </form>


            {/* Privacy Notice */}
            <p className="text-xs text-gray-400">
              개인정보는 안전하게 보호되며, 언제든지 구독을 취소할 수 있습니다.
              <br/>
              버튼 클릭 시 이용약관, 개인정보처리방침 및 마케팅 수신 동의로 간주됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}