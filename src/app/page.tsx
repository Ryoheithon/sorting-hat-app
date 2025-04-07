import NameForm from '@/components/name-form'
import SortingHat from '@/components/sorting-hat'
import SortingHistory from '@/components/sorting-history'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-16 bg-gradient-to-b from-amber-50 to-amber-200">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl md:text-6xl font-bold text-amber-800 mb-4">
          さあ、組み分けの時です！
        </h1>
        
        <p className="text-lg md:text-xs text-amber-700 mb-8 max-w-2xl">
          フルネームを入力して、長谷川魔法学校の寮に組み分けされよう！
          あなたはグリフィンドール、ハッフルパフ、レイブンクロー、スリザリンのどの寮に組み分けられるでしょうか？
        </p>
        
        <SortingHat />
        
        <div className="mt-6 w-full max-w-md">
          <NameForm />
        </div>
        
        <div className="mt-16 w-full max-w-2xl">
          <SortingHistory />
        </div>
      </div>
    </main>
  )
}