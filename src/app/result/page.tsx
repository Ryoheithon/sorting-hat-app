'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import SortingResultDisplay from '@/components/sorting-result'

export default function ResultPage() {
  const searchParams = useSearchParams()
  const resultId = searchParams.get('id')

  if (!resultId) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-amber-200">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-amber-800 mb-4">エラー</h1>
          <p className="text-lg text-gray-700 mb-6">組み分け結果のIDが見つかりませんでした</p>
          <Link 
            href="/" 
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
          >
            トップに戻る
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-amber-50 to-amber-200">
      <div className="max-w-lg w-full">
        <SortingResultDisplay resultId={resultId} />
        
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
          >
            トップに戻る
          </Link>
        </div>
      </div>
    </main>
  )
}