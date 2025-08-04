// pages/login.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signInWithKakao, getCurrentUser } from '@/lib/auth';
import Header from '@/components/Header';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    async function checkUser() {
      const { user } = await getCurrentUser();
      if (user) {
        // User is already logged in, redirect to home or intended page
        const returnTo = router.query.returnTo || '/';
        router.push(returnTo);
      } else {
        setCheckingAuth(false);
      }
    }

    checkUser();
  }, [router]);

  const handleKakaoLogin = async () => {
    setLoading(true);
    setError('');

    const { error } = await signInWithKakao();
    
    if (error) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
      setLoading(false);
    }
    // If successful, user will be redirected to callback page
  };

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">로그인</h2>
              <p className="text-gray-600">카카오톡으로 간편하게 로그인하세요</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Kakao Login Button */}
            <div>
              <button
                onClick={handleKakaoLogin}
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    <span>로그인 중...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678-.112-.472-.618L7.909 18.32c-2.59-1.48-4.409-3.762-4.409-6.52C3.5 6.665 6.201 3 12 3z"/>
                    </svg>
                    <span>카카오톡으로 로그인</span>
                  </div>
                )}
              </button>
            </div>

            {/* Return Link */}
            <div className="text-center">
              <button
                onClick={() => router.back()}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                이전 페이지로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}