import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: 'IDが指定されていません' },
        { status: 400 }
      )
    }
    
    const supabase = createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('sorting_results')
      .select('*')
      .eq('id', id)
      .single()
      
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'データの取得に失敗しました' },
        { status: 500 }
      )
    }
    
    if (!data) {
      return NextResponse.json(
        { error: '指定されたIDの結果が見つかりませんでした' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true, data })
    
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: '予期せぬエラーが発生しました' },
      { status: 500 }
    )
  }
}