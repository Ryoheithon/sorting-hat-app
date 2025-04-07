'use client'

import { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  ContactShadows,
  useAnimations
} from '@react-three/drei'
import { motion } from 'framer-motion'
import * as THREE from 'three'

/**
 * 3Dモデルを使った組み分け帽子コンポーネント
 * マウスの動きに合わせて向きが変わり、クリックすると反応します
 */
function SortingHatModel(props: any) {
  const groupRef = useRef<THREE.Group>(null!)
  const { mouse } = useThree()
  
  // GLBモデルをロード
  const { scene, animations } = useGLTF('/models/sorting-hat.glb')
  const { actions, mixer } = useAnimations(animations, scene)
  
  // マウスに追従する動きを設定
  useFrame((state) => {
    if (groupRef.current) {
      // マウス位置を-1〜1の範囲から適切な回転角度に変換
      const targetRotationX = mouse.y * 0.5 // 上下の動き（ピッチ）
      const targetRotationY = mouse.x * 0.8 // 左右の動き（ヨー）
      
      // 初期回転値（Y軸90度）を維持しながら、マウス移動による回転を加える
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX,
        0.0
      )
      
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        Math.PI / 4 + targetRotationY, // 90度（π/2ラジアン）右回転 + マウス動き
        0
      )
      
      // 軽く呼吸するような上下の動き
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.2 + props.positionY
    }
  })

  // モデルのマテリアルを設定
  useEffect(() => {
    // モデルのマテリアルを調整
    scene.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        // マテリアルの調整が必要な場合はここで行う
        if (node.material) {
          // 必要に応じてマテリアルの設定を調整
          node.material.roughness = 0.7
          node.material.metalness = 0.2
          node.castShadow = true
          node.receiveShadow = true
        }
      }
    })
    
    // アニメーションがあれば再生
    if (actions && Object.keys(actions).length > 0) {
      // 最初のアニメーションを再生する
      const firstAction = Object.values(actions)[0]
      if (firstAction) {
        firstAction.play()
      }
    }

    // 初期回転を設定（Y軸90度右回転）
    if (groupRef.current) {
      groupRef.current.rotation.y = 0
    }
  }, [scene, actions])

  return (
    <group ref={groupRef} {...props}>
      <primitive 
        object={scene} 
        scale={props.scale || 0.8} 
        position={props.position || [0, 0, 0]}
        rotation={[0, 4.6, 0]}
      />
    </group>
  )
}

export default function SortingHat() {
  const [hasClicked, setHasClicked] = useState(false)
  const [modelScale, setModelScale] = useState(2.0) // スケールを小さく調整
  const [positionY, setPositionY] = useState(0) // 位置を調整

  // クリックハンドラ
  const handleCanvasClick = () => {
    setHasClicked(true)
    // クリックエフェクト（拡大）
    setModelScale(prev => prev * 1.1)
    
    // 少し時間をおいて状態をリセット（連続クリックを可能にする）
    setTimeout(() => {
      setHasClicked(false)
      setModelScale(1.6) // 元のスケールに戻す
    }, 500)
  }

  // GLBモデルを事前に読み込む
  useGLTF.preload('/models/sorting-hat.glb')

  return (
    <motion.div 
      className="relative w-80 h-80 mx-auto my-6 cursor-pointer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      onClick={handleCanvasClick}
    >
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 6], fov: 40 }} // カメラ位置とFOVを調整
        onClick={(e) => e.stopPropagation()}
      >
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[5, 10, 7.5]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        <SortingHatModel 
          scale={modelScale}
          positionY={positionY}
          position={[0, positionY, 0]} // 位置を調整
        />
        <ContactShadows 
          position={[0, -1.8, 0]} // 影の位置も調整
          opacity={0.4}
          scale={5}
          blur={2.5}
        />
        <Environment preset="sunset" />
      </Canvas>
      
      {/* 帽子からのメッセージ */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <p className="text-amber-800 font-semibold italic">
          "さあ、どの寮にしようかな...?"
        </p>
      </motion.div>
    </motion.div>
  )
}