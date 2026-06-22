'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Eye, EyeOff, ArrowRight,
  Mail, Lock, User, AtSign, AlertCircle, Check
} from 'lucide-react'

// ============ PASSWORD STRENGTH ============
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' }
  let score = 0
  if (password.length >= 8)                    score++
  if (/[A-Z]/.test(password))                  score++
  if (/[0-9]/.test(password))                  score++
  if (/[^A-Za-z0-9]/.test(password))           score++

  const levels = [
    { score: 0, label: '',          color: 'transparent'    },
    { score: 1, label: 'Weak',      color: 'var(--red)'     },
    { score: 2, label: 'Fair',      color: 'var(--yellow)'  },
    { score: 3, label: 'Good',      color: 'var(--blue)'    },
    { score: 4, label: 'Strong',    color: 'var(--green)'   },
  ]
  return levels[score]
}

// ============ PASSWORD REQUIREMENTS ============
function PasswordRequirements({ password }) {
  const reqs = [
    { label: '8+ characters',          met: password.length >= 8            },
    { label: 'One uppercase letter',    met: /[A-Z]/.test(password)          },
    { label: 'One number',             met: /[0-9]/.test(password)          },
    { label: 'One special character',  met: /[^A-Za-z0-9]/.test(password)   },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="flex flex-col gap-1 mt-1"
    >
      {reqs.map((r, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div
            className="w-4 h-4 rounded-full flex-center flex-shrink-0 transition-all"
            style={{
              background: r.met ? 'rgba(105,219,124,0.2)' : 'var(--hover)',
              border: `1px solid ${r.met ? 'var(--green)' : 'var(--border)'}`,
            }}
          >
            {r.met && <Check size={10} style={{ color: 'var(--green)' }} />}
          </div>
          <span style={{ color: r.met ? 'var(--green)' : 'var(--muted)' }}>
            {r.label}
          </span>
        </div>
      ))}
    </motion.div>
  )
}

// ============ INPUT FIELD ============
function InputField({
  label, type, value, onChange,
  placeholder, icon, error, toggle,
  onToggle, hint
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-sable-text">{label}</label>
      <div className="relative">
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: error ? 'var(--red)' : 'var(--faint)' }}
        >
          {icon}
        </div>

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="input pl-10 pr-10"
          style={{
            borderColor: error ? 'var(--red)' : undefined,
            boxShadow:   error ? '0 0 0 3px rgba(255,107,107,0.15)' : undefined,
          }}
        />

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

      {hint && !error && (
        <p className="text-xs" style={{ color: 'var(--faint)' }}>{hint}</p>
      )}

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

// ============ STEP INDICATOR ============
function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="h-1 rounded-full transition-all duration-300"
          style={{
            flex: i === current ? 2 : 1,
            background: i <= current
              ? 'linear-gradient(90deg, var(--purple), var(--pink))'
              : 'var(--border)',
          }}
        />
      ))}
    </div>
  )
}

// ============ MAIN REGISTER PAGE ============
export default function RegisterPage() {
  const [step, setStep]       = useState(0)
  const [form, setForm]       = useState({
    username: '', displayName: '',
    email: '', password: '', confirmPassword: '',
    agreed: false,
  })
  const [errors, setErrors]   = useState({})
  const [showPass, setShowPass]         = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const [loading, setLoading]           = useState(false)
  const [submitError, setSubmitError]   = useState('')

  const strength = getPasswordStrength(form.password)

  // ---- Per-step validation ----
  function validateStep(s) {
    const e = {}
    if (s === 0) {
      if (!form.displayName.trim())        e.displayName = 'Display name is required'
      else if (form.displayName.length < 2) e.displayName = 'Must be at least 2 characters'

      if (!form.username.trim())           e.username = 'Username is required'
      else if (form.username.length < 3)   e.username = 'Must be at least 3 characters'
      else if (!/^[a-z0-9_]+$/.test(form.username))
        e.username = 'Only lowercase letters, numbers, underscores'
    }
    if (s === 1) {
      if (!form.email.trim())              e.email    = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'

      if (!form.password)                  e.password = 'Password is required'
      else if (form.password.length < 8)   e.password = 'Password must be 8+ characters'

      if (!form.confirmPassword)           e.confirmPassword = 'Please confirm your password'
      else if (form.password !== form.confirmPassword)
        e.confirmPassword = 'Passwords do not match'

      if (!form.agreed)                    e.agreed = 'You must agree to the terms'
    }
    return e
  }

  function handleChange(field) {
    return (e) => {
      const val = field === 'agreed' ? e.target.checked : e.target.value
      setForm(prev => ({ ...prev, [field]: val }))
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  function handleNext(e) {
    e.preventDefault()
    const errs = validateStep(step)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(1)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')
    const errs = validateStep(1)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)

    // TODO: hook up Supabase auth here later
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setSubmitError('Auth not connected yet — coming soon!')
  }

  return (
    <div
      className="min-h-screen flex-center relative overflow-hidden py-8"
      style={{ background: 'var(--bg)' }}
    >
      {/* Background Glows */}
      <div
        className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(155,109,255,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
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
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-12 h-12 rounded-sable-lg flex-center text-white font-black text-xl mb-4"
              style={{
                background: 'linear-gradient(135deg, var(--purple), var(--pink))',
                boxShadow: '0 0 24px rgba(155,109,255,0.4)',
              }}
            >
              S
            </div>
            <h1 className="text-2xl font-black">Create account</h1>
            <p className="text-sable-muted text-sm mt-1">
              {step === 0 ? 'First, set up your identity' : 'Now secure your account'}
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator current={step} total={2} />

          {/* ---- STEP 0: Identity ---- */}
          {step === 0 && (
            <motion.form
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleNext}
              className="flex flex-col gap-5"
            >
              <InputField
                label="Display Name"
                type="text"
                value={form.displayName}
                onChange={handleChange('displayName')}
                placeholder="Your Name"
                icon={<User size={16} />}
                error={errors.displayName}
                hint="This is how others see you"
              />

              <InputField
                label="Username"
                type="text"
                value={form.username}
                onChange={handleChange('username')}
                placeholder="your_username"
                icon={<AtSign size={16} />}
                error={errors.username}
                hint="Lowercase, numbers and underscores only"
              />

              {/* Username Preview */}
              {form.username && !errors.username && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 p-3 rounded-sable text-sm"
                  style={{
                    background: 'rgba(155,109,255,0.08)',
                    border: '1px solid rgba(155,109,255,0.2)',
                  }}
                >
                  <Check size={14} style={{ color: 'var(--green)' }} />
                  <span style={{ color: 'var(--muted)' }}>
                    Your profile will be{' '}
                    <span style={{ color: 'var(--purple)' }}>
                      @{form.username}
                    </span>
                  </span>
                </motion.div>
              )}

              <button type="submit" className="btn btn-primary w-full mt-2">
                Continue <ArrowRight size={16} />
              </button>
            </motion.form>
          )}

          {/* ---- STEP 1: Credentials ---- */}
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
            >
              <InputField
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                icon={<Mail size={16} />}
                error={errors.email}
              />

              <div className="flex flex-col gap-2">
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

                {/* Strength Bar */}
                {form.password && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[1,2,3,4].map(i => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{
                              background: i <= strength.score
                                ? strength.color
                                : 'var(--border)',
                            }}
                          />
                        ))}
                      </div>
                      <span
                        className="text-xs font-semibold w-12 text-right"
                        style={{ color: strength.color }}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <PasswordRequirements password={form.password} />
                  </motion.div>
                )}
              </div>

              <InputField
                label="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={handleChange('confirmPassword')}
                placeholder="••••••••"
                icon={<Lock size={16} />}
                error={errors.confirmPassword}
                toggle={showConfirm}
                onToggle={() => setShowConfirm(p => !p)}
              />

              {/* Terms */}
              <div className="flex flex-col gap-1">
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={form.agreed}
                      onChange={handleChange('agreed')}
                      className="sr-only"
                    />
                    <div
                      className="w-4 h-4 rounded flex-center transition-all"
                      style={{
                        background: form.agreed
                          ? 'linear-gradient(135deg, var(--purple), var(--pink))'
                          : 'var(--surface)',
                        border: `1px solid ${form.agreed ? 'transparent' : 'var(--border)'}`,
                      }}
                    >
                      {form.agreed && <Check size={10} color="white" />}
                    </div>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--muted)' }}>
                    I agree to the{' '}
                    <a href="#" style={{ color: 'var(--purple)' }}>Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" style={{ color: 'var(--purple)' }}>Privacy Policy</a>
                  </span>
                </label>
                {errors.agreed && (
                  <div
                    className="flex items-center gap-2 text-xs"
                    style={{ color: 'var(--red)' }}
                  >
                    <AlertCircle size={12} /> {errors.agreed}
                  </div>
                )}
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
                  <AlertCircle size={14} /> {submitError}
                </motion.div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => { setStep(0); setErrors({}) }}
                  className="btn btn-ghost flex-1"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
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
                      Creating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Create Account <ArrowRight size={16} />
                    </span>
                  )}
                </button>
              </div>
            </motion.form>
          )}

          {/* Sign In Link */}
          <p className="text-center text-sm text-sable-muted mt-6">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold"
              style={{ color: 'var(--purple)' }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
