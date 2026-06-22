'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Eye, EyeOff, ArrowRight,
  Mail, Lock, AlertCircle
} from 'lucide-react'

// ============ INPUT FIELD COMPONENT ============
function InputField({
  label, type, value, onChange,
  placeholder, icon, error, toggle, onToggle
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-sable-text">{label}</label>
      <div className="relative">
        {/* Left Icon */}
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: error ? 'var(--red)' : 'var(--faint)' }}
        >
          {icon}
        </div>

        {/* Input */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input pl-10 pr-10"
          style={{
            borderColor: error ? 'var(--red)' : undefined,
            boxShadow: error ? '0 0 0 3px rgba(255,107,107,0.15)' : undefined,
          }}
        />

        {/* Right Toggle (password) */}
        {toggle !== undefined && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 btn-icon p-0"
            style={{ color: 'var(--faint)' }}
          >
            {toggle ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs"
          style={{ color: 'var(--red)' }}
        >
          <AlertCircle size={12} />
          {error}
        </motion.div>
      )}
    </div>
  )
}

// ============ MAIN LOGIN PAGE ============
export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // ---- Validation ----
  function validate() {
    const e = {}
    if (!form.email.trim())               e.email    = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password)                   e.password = 'Password is required'
    else if (form.password.length < 6)    e.password = 'Password must be 6+ characters'
    return e
  }

  // ---- Submit ----
  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    // TODO: hook up Supabase auth here later
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)

    // Placeholder — will redirect to /app after auth
    setSubmitError('Auth not connected yet — coming soon!')
  }

  function handleChange(field) {
    return (e) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }))
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div
      className="min-h-screen flex-center relative overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Background Glows */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(155,109,255,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,110,180,0.07) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-4"
      >
        <div
          className="glass rounded-sable-lg p-8"
          style={{ border: '1px solid var(--border)' }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-12 h-12 rounded-sable-lg flex-center text-white font-black text-xl mb-4"
              style={{
                background: 'linear-gradient(135deg, var(--purple), var(--pink))',
                boxShadow: '0 0 24px rgba(155,109,255,0.4)',
              }}
            >
              S
            </div>
            <h1 className="text-2xl font-black">Welcome back</h1>
            <p className="text-sable-muted text-sm mt-1">
              Sign in to your SableSync account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <InputField
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              error={errors.email}
            />

            <InputField
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
              icon={<Lock size={16} />}
              error={errors.password}
              toggle={showPass}
              onToggle={() => setShowPass(p => !p)}
            />

            {/* Forgot Password */}
            <div className="flex justify-end -mt-2">
              
                href="#"
                className="text-xs font-medium"
                style={{ color: 'var(--purple)' }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Error */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-sable text-sm"
                style={{
                  background: 'rgba(255,107,107,0.1)',
                  border: '1px solid rgba(255,107,107,0.2)',
                  color: 'var(--red)',
                }}
              >
                <AlertCircle size={14} />
                {submitError}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full mt-2"
              style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin"
                    width="16" height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider-text my-6">or</div>

          {/* OAuth Placeholder */}
          <button
            className="btn btn-ghost w-full gap-3"
            onClick={() => setSubmitError('OAuth coming soon!')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-sable-muted mt-6">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-semibold"
              style={{ color: 'var(--purple)' }}
            >
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
