'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { type SortingResult, houseJapaneseNames, houseColors } from '@/types'

/**
 * 組み分け結果表示コンポーネント
 * 指定されたIDの組み分け結果を取得して表示します
 */
interface SortingResultProps {
  resultId: string
}

export default function SortingResultDisplay({ resultId }: SortingResultProps) {
  const [result, setResult] = useState<SortingResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 早期リターンによるガード
    if (!resultId) {
      setError('結果IDが指定されていません')
      setIsLoading(false)
      return
    }

    const fetchResult = async () => {
      try {
        const response = await fetch(`/api/sorting-history`)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `サーバーエラー: ${response.status}`)
        }

        const data = await response.json()

        // 特定のIDに一致する結果を見つける
        const foundResult = data.data.find((item: SortingResult) => item.id === resultId)
        
        if (!foundResult) {
          throw new Error('組み分け結果が見つかりませんでした')
        }
        
        setResult(foundResult)
      } catch (err) {
        console.error('Error fetching result:', err)
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResult()
  }, [resultId])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-700"></div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="text-center p-6 bg-red-100 rounded-lg">
        <h2 className="text-xl font-bold text-red-800 mb-2">エラー</h2>
        <p className="text-red-600">{error || '不明なエラーが発生しました'}</p>
        <Link href="/" className="mt-4 inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">
          トップに戻る
        </Link>
      </div>
    )
  }

  const houseColor = houseColors[result.house]
  const houseJapaneseName = houseJapaneseNames[result.house]

  return (
    <motion.div 
      className={`p-8 rounded-lg shadow-lg ${houseColor.primary} ${houseColor.secondary} text-center max-w-md mx-auto`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-2xl font-bold mb-1"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        {result.name}
      </motion.h2>
      
      <motion.p
        className="text-sm mb-6 opacity-80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {new Date(result.created_at).toLocaleString('ja-JP')}
      </motion.p>
      
      <motion.div
        className="border-t border-b border-current py-4 my-4"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <h3 className="text-4xl font-bold mb-2">{houseJapaneseName}</h3>
          <p className="text-xl">{result.house}</p>
        </motion.div>
      </motion.div>
      
      <motion.p
        className="mt-6 text-lg italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.5 }}
      >
        "君は{houseJapaneseName}で素晴らしい魔法使いになるだろう！さあ、この寮の色のサイリウムを取りたまえ。"
      </motion.p>
    </motion.div>
  )
}