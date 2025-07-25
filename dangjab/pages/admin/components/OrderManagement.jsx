// /admin/components/OrderManagement.jsx
'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search,
  Download,
  Eye,
  Edit,
  ChevronDown,
  RefreshCw,
  Image,
  X
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function OrderManagement() {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const statusOptions = [
    { value: 'all', label: '전체', color: 'gray' },
    { value: 'order_received', label: '주문 접수', color: 'blue' },
    { value: 'awaiting_customization', label: '커스터마이징 대기', color: 'yellow' },
    { value: 'design_in_progress', label: '디자인 진행중', color: 'orange' },
    { value: 'design_review', label: '디자인 검토', color: 'purple' },
    { value: 'design_approved', label: '디자인 승인', color: 'green' },
    { value: 'in_production', label: '제작중', color: 'blue' },
    { value: 'quality_check', label: '품질 검수', color: 'indigo' },
    { value: 'shipped', label: '배송중', color: 'teal' },
    { value: 'delivered', label: '배송 완료', color: 'green' },
    { value: 'cancelled', label: '취소', color: 'red' }
  ]

  const getPaymentStatusDisplay = (status) => {
  const paymentStatusOptions = {
    'paid': { label: '결제완료', color: 'bg-green-100 text-green-800' },
    'in_cart': { label: '장바구니', color: 'bg-gray-100 text-gray-800' },
    'failed': { label: '결제실패', color: 'bg-red-100 text-red-800' },
    'refunded': { label: '환불완료', color: 'bg-blue-100 text-blue-800' },
    'pending': { label: '결제대기', color: 'bg-yellow-100 text-yellow-800' }
  }
  
  return paymentStatusOptions[status] || paymentStatusOptions['pending']
}

  // Fetch orders from Supabase
  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group orders by group_order_id
      const groupedOrders = groupOrdersByGroupId(data)
      setOrders(groupedOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('주문 데이터를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  // Group individual order items by group_order_id
  const groupOrdersByGroupId = (orderData) => {
    const grouped = {}
    
    orderData.forEach(order => {
      if (!grouped[order.group_order_id]) {
        grouped[order.group_order_id] = {
          group_order_id: order.group_order_id,
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          customer_phone: order.customer_phone,
          order_date: order.order_date.split('T')[0], // Format date
          payment_status: order.payment_status,
          shipping_address: order.shipping_address,
          special_instructions: order.special_instructions,
          packaging_number: order.packaging_number, // Add packaging number
          total_order_amount: 0,
          items: []
        }
      }
      
      // Add item to the group
      grouped[order.group_order_id].items.push({
        order_id: order.order_id,
        product_name: order.product_name,
        product_type: order.product_type,
        quantity: order.quantity,
        unit_price: order.unit_price,
        total_amount: order.total_amount,
        order_status: order.order_status,
        customization_data: order.customization_data || {},
        design_revisions: order.design_revisions || 0
      })
      
      // Update total order amount
      grouped[order.group_order_id].total_order_amount += parseFloat(order.total_amount)
    })
    
    return Object.values(grouped)
  }

  // Update order status
  const handleStatusUpdate = async (itemOrderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          order_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('order_id', itemOrderId)

      if (error) throw error

      // Refresh orders after update
      await fetchOrders()
      
      // Update selected order if it's currently open
      if (selectedOrder) {
        const updatedOrder = orders.find(order => 
          order.items.some(item => item.order_id === itemOrderId)
        )
        if (updatedOrder) {
          setSelectedOrder(updatedOrder)
        }
      }
      
      alert(`주문 ${itemOrderId} 상태가 성공적으로 변경되었습니다.`)
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('상태 변경 중 오류가 발생했습니다.')
    }
  }

  // Load orders on component mount
  useEffect(() => {
    fetchOrders()
  }, [])

    useEffect(() => {
    console.log('🔄 selectedImage state changed:', selectedImage)
  }, [selectedImage])

  const getStatusBadge = (status) => {
    const statusInfo = statusOptions.find(s => s.value === status) || statusOptions[0]
    const colorClasses = {
      gray: 'bg-gray-100 text-gray-800',
      blue: 'bg-blue-100 text-blue-800', 
      yellow: 'bg-yellow-100 text-yellow-800',
      orange: 'bg-orange-100 text-orange-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      teal: 'bg-teal-100 text-teal-800',
      red: 'bg-red-100 text-red-800'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClasses[statusInfo.color]}`}>
        {statusInfo.label}
      </span>
    )
  }

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      order.group_order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter
    const matchesStatus = selectedStatus === 'all' || 
      order.items.some(item => item.order_status === selectedStatus)

    return matchesSearch && matchesStatus
  })

  const handleExcelDownload = async () => {
    try {
      // Simple CSV export (you can enhance this to proper Excel)
      const csvContent = generateCSV(filteredOrders)
      downloadCSV(csvContent, `orders_${new Date().toISOString().split('T')[0]}.csv`)
    } catch (error) {
      console.error('Error generating Excel:', error)
      alert('엑셀 다운로드 중 오류가 발생했습니다.')
    }
  }
    const handleBulkImageDownload = async () => {
    try {
        // Find all items with images
        const itemsWithImages = []
        
        filteredOrders.forEach(order => {
        order.items.forEach(item => {
            if (hasUserImage(item)) {
            itemsWithImages.push({
                item,
                order,
                imageUrl: getUserImageUrl(item)
            })
            }
        })
        })

        if (itemsWithImages.length === 0) {
        alert('다운로드할 이미지가 없습니다.')
        return
        }

        const confirmed = confirm(`${itemsWithImages.length}개의 이미지를 다운로드하시겠습니까?`)
        if (!confirmed) return

        console.log(`🔄 Starting bulk download of ${itemsWithImages.length} images`)

        // Download each image with a small delay to avoid browser blocking
        for (let i = 0; i < itemsWithImages.length; i++) {
        const { item, order, imageUrl } = itemsWithImages[i]
        
        try {
            console.log(`📥 Downloading image ${i + 1}/${itemsWithImages.length}: ${order.customer_name}`)
            
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            
            // Create filename: CustomerName_PackagingNumber_ProductName_OrderID
            const filename = `${order.packaging_number}_${order.customer_name}.jpg`
            link.download = filename
            
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            
            // Small delay to prevent browser from blocking multiple downloads
            if (i < itemsWithImages.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500))
            }
            
        } catch (error) {
            console.error(`Error downloading image for ${order.customer_name}:`, error)
        }
        }
        
        alert(`${itemsWithImages.length}개 이미지 다운로드가 완료되었습니다.`)
        
    } catch (error) {
        console.error('Error in bulk image download:', error)
        alert('이미지 일괄 다운로드 중 오류가 발생했습니다.')
    }
    }

  const generateCSV = (orders) => {
    const headers = [
      '주문번호', '포장번호', '주문일', '고객명', '고객이메일', '고객전화번호', 
      '상품명', '수량', '단가', '총액', '주문상태', '결제상태', '배송주소'
    ]
    
    let csvContent = headers.join(',') + '\n'
    
    orders.forEach(order => {
      order.items.forEach(item => {
        const row = [
          order.group_order_id,
          order.packaging_number || '',
          order.order_date,
          order.customer_name,
          order.customer_email,
          order.customer_phone,
          item.product_name,
          item.quantity,
          item.unit_price,
          item.total_amount,
          statusOptions.find(s => s.value === item.order_status)?.label || item.order_status,
          getPaymentStatusDisplay(order.payment_status).label,
          `"${order.shipping_address}"`
        ]
        csvContent += row.join(',') + '\n'
      })
    })
    
    return csvContent
  }

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

// Helper function with debugging
const getUserImageUrl = (item) => {
  console.log('🔍 getUserImageUrl called with item:', item)
  console.log('📝 customization_data:', item.customization_data)
  
  const imageUrl = item.customization_data?.userImage || null
  console.log('🌐 Retrieved imageUrl:', imageUrl)
  
  return imageUrl
}

// Helper function with debugging  
const hasUserImage = (item) => {
  const hasImage = !!(item.customization_data && item.customization_data.userImage)
  console.log('🖼️ hasUserImage check for item:', item.order_id, 'Result:', hasImage)
  return hasImage
}

const handleViewImage = (item, order) => {
  console.log('👀 handleViewImage called!')
  
  const imageUrl = getUserImageUrl(item)
  console.log('🔗 imageUrl:', imageUrl)
  
  if (imageUrl) {
    console.log('✅ Opening image in new tab')
    window.open(imageUrl, '_blank')
  } else {
    console.log('❌ No imageUrl found')
    alert('이미지를 찾을 수 없습니다.')
  }
}

  // Handle downloading user image
    const handleDownloadImage = async (item, order) => {
    const imageUrl = getUserImageUrl(item)
    if (!imageUrl) return

    try {
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        
        // Create filename from order info - now using order object
        const filename = `${order.packaging_number}_${order.customer_name}.jpg`
        link.download = filename
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error) {
        console.error('Error downloading image:', error)
        alert('이미지 다운로드 중 오류가 발생했습니다.')
    }
    }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-2xl font-bold text-gray-900">주문 관리</h3>
            <button 
              onClick={fetchOrders}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>새로고침</span>
            </button>
          </div>
            <button 
              onClick={handleBulkImageDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              disabled={loading}
            >
              <Image className="w-4 h-4" />
              <span>이미지 일괄 다운로드</span>
            </button>
          <button 
            onClick={handleExcelDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={loading}
          >
            <Download className="w-4 h-4" />
            <span>엑셀 다운로드</span>
          </button>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="주문번호, 고객명, 이메일로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2 text-gray-600">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>주문 데이터를 불러오는 중...</span>
            </div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주문 정보</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">포장 번호</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고객 정보</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품 내역</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결제상태</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    {orders.length === 0 ? '주문 데이터가 없습니다.' : '검색 결과가 없습니다.'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.group_order_id} className="hover:bg-gray-50">
                    {/* Order Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="text-gray-500">{order.order_date}</div>
                        <div className="text-green-600 font-semibold">₩{order.total_order_amount.toLocaleString()}</div>
                      </div>
                    </td>
                    
                    {/* Packaging Number */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-left justify-left">
                        <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                          {order.packaging_number || '?'}
                        </div>
                      </div>
                    </td>
                    
                    {/* Customer Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{order.customer_name}</div>
                        <div className="text-gray-500">{order.customer_email}</div>
                        <div className="text-gray-500">{order.customer_phone}</div>
                      </div>
                    </td>
                    
                    {/* Products */}
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-lg p-2">
                            <div className="flex-1">
                              <span className="text-gray-900 font-medium">{item.product_name} x{item.quantity}</span>
                              <div className="text-gray-500 text-xs">₩{parseFloat(item.total_amount).toLocaleString()}</div>
                            </div>
                            
                            {/* Image Actions for this specific item */}
                            {hasUserImage(item) && (
                              <div className="flex space-x-1 ml-2">
                                <button 
                                  onClick={() => handleViewImage(item, order)}
                                  className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50"
                                  title="이미지 보기"
                                >
                                  <Image className="w-3 h-3" />
                                </button>
                                <button 
                                onClick={() => handleDownloadImage(item, order)}
                                className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                                title="이미지 다운로드"
                                >
                                <Download className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                    
                    {/* Payment Status - REPLACED the old Status column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        <span className={`px-3 py-2 rounded-full text-sm font-medium ${getPaymentStatusDisplay(order.payment_status).color}`}>
                          {getPaymentStatusDisplay(order.payment_status).label}
                        </span>
                      </div>
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedOrder(null)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Modal Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    주문 상세 정보 - {selectedOrder.group_order_id}
                  </h3>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">고객 정보</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">이름:</span> {selectedOrder.customer_name}</div>
                      <div><span className="font-medium">이메일:</span> {selectedOrder.customer_email}</div>
                      <div><span className="font-medium">전화번호:</span> {selectedOrder.customer_phone}</div>
                      <div><span className="font-medium">배송주소:</span> {selectedOrder.shipping_address}</div>
                      {selectedOrder.special_instructions && (
                        <div><span className="font-medium">특별 요청사항:</span> {selectedOrder.special_instructions}</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">주문 요약</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">주문일:</span> {selectedOrder.order_date}</div>
                      <div><span className="font-medium">결제상태:</span> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getPaymentStatusDisplay(selectedOrder.payment_status).color}`}>
                        {getPaymentStatusDisplay(selectedOrder.payment_status).label}
                        </span>
                      </div>
                      <div><span className="font-medium">총 금액:</span> ₩{selectedOrder.total_order_amount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">주문 상품 목록</h4>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-medium text-gray-900">{item.product_name}</h5>
                            <p className="text-sm text-gray-600">수량: {item.quantity} | 단가: ₩{item.unit_price.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">₩{item.total_amount.toLocaleString()}</div>
                            {getStatusBadge(item.order_status)}
                          </div>
                        </div>
                        
                        {/* Customization Data */}
                        <div className="bg-blue-50 rounded p-3 mb-3">
                          <h6 className="font-medium text-sm text-gray-900 mb-2">커스터마이징 정보</h6>
                          <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                            {JSON.stringify(item.customization_data, null, 2)}
                          </pre>
                        </div>
                        
                        {/* Status Update */}
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            디자인 수정 횟수: {item.design_revisions}회
                          </div>
                          <select 
                            value={item.order_status}
                            className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => handleStatusUpdate(item.order_id, e.target.value)}
                          >
                            {statusOptions.filter(s => s.value !== 'all').map(status => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-3 sm:flex sm:flex-row-reverse">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  닫기
                </button>
                <button
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // TODO: Implement save changes functionality
                    alert('변경사항이 저장될 예정입니다.')
                  }}
                >
                  변경사항 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}