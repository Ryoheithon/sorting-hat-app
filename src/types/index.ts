import { z } from 'zod'

// ハリーポッターの寮の型定義
export type HogwartsHouse = 'Gryffindor' | 'Hufflepuff' | 'Ravenclaw' | 'Slytherin'

// 日本語表記の寮名
export const houseJapaneseNames: Record<HogwartsHouse, string> = {
  Gryffindor: 'グリフィンドール',
  Hufflepuff: 'ハッフルパフ',
  Ravenclaw: 'レイブンクロー',
  Slytherin: 'スリザリン'
}

// 寮のカラー
export const houseColors: Record<HogwartsHouse, { primary: string; secondary: string }> = {
  Gryffindor: { primary: 'bg-red-700', secondary: 'text-yellow-400' },
  Hufflepuff: { primary: 'bg-yellow-400', secondary: 'text-black' },
  Ravenclaw: { primary: 'bg-blue-800', secondary: 'text-gray-300' },
  Slytherin: { primary: 'bg-green-700', secondary: 'text-gray-200' }
}

// フォーム入力のバリデーション
export const nameSchema = z.object({
  name: z.string().min(1, '名前を入力してください').max(50, '名前は50文字以内で入力してください')
})

export type NameFormData = z.infer<typeof nameSchema>

// Supabaseに保存する組み分け結果の型
export type SortingResult = {
  id: string
  name: string
  house: HogwartsHouse
  created_at: string
}