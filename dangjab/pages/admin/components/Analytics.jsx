// /pages/admin/components/Analytics.jsx
'use client'

import React, { useState, useEffect } from 'react'
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import { 
  TrendingUp,
  Users,
  MousePointerClick,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  Eye
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dateRange, setDateRange] = useState('30') // Last 30 days
  const [selectedSource, setSelectedSource] = useState('all')

  // Fetch analytics data from Supabase
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(dateRange))

      let query = supabase
        .from('traffic_sources')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false })

      if (selectedSource !== 'all') {
        query = query.eq('source', selectedSource)
      }

      const { data, error } = await query

      if (error) throw error

      setAnalyticsData(data || [])
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError('데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange, selectedSource])

  // Process data for charts
  const processMonthlyData = () => {
    const monthlyStats = {}
    
    analyticsData.forEach(item => {
      const date = new Date(item.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {}
      }
      
      if (!monthlyStats[monthKey][item.source]) {
        monthlyStats[monthKey][item.source] = 0
      }
      
      monthlyStats[monthKey][item.source]++
    })

    return Object.entries(monthlyStats).map(([month, sources]) => ({
      month,
      ...sources,
      total: Object.values(sources).reduce((sum, count) => sum + count, 0)
    })).sort((a, b) => a.month.localeCompare(b.month))
  }

  const processSourceData = () => {
    const sourceStats = {}
    
    analyticsData.forEach(item => {
      if (!sourceStats[item.source]) {
        sourceStats[item.source] = {
          name: item.source,
          visits: 0,
          conversions: 0
        }
      }
      sourceStats[item.source].visits++
      if (item.converted) {
        sourceStats[item.source].conversions++
      }
    })

    return Object.values(sourceStats).sort((a, b) => b.visits - a.visits)
  }

  const monthlyData = processMonthlyData()
  const sourceData = processSourceData()
  const totalVisits = analyticsData.length
  const totalConversions = analyticsData.filter(item => item.converted).length
  const conversionRate = totalVisits > 0 ? ((totalConversions / totalVisits) * 100).toFixed(1) : '0'
  const uniqueSources = new Set(analyticsData.map(item => item.source)).size

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16']

  // Get unique sources for filter
  const uniqueSourcesList = [...new Set(analyticsData.map(item => item.source))].sort()

  const downloadCSV = () => {
    const headers = ['날짜', '소스', '캠페인', '매체', '랜딩페이지', '전환여부']
    const csvContent = [
      headers.join(','),
      ...analyticsData.map(item => [
        new Date(item.created_at).toLocaleDateString('ko-KR'),
        item.source,
        item.campaign || '',
        item.medium || '',
        item.landing_page,
        item.converted ? '예' : '아니오'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `traffic_analytics_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-2xl font-bold text-gray-900">트래픽 분석</h3>
            <button 
              onClick={fetchAnalyticsData}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>
          </div>
          
          <button 
            onClick={downloadCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={loading || analyticsData.length === 0}
          >
            <Download className="w-4 h-4" />
            <span>CSV 다운로드</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7">최근 7일</option>
              <option value="30">최근 30일</option>
              <option value="90">최근 90일</option>
              <option value="365">최근 1년</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">모든 소스</option>
              {uniqueSourcesList.map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2 text-gray-600">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>데이터를 불러오는 중...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-600">총 방문수</p>
                    <p className="text-2xl font-bold text-blue-900">{totalVisits.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-600">전환수</p>
                    <p className="text-2xl font-bold text-green-900">{totalConversions.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MousePointerClick className="w-8 h-8 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-yellow-600">전환율</p>
                    <p className="text-2xl font-bold text-yellow-900">{conversionRate}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Eye className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-600">트래픽 소스</p>
                    <p className="text-2xl font-bold text-purple-900">{uniqueSources}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="p-6 space-y-8">
            {/* Monthly Traffic Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">월별 트래픽 추이</h4>
              {monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-gray-500 py-8">데이터가 없습니다.</div>
              )}
            </div>

            {/* Source Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">트래픽 소스 분포</h4>
                {sourceData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="visits"
                      >
                        {sourceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-gray-500 py-8">데이터가 없습니다.</div>
                )}
              </div>

              {/* Top Sources Table */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">상위 트래픽 소스</h4>
                <div className="space-y-3">
                  {sourceData.slice(0, 5).map((source, index) => (
                    <div key={source.name} className="flex items-center justify-between bg-white rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="font-medium text-gray-900">{source.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">{source.visits}</div>
                        <div className="text-xs text-gray-500">
                          전환: {source.conversions} ({source.visits > 0 ? ((source.conversions / source.visits) * 100).toFixed(1) : 0}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Raw Data Table */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">최근 방문 기록</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">날짜</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">소스</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">캠페인</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">매체</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">전환</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData.slice(0, 20).map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(item.created_at).toLocaleString('ko-KR')}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {item.source}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {item.campaign || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {item.medium || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.converted 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.converted ? '전환' : '미전환'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {analyticsData.length > 20 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      {analyticsData.length - 20}개의 추가 기록이 있습니다. CSV 다운로드를 통해 전체 데이터를 확인하세요.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}