'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import ToolsGrid from '@/components/ToolsGrid'
import Footer from '@/components/Footer'
import LoginModal from '@/components/LoginModal'

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false)
    } else {
      setShowLoginModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header isLoggedIn={isLoggedIn} onAuthClick={handleAuthClick} />
      <main className="mt-28 max-w-[1440px] mx-auto px-10 pb-20 space-y-8">
        <HeroSection />
        <ToolsGrid />
      </main>
      <Footer />
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={() => {
          setIsLoggedIn(true)
          setShowLoginModal(false)
        }}
      />
    </div>
  )
}