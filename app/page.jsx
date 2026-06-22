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
