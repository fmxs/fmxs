'use client'

import { Lock } from 'lucide-react'
import { useEffect, useCallback } from 'react'

interface LoginModalProps {
  isOpen?: boolean
  onClose?: () => void
  onLogin?: () => void
}

export default function LoginModal({ isOpen = false, onClose, onLogin }: LoginModalProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose?.()
  }, [onClose])

  useEffect(() => {
    if (isOpen) document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose?.()} className="absolute inset-0 bg-on-surface/40 backdrop-blur-md transition-opacity duration-300 cursor-pointer" tabIndex={-1} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all">
        {/* Icon */}
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="text-primary w-8 h-8" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-on-surface text-center mb-2">
          需要身份认证
        </h2>

        {/* Description */}
        <p className="text-base text-on-surface-variant text-center mt-2 mb-6">
          当前访问内容需要识别账号、部门、权限或 Token 额度。
        </p>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={onLogin}
            autoFocus
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:scale-95"
          >
            模拟企业登录
          </button>
          <button
            onClick={onClose}
            className="w-full bg-surface-container-low text-on-surface-variant py-3 rounded-xl font-medium transition-colors hover:-translate-y-0.5 hover:bg-surface-container"
          >
            暂不登录
          </button>
        </div>

        {/* Footer */}
        <p className="text-xs text-outline text-center mt-6">
          © {new Date().getFullYear()} NeuralCore Enterprise AI. 仅供内部演示使用。
        </p>
      </div>
    </div>
  )
}