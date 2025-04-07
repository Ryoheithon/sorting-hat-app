'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { nameSchema } from '@/types'

type FormState = {
  name: string
  error: string | null
  isSubmitting: boolean
}

export default function NameForm() {
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>({
    name: '',
    error: null,
    isSubmitting: false
  })

  const { name, error, isSubmitting } = formState

  const setName = (name: string) => {
    setFormState(prev => ({ ...prev, name, error: null }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // 入力値の検証
      nameSchema.parse({ name })
      
      // 送信中状態に設定
      setFormState(prev => ({ ...prev, isSubmitting: true, error: null }))
      
      // APIリクエスト
      const response = await fetch('/api/sorting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || '組み分け中にエラーが発生しました')
      }
      
      // 成功した場合は結果ページに遷移
      router.push(`/result?id=${data.data.id}`)
      
    } catch (err) {
      // zod検証エラー
      if (err instanceof z.ZodError) {
        setFormState(prev => ({
          ...prev,
          error: 'お名前は2文字以上20文字以下で入力してください',
          isSubmitting: false
        }))
      } 
      // API/その他のエラー
      else {
        const errorMessage = err instanceof Error 
          ? err.message 
          : '予期しないエラーが発生しました'
          
        setFormState(prev => ({
          ...prev,
          error: errorMessage,
          isSubmitting: false
        }))
      }
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.form 
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 border border-amber-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-bold mb-2 text-gray-700">
            きみの名前を教えておくれ。
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-700"
            disabled={isSubmitting}
            placeholder="あなたの名前を入力してください"
            autoComplete="off"
          />
          {error && (
            <motion.p 
              className="text-red-500 text-xs italic mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
        </div>
        
        <div className="flex items-center justify-center">
          <motion.button
            type="submit"
            className={`bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? '組み分け中...' : '組み分けを始める'}
          </motion.button>
        </div>
      </motion.form>
    </div>
  )
}