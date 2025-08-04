import React from 'react';
import { Link } from 'react-router';
import { useAuth, useUser } from '@clerk/clerk-react';

export function HomePage() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            CulinarySeoul에 오신 것을 환영합니다
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            통합 F&B 관리 플랫폼으로 브랜드와 매장을 효율적으로 운영하세요
          </p>
          
          <div className="flex justify-center space-x-4">
            {isSignedIn ? (
              <>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-gray-700 mb-4">
                    안녕하세요, {user?.firstName || user?.emailAddresses[0]?.emailAddress}님!
                  </p>
                  <Link 
                    to="/company" 
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    대시보드로 이동
                  </Link>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/sign-in" 
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  로그인
                </Link>
                <Link 
                  to="/sign-up" 
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors font-medium"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">브랜드 관리</h3>
              <p className="text-gray-600">
                여러 브랜드를 통합 관리하고 성과를 분석하세요
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">매장 운영</h3>
              <p className="text-gray-600">
                실시간 매장 현황과 재고를 효율적으로 관리하세요
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">데이터 분석</h3>
              <p className="text-gray-600">
                매출, 고객, 재고 데이터를 분석하여 인사이트를 얻으세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;