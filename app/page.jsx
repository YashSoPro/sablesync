'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MessageSquare, Users, Zap, Shield,
  Star, ArrowRight, Menu, X,
  Hash, Volume2, Video, Smile
} from 'lucide-react'

// ============ MOCK DATA ============
const FEATURES = [
  {
    icon: <MessageSquare size={24} />,
    title: 'Real-time Messaging',
    desc: 'Instant messages, reactions, threads — everything Discord should have done better.',
    color: 'var(--purple)',
  },
  {
    icon: <Users size={24} />,
    title: 'Communities & Servers',
    desc: 'Build your own server, create channels, manage members — full control.',
    color: 'var(--pink)',
  },
  {
    icon: <Zap size={24} />,
    title: 'Live Rooms',
    desc: 'Jump into live audio and video rooms. No scheduling, just vibe.',
    color: 'var(--blue)',
  },
  {
    icon: <Shield size={24} />,
    title: 'Actually Private',
    desc: 'Your data stays yours. No ads, no selling your info. Ever.',
    color: 'var(--green)',
  },
  {
    icon: <Star size={24} />,
    title: 'Badge System',
    desc: 'Earn badges, flex your status, build your reputation in the community.',
    color: 'var(--yellow)',
  },
  {
    icon: <Smile size={24} />,
    title: 'Built By Users',
    desc: 'Every feature here was requested by real people and ignored elsewhere. Not here.',
    color: 'var(--red)',
  },
]

const STATS = [
  { value: '0ms',  label: 'Latency Goal'   },
  { value: '100%', label: 'Ad Free'         },
  { value: '∞',    label: 'Feature Requests'},
  { value: '1',    label: 'Platform For All'},
]

const FAKE_MESSAGES = [
  { user: 'sable',    avatar: 'S', color: 'var(--purple)', text: 'yo this platform is actually clean 🔥',        time: '12:01' },
  { user: 'kairo',    avatar: 'K', color: 'var(--pink)',   text: 'fr they finally added the stuff discord ignored', time: '12:02' },
  { user: 'nova',     avatar: 'N', color: 'var(--blue)',   text: 'the badge system goes hard ngl',                time: '12:02' },
  { user: 'vex',      avatar: 'V', color: 'var(--green)',  text: 'live rooms are smooth as hell too',             time: '12:03' },
  { user: 'sable',    avatar: 'S', color: 'var(--purple)', text: 'no ads either??? bro this is it',              time: '12:03' },
  { user: 'phantom',  avatar: 'P', color: 'var(--yellow)', text: 'already moved my whole server here lmao',      time: '12:04' },
]

// ============ COMPONENTS ============
function NavBar({ scrolled }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-sable-border' : ''
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-sable flex-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, var(--purple), var(--pink))' }}
          >
            S
          </div>
          <span className="font-bold text-lg gradient-text">SableSync</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Community', 'Changelog'].map(item => (
            
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sable-muted hover:text-sable-text text-sm font-medium transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="btn btn-ghost text-sm py-2 px-4">
            Log in
          </Link>
          <Link href="/register" className="btn btn-primary text-sm py-2 px-4">
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden btn-icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-t border-sable-border px-6 py-4 flex flex-col gap-4"
        >
          {['Features', 'Community', 'Changelog'].map(item => (
            
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sable-muted hover:text-sable-text text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-sable-border">
            <Link href="/login"    className="btn btn-ghost  text-sm">Log in</Link>
            <Link href="/register" className="btn btn-primary text-sm">Get Started</Link>
          </div>
        </motion.div>
      )}
    </nav>
  )
}

function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden">
      {/* Background Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(155,109,255,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,110,180,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="badge badge-purple mb-6"
      >
        ✦ Built for the community, by the community
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-5xl md:text-7xl font-black text-center max-w-4xl leading-tight"
      >
        The platform that{' '}
        <span className="gradient-text">actually listens.</span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-lg md:text-xl text-sable-muted text-center max-w-2xl"
      >
        Everything you asked Discord and Instagram to build —
        we actually built it. No ads, no ignorance, just vibes.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10 flex flex-col sm:flex-row gap-4"
      >
        <Link href="/register" className="btn btn-primary text-base px-8 py-3">
          Join SableSync Free
          <ArrowRight size={18} />
        </Link>
        <Link href="/login" className="btn btn-ghost text-base px-8 py-3">
          Already have an account
        </Link>
      </motion.div>

      {/* Fake Chat Preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16 w-full max-w-2xl glass rounded-sable-lg overflow-hidden"
        style={{ border: '1px solid var(--border)' }}
      >
        {/* Chat Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          <Hash size={16} style={{ color: 'var(--muted)' }} />
          <span className="text-sm font-semibold">general</span>
          <div className="ml-auto flex items-center gap-2">
            <Volume2 size={14} style={{ color: 'var(--muted)' }} />
            <Video    size={14} style={{ color: 'var(--muted)' }} />
            <Users    size={14} style={{ color: 'var(--muted)' }} />
          </div>
        </div>

        {/* Messages */}
        <div className="px-4 py-3 flex flex-col gap-3">
          {FAKE_MESSAGES.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.08 }}
              className="flex items-start gap-3"
            >
              <div
                className="w-8 h-8 rounded-full flex-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: msg.color }}
              >
                {msg.avatar}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold" style={{ color: msg.color }}>
                    {msg.user}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--faint)' }}>
                    {msg.time}
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input Bar */}
        <div
          className="px-4 py-3 border-t flex items-center gap-3"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          <div
            className="flex-1 rounded-sable px-4 py-2 text-sm"
            style={{
              background: 'var(--hover)',
              color: 'var(--faint)',
            }}
          >
            Message #general
          </div>
          <Smile size={18} style={{ color: 'var(--muted)' }} />
        </div>
      </motion.div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="py-16 px-6 border-y" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-4xl font-black gradient-text">{stat.value}</span>
            <span className="text-sm text-sable-muted text-center">{stat.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-black mb-4">
            Everything they <span className="gradient-text">refused to build.</span>
          </h2>
          <p className="text-sable-muted text-lg max-w-xl mx-auto">
            We took every ignored feature request and shipped them all.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              viewport={{ once: true }}
              className="card card-hover group"
            >
              <div
                className="w-12 h-12 rounded-sable flex-center mb-4 transition-transform group-hover:scale-110"
                style={{
                  background: `${f.color}18`,
                  color: f.color,
                  border: `1px solid ${f.color}30`,
                }}
              >
                {f.icon}
              </div>
              <h3 className="text-base font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-sable-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(155,109,255,0.1), rgba(255,110,180,0.1))',
            border: '1px solid rgba(155,109,255,0.2)',
          }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(155,109,255,0.15) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-4">
              Ready to <span className="gradient-text">actually vibe?</span>
            </h2>
            <p className="text-sable-muted mb-8 text-lg">
              Join SableSync. Free forever. No credit card. No ads. No BS.
            </p>
            <Link href="/register" className="btn btn-primary text-base px-10 py-3 mx-auto">
              Create Your Account
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer
      className="py-8 px-6 border-t text-center"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <div
          className="w-6 h-6 rounded-lg flex-center text-white text-xs font-bold"
          style={{ background: 'linear-gradient(135deg, var(--purple), var(--pink))' }}
        >
          S
        </div>
        <span className="font-bold gradient-text">SableSync</span>
      </div>
      <p className="text-sable-faint text-sm">
        © 2025 SableSync. Built different.
      </p>
    </footer>
  )
}

// ============ MAIN PAGE ============
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg)', overflowY: 'auto', height: '100vh' }}
    >
      <NavBar scrolled={scrolled} />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
