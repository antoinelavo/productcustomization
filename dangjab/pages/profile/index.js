// pages/profile.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const { user, userProfile, loading, signOut } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      router.push('/');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render anything if redirecting
  if (!user) {
    return null;
  }

  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-xl font-bold text-gray-900 mb-6">내 프로필</h1>
            
            <div className="space-y-4">
              {/* Display Name */}
              <div className="py-3 border-b border-gray-100 m-0">
                <p className="text-sm font-medium text-gray-500 mb-1">이름</p>
                <p className="text-gray-900">
                  {userProfile?.display_name || '이름 정보가 없습니다'}
                </p>
              </div>

              {/* Email */}
              <div className="py-3 border-b border-gray-100 m-0">
                <p className="text-sm font-medium text-gray-500 mb-1">이메일</p>
                <p className="text-gray-900">
                  {userProfile?.email || user?.email || '이메일 정보가 없습니다'}
                </p>
              </div>

              {/* Provider */}
              {userProfile?.provider && (
                <div className="py-3 border-b border-gray-100 m-0">
                  <p className="text-sm font-medium text-gray-500 mb-1">로그인 방식</p>
                  <p className="text-gray-900">
                    {userProfile.provider === 'kakao' ? '카카오톡' : userProfile.provider}
                  </p>
                </div>
              )}

              {/* Join Date */}
              {userProfile?.created_at && (
                <div className="py-3">
                  <p className="text-sm font-medium text-gray-500 mb-1">가입일</p>
                  <p className="text-gray-900">
                    {new Date(userProfile.created_at).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <div className="mt-0 pt-6 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 transition-colors text-sm"
              >
                로그아웃
              </button>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 rounded-lg p-2">
                  <User size={16} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">내 리뷰</h3>
                  <p className="text-xs text-gray-500">작성한 리뷰 확인</p>
                </div>
              </div>
              <button className="mt-3 text-blue-600 hover:text-blue-700 text-xs font-medium">
                리뷰 보기 →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 rounded-lg p-2">
                  <Calendar size={16} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">주문 내역</h3>
                  <p className="text-xs text-gray-500">구매한 상품 확인</p>
                </div>
              </div>
              <button className="mt-3 text-green-600 hover:text-green-700 text-xs font-medium">
                주문 내역 보기 →
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 rounded-lg p-2">
                  <Mail size={16} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">계정 설정</h3>
                  <p className="text-xs text-gray-500">프로필 정보 수정</p>
                </div>
              </div>
              <button className="mt-3 text-purple-600 hover:text-purple-700 text-xs font-medium">
                설정 보기 →
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}