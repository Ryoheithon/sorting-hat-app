import { createServerSupabaseClient } from '@/lib/supabase'
import { nameSchema, HogwartsHouse } from '@/types'
import { NextRequest, NextResponse } from 'next/server'

/**
 * 組み分けAPIエンドポイント
 * ユーザー名を受け取り、12名未満の寮からランダムに寮を選んで結果を保存します
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディをJSONとして解析
    const body = await request.json()
    
    // スキーマ検証
    const result = nameSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: '名前は2文字以上20文字以下である必要があります' }, 
        { status: 400 }
      )
    }

    const { name } = result.data
    
    // Supabaseクライアントを初期化
    const supabase = createServerSupabaseClient()
    
    // 各寮の現在のメンバー数を取得
    const { data: houseCounts, error: countError } = await supabase
      .from('sorting_results')
      .select('house')
    
    if (countError) {
      console.error('寮のカウント取得エラー:', countError)
      return NextResponse.json(
        { error: 'データベースエラーが発生しました' },
        { status: 500 }
      )
    }
    
    // 各寮のメンバー数を集計
    const counts: Record<HogwartsHouse, number> = {
      Gryffindor: 0,
      Hufflepuff: 0,
      Ravenclaw: 0,
      Slytherin: 0
    }
    
    houseCounts?.forEach(item => {
      if (item.house in counts) {
        counts[item.house as HogwartsHouse] += 1
      }
    })
    
    // 12名未満の寮だけを選択肢に入れる
    const availableHouses: HogwartsHouse[] = Object.entries(counts)
      .filter(([, count]) => count < 12)
      .map(([house]) => house as HogwartsHouse)
    
    // 全ての寮が12名に達している場合はエラーを返す
    if (availableHouses.length === 0) {
      return NextResponse.json(
        { error: '全ての寮がいっぱいです。管理者に連絡してください。' },
        { status: 400 }
      )
    }
    
    // 利用可能な寮からランダムに選択
    const house = availableHouses[Math.floor(Math.random() * availableHouses.length)]
    
    // Supabaseに結果を保存
    const { data, error } = await supabase
      .from('sorting_results')
      .insert({ name, house })
      .select()
      .single()
    
    if (error) {
      console.error('Supabase挿入エラー:', error)
      return NextResponse.json(
        { error: 'データベースエラーが発生しました' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: {
        name,
        house,
        id: data.id,
        created_at: data.created_at
      }
    })
    
  } catch (error) {
    console.error('予期しないエラー:', error)
    return NextResponse.json(
      { error: '予期しないエラーが発生しました' },
      { status: 500 }
    )
  }
}