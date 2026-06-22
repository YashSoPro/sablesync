'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Hash, Volume2, ChevronDown,
  ChevronRight, Plus, Settings,
  Lock, Megaphone, BookOpen,
  Video, X, AlertCircle
} from 'lucide-react'

// ============ MOCK DATA ============
const SERVER_DATA = {
  name: 'SableSync HQ',
  verified: true,
  memberCount: 1420,
  banner: 'linear-gradient(135deg, #9b6dff 0%, #ff6eb4 100%)',
  categories: [
    {
      id: 'info',
      name: 'Information',
      collapsed: false,
      channels: [
        { id: 'announcements', name: 'announcements', type: 'announce', locked: true,  unread: 2  },
        { id: 'rules',         name: 'rules',         type: 'text',    locked: true,  unread: 0  },
        { id: 'changelog',     name: 'changelog',     type: 'text',    locked: true,  unread: 1  },
      ],
    },
    {
      id: 'general',
      name: 'General',
      collapsed: false,
      channels: [
        { id: 'general',    name: 'general',      type: 'text',  locked: false, unread: 14, mentioned: 2 },
        { id: 'memes',      name: 'memes',        type: 'text',  locked: false, unread: 5,  mentioned: 0 },
        { id: 'off-topic',  name: 'off-topic',    type: 'text',  locked: false, unread: 0,  mentioned: 0 },
        { id: 'resources',  name: 'resources',    type: 'docs',  locked: false, unread: 0,  mentioned: 0 },
      ],
    },
    {
      id: 'voice',
      name: 'Voice Rooms',
      collapsed: false,
      channels: [
        { id: 'lounge',    name: 'Lounge',         type: 'voice', locked: false, members: 3  },
        { id: 'gaming',    name: 'Gaming',         type: 'voice', locked: false, members: 5  },
        { id: 'study',     name: 'Study Room',     type: 'voice', locked: false, members: 2  },
        { id: 'stage',     name: 'Main Stage',     type: 'video', locked: false, members: 12 },
      ],
    },
    {
      id: 'dev',
      name: 'Development',
      collapsed: true,
      channels: [
        { id: 'dev-general', name: 'dev-general',  type: 'text',  locked: false, unread: 3  },
        { id: 'bugs',        name: 'bug-reports',  type: 'text',  locked: false, unread: 7  },
        { id: 'feedback',    name: 'feedback',     type: 'text',  locked: false, unread: 0  },
      ],
    },
  ],
}

// Active voice members mock
const VOICE_MEMBERS = {
  lounge:  ['Kai', 'Nova', 'Vex'],
  gaming:  ['Sable', 'Phantom', 'Mira', 'Echo', 'Blaze'],
  study:   ['Luna', 'Zara'],
  stage:   [],
}

// ============ CHANNEL ICON ============
function ChannelIcon({ type, size = 15 }) {
  const icons = {
    text:    <Hash        size={size} />,
    announce:<Megaphone   size={size} />,
    voice:   <Volume2     size={size} />,
    video:   <Video       size={size} />,
    docs:    <BookOpen    size={size} />,
  }
  return icons[type] || <Hash size={size} />
}

// ============ CREATE CHANNEL MODAL ============
function CreateChannelModal({ category, onClose }) {
  const [name, setName]     = useState('')
  const [type, setType]     = useState('text')
  const [locked, setLocked] = useState(false)

  const types = [
    { id: 'text',    label: 'Text Channel',  icon: <Hash     size={16} /> },
    { id: 'voice',   label: 'Voice Channel', icon: <Volume2  size={16} /> },
    { id: 'video',   label: 'Video Channel', icon: <Video    size={16} /> },
    { id: 'docs',    label: 'Docs Channel',  icon: <BookOpen size={16} /> },
  ]

  return (
    <motion.div
      initial={{ opacity: 0
