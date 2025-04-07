import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    // Supabaseクライアントを初期化
    const supabase = createServerSupabaseClient()
    
    // 組み分け結果を日時の降順で取得
    const { data, error } = await supabase
      .from('sorting_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50) // 最新の50件を取得
      
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'データの取得に失敗しました' }, { status: 500 })
    }
    
    // 成功した場合、結果を返す
    return NextResponse.json({ success: true, data })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: '予期せぬエラーが発生しました' }, { status: 500 })
  }
}