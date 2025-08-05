// pages/auth/callback.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('처리 중...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback started');
        
        // Handle the OAuth callback - this is crucial for Kakao
        const { data, error } = await supabase.auth.exchangeCodeForSession(window.location.href);
        
        if (error) {
          console.error('OAuth exchange error:', error);
          setStatus('로그인에 실패했습니다: ' + error.message);
          setTimeout(() => {
            router.push('/login');
          }, 2000);
          return;
        }

        console.log('OAuth exchange successful:', data);

        // Verify we have a session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setStatus('세션을 가져오는데 실패했습니다.');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
          return;
        }

        if (session) {
          console.log('Session verified:', session.user.id);
          setStatus('로그인 성공! 잠시만 기다려주세요...');
          
          // Get returnTo from localStorage or default to home
          const returnTo = localStorage.getItem('returnTo') || '/';
          localStorage.removeItem('returnTo'); // Clean up
          
          // Redirect after a short delay
          setTimeout(() => {
            router.push(returnTo);
          }, 1500);
        } else {
          console.error('No session found after OAuth');
          setStatus('인증 정보를 찾을 수 없습니다.');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('오류가 발생했습니다: ' + error.message);
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    };

    // Only run if we have the router ready and are in browser
    if (router.isReady && typeof window !== 'undefined') {
      handleAuthCallback();
    }
  }, [router.isReady, router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full mx-4">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">카카오톡 로그인</h2>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}