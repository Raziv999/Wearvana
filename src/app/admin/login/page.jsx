'use client'

import { Suspense, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react'

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const from         = searchParams.get('from') ?? '/admin'

  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const inputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!password) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()

      if (res.ok) {
        router.replace(from)
      } else {
        setError(data.error ?? 'Incorrect password.')
        setPassword('')
        inputRef.current?.focus()
      }
    } catch {
      setError('Could not connect. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          ref={inputRef}
          type={show ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter admin password"
          autoFocus
          className="w-full bg-[#1C1C1C] border border-[#242424] text-[#F4F4F4] font-body text-sm px-4 py-3.5 pr-12 placeholder-[#525252] focus:outline-none focus:border-[#C0231E] transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#525252] hover:text-[#909090] transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>

      {error && (
        <p className="font-body text-[#C0231E] text-xs tracking-wide">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        className="w-full flex items-center justify-center gap-2 bg-[#C0231E] hover:bg-[#D4251F] disabled:bg-[#1C1C1C] disabled:text-[#525252] text-white font-body font-bold text-xs tracking-[0.18em] uppercase py-4 transition-all duration-200"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : 'Enter Dashboard'}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-[#C0231E]/30 bg-[#C0231E]/10 mb-5">
            <Lock size={20} className="text-[#C0231E]" />
          </div>
          <h1 className="font-heading font-black text-[#F4F4F4] text-3xl uppercase tracking-tight">
            Wearvana
          </h1>
          <p className="font-body text-[#525252] text-xs tracking-[0.2em] uppercase mt-1">
            Admin Access
          </p>
        </div>

        <Suspense fallback={<div className="h-32 bg-[#1C1C1C] animate-pulse" />}>
          <LoginForm />
        </Suspense>

      </div>
    </div>
  )
}
