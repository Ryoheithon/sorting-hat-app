'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { type SortingResult, houseJapaneseNames, houseColors } from '@/types'

export default function SortingHistory() {
  const [history, setHistory] = useState<SortingResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  // 履歴を取得する関数
  const fetchHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sorting-history')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '履歴の取得に失敗しました')
      }

      setHistory(data.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching history:', err)
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  // 履歴を削除する関数
  const deleteHistoryItem = async (id: string) => {
    try {
      setDeleting(id)
      const response = await fetch(`/api/sorting-history/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '削除に失敗しました')
      }

      // 成功したら履歴を更新
      setHistory(prevHistory => prevHistory.filter(item => item.id !== id))
    } catch (err) {
      console.error('Error deleting history item:', err)
      alert('削除できませんでした: ' + (err instanceof Error ? err.message : '予期せぬエラーが発生しました'))
    } finally {
      setDeleting(null)
    }
  }

  // 初回ロード時に履歴を取得
  useEffect(() => {
    fetchHistory()
  }, [])

  if (loading && history.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
      </div>
    )
  }

  if (error && history.length === 0) {
    return (
      <div className="p-4 bg-red-100 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-gray-600">まだ組み分け結果がありません</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="bg-amber-700 text-white p-3 text-center font-bold">組み分け履歴</h3>
      {loading && (
        <div className="flex justify-center items-center py-2 bg-amber-50">
          <div className="animate-spin h-5 w-5 border-b-2 border-amber-700"></div>
          <span className="ml-2 text-sm text-amber-700">更新中...</span>
        </div>
      )}
      <div className="overflow-y-auto max-h-[400px]">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-amber-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">名前</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">寮</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">日時</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {history.map((item, index) => {
              const houseColor = houseColors[item.house]
              const isDeleting = deleting === item.id
              
              return (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-gray-600">{item.name}</td>
                  <td className="px-4 py-3">
                    <span 
                      className={`inline-block px-2 py-1 rounded-full text-align-center ${houseColor.primary} ${houseColor.secondary} text-xs font-semibold`}
                    >
                      {houseJapaneseNames[item.house]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(item.created_at).toLocaleString('ja-JP')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => {
                        if (confirm(`${item.name}さんの組み分け結果を削除しますか？`)) {
                          deleteHistoryItem(item.id)
                        }
                      }}
                      disabled={isDeleting}
                      className={`text-sm px-2 py-1 rounded ${
                        isDeleting 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      } transition-colors`}
                    >
                      {isDeleting ? '削除中...' : '削除'}
                    </button>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-amber-50 text-center">
        <button
          onClick={fetchHistory}
          disabled={loading}
          className={`text-sm px-3 py-1 rounded ${
            loading 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-amber-600 text-white hover:bg-amber-700'
          } transition-colors`}
        >
          {loading ? '更新中...' : '履歴を更新'}
        </button>
      </div>
    </div>
  )
}