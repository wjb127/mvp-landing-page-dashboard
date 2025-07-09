'use client'

import { CheckCircle, XCircle } from 'lucide-react'
import { Preorder } from '@/types/database'
import { getServiceDisplayName } from '@/lib/services'

interface RecentPreordersTableProps {
  data: Preorder[]
  selectedService?: string
}



export const RecentPreordersTable = ({ data, selectedService = 'all' }: RecentPreordersTableProps) => {
  const tableTitle = selectedService === 'all' 
    ? '최근 사전예약자' 
    : `${getServiceDisplayName(selectedService)} 최근 사전예약자`

  const emptyMessage = selectedService === 'all'
    ? '아직 사전예약자가 없습니다.'
    : `${getServiceDisplayName(selectedService)} 서비스의 사전예약자가 없습니다.`

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{tableTitle}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이메일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                서비스
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                마케팅 수신 동의
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                등록일
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((preorder) => (
              <tr key={preorder.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {preorder.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {getServiceDisplayName(preorder.service)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    {preorder.marketing_opt_in ? (
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    )}
                    {preorder.marketing_opt_in ? '동의' : '거부'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(preorder.created_at).toLocaleDateString('ko-KR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && (
        <div className="px-6 py-4 text-center text-gray-500">
          {emptyMessage}
        </div>
      )}
    </div>
  )
} 