'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function SortingHat() {
  const [modelScale, setModelScale] = useState(2.0) 

  // クリックハンドラ
  const handleCanvasClick = () => {
    // クリックエフェクト（拡大）
    setModelScale(prev => prev * 1.1)
    
    // 少し時間をおいて状態をリセット（連続クリックを可能にする）
    setTimeout(() => {
      setModelScale(1.6) // 元のスケールに戻す
    }, 500)
  }

  return (
    <motion.div 
      className="relative w-80 h-80 mx-auto my-6 cursor-pointer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      onClick={handleCanvasClick}
    >
      <div className="w-full h-full flex justify-center items-center bg-amber-100 rounded-full shadow-lg">
        <div className="w-3/4 h-3/4 bg-amber-800 rounded-t-full relative">
          {/* 帽子の基本形 */}
          <div className="absolute bottom-0 w-full h-10 bg-amber-900 border-t-2 border-amber-700"></div>
          
          {/* 帽子の装飾 */}
          <div className="absolute top-10 w-full flex justify-center">
            <div className="w-20 h-4 bg-amber-600 rotate-6"></div>
          </div>
          
          {/* 「顔」のような部分 */}
          <div className="absolute bottom-20 w-full flex justify-center">
            <div className="w-16 h-8 bg-amber-700 flex justify-between items-center px-2 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            </div>
          </div>
          
          {/* 「口」の部分 */}
          <div className="absolute bottom-12 w-full flex justify-center">
            <div className="w-10 h-2 bg-amber-900 rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* 帽子からのメッセージ */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <p className="text-amber-800 font-semibold italic">
          &ldquo;さあ、どの寮にしようかな...?&rdquo;
        </p>
      </motion.div>
    </motion.div>
  )
}