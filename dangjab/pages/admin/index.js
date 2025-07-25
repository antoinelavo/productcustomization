// /admin/index.js'use client'

import React, { useState } from 'react'
import { 
  Package, 
  MessageCircle, 
  Store, 
  Gift, 
  BarChart3,
  User,
  Settings,
  LogOut,
  Bell
} from 'lucide-react'
import OrderManagement from '@/pages/admin/components/OrderManagement'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('orders')

  const tabs = [
    {
      id: 'products',
      label: '상품 관리',
      icon: Package,
      description: '상품 등록, 수정, 재고 관리'
    },
    {
      id: 'inquiries',
      label: '문의관리/리뷰 관리',
      icon: MessageCircle,
      description: '고객 문의 및 리뷰 관리'
    },
    {
      id: 'store',
      label: '스토어 관리',
      icon: Store,
      description: '매장 정보 및 운영 관리'
    },
    {
      id: 'marketing',
      label: '혜택 마케팅',
      icon: Gift,
      description: '카카오톡, 쿠폰, 이벤트 관리'
    },
    {
      id: 'analytics',
      label: '데이터분석',
      icon: BarChart3,
      description: '매출 분석'
    },
    {
      id: 'orders',
      label: '주문 관리',
      icon: BarChart3,
      description: '주문 처리'
    }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrderManagement />
      
      default:
        const currentTab = tabs.find(tab => tab.id === activeTab)
        return (
          <div className="bg-white rounded-2xl shadow-lg p-8 min-h-96">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 rounded-full p-4">
                  <currentTab.icon className="w-8 h-8 text-gray-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {currentTab.label}
              </h3>
              <p className="text-gray-600 mb-8">
                {currentTab.description}
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-500">
                  이 섹션은 개발 중입니다.
                  <br />
                  곧 다양한 관리 기능이 추가될 예정입니다.
                </p>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                관리자 대시보드
              </h1>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
              </button>

              {/* Settings */}
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <Settings className="w-5 h-5" />
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="bg-gray-200 rounded-full p-2">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">관리자</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
              </div>

              {/* Logout */}
              <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex items-center space-x-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {renderTabContent()}
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">총 상품 수</p>
                <p className="text-2xl font-bold text-gray-900">124</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">미처리 문의</p>
                <p className="text-2xl font-bold text-gray-900">7</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">이번 달 주문</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Gift className="w-8 h-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">활성 이벤트</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}