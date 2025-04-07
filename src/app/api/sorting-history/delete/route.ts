import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function DELETE(request: NextRequest) {
  try {
    // IDをURLのクエリパラメータから取得
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: '削除するIDが指定されていません' },
        { status: 400 }
      )
    }
    
    // Supabaseクライアントを初期化
    const supabase = createServerSupabaseClient()
    
    // 指定されたIDのレコードを削除
    const { error } = await supabase
      .from('sorting_results')
      .delete()
      .eq('id', id)
      
    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json(
        { error: 'データの削除に失敗しました' },
        { status: 500 }
      )
    }
    
    // 削除成功
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    )
  }
}