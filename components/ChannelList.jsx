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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{    opacity: 0 }}
      className="fixed inset-0 z-50 flex-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        exit={{    scale: 0.9, opacity: 0 }}
        className="card w-full max-w-sm mx-4"
        style={{ border: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold">Create Channel</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
              in {category}
            </p>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        <div className="divider my-4" />

        <div className="flex flex-col gap-4">
          {/* Channel Type */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Channel Type</label>
            <div className="flex flex-col gap-2">
              {types.map(t => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className="flex items-center gap-3 p-3 rounded-sable text-sm font-medium text-left transition-all"
                  style={{
                    background:   type === t.id ? 'rgba(155,109,255,0.1)' : 'var(--surface)',
                    border:       `1px solid ${type === t.id ? 'var(--purple)' : 'var(--border)'}`,
                    color:        type === t.id ? 'var(--purple)' : 'var(--muted)',
                  }}
                >
                  {t.icon}
                  {t.label}
                  {type === t.id && (
                    <div
                      className="ml-auto w-4 h-4 rounded-full flex-center"
                      style={{ background: 'var(--purple)' }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Channel Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Channel Name</label>
            <div className="relative">
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: 'var(--faint)' }}
              >
                <ChannelIcon type={type} />
              </div>
              <input
                className="input pl-10"
                placeholder="new-channel"
                value={name}
                onChange={e => setName(
                  e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                )}
                autoFocus
              />
            </div>
          </div>

          {/* Private Toggle */}
          <button
            onClick={() => setLocked(l => !l)}
            className="flex items-center justify-between p-3 rounded-sable transition-all"
            style={{
              background: locked ? 'rgba(155,109,255,0.08)' : 'var(--surface)',
              border:     `1px solid ${locked ? 'var(--purple)' : 'var(--border)'}`,
            }}
          >
            <div className="flex items-center gap-3">
              <Lock size={16} style={{ color: locked ? 'var(--purple)' : 'var(--muted)' }} />
              <div className="text-left">
                <p className="text-sm font-medium" style={{ color: locked ? 'var(--purple)' : 'var(--text)' }}>
                  Private Channel
                </p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>
                  Only selected members can access
                </p>
              </div>
            </div>
            <div
              className="w-10 h-5 rounded-full transition-all relative"
              style={{ background: locked ? 'var(--purple)' : 'var(--border)' }}
            >
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: locked ? '22px' : '2px' }}
              />
            </div>
          </button>

          <button
            className="btn btn-primary w-full"
            onClick={onClose}
          >
            Create Channel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============ VOICE CHANNEL ROW ============
function VoiceChannelRow({ channel, active, onClick }) {
  const members = VOICE_MEMBERS[channel.id] || []
  const [expanded, setExpanded] = useState(false)

  return (
    <div>
      <div
        className={`channel-item group ${active ? 'active' : ''}`}
        onClick={() => { onClick(); setExpanded(e => !e) }}
      >
        <span style={{ color: active ? 'var(--green)' : undefined }}>
          <ChannelIcon type={channel.type} />
        </span>
        <span className="flex-1 truncate-text text-sm">{channel.name}</span>

        {channel.members > 0 && (
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{
              background: 'rgba(105,219,124,0.1)',
              color:      'var(--green)',
            }}
          >
            {channel.members}
          </span>
        )}

        <button
          className="opacity-0 group-hover:opacity-100 btn-icon p-0.5 transition-opacity"
          onClick={e => { e.stopPropagation(); setExpanded(ex => !ex) }}
        >
          <ChevronDown
            size={14}
            style={{
              transform:  expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
              transition: 'transform 0.2s',
            }}
          />
        </button>
      </div>

      {/* Voice Members */}
      <AnimatePresence>
        {expanded && members.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{    height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {members.map((member, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-1 ml-4"
                style={{ color: 'var(--muted)', fontSize: '0.8rem' }}
              >
                <div
                  className="w-5 h-5 rounded-full flex-center text-white font-bold"
                  style={{
                    background: `hsl(${(member.charCodeAt(0) * 30) % 360}, 60%, 50%)`,
                    fontSize:   '0.6rem',
                    flexShrink: 0,
                  }}
                >
                  {member[0]}
                </div>
                <span className="truncate-text">{member}</span>
                <Volume2 size={10} className="ml-auto opacity-50" />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============ CATEGORY ROW ============
function CategoryRow({ category, activeChannel, onChannelSelect, onAddChannel }) {
  const [collapsed, setCollapsed] = useState(category.collapsed)
  const [hovering,  setHovering]  = useState(false)

  return (
    <div className="mb-1">
      {/* Category Header */}
      <div
        className="flex items-center gap-1 px-2 py-1 cursor-pointer group"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onClick={() => setCollapsed(c => !c)}
      >
        <motion.div
          animate={{ rotate: collapsed ? -90 : 0 }}
          transition={{ duration: 0.15 }}
          style={{ color: 'var(--faint)' }}
        >
          <ChevronDown size={12} />
        </motion.div>

        <span
          className="flex-1 text-xs font-bold uppercase tracking-wider truncate-text"
          style={{ color: 'var(--faint)', letterSpacing: '0.08em' }}
        >
          {category.name}
        </span>

        <AnimatePresence>
          {hovering && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1   }}
              exit={{    opacity: 0, scale: 0.8  }}
              className="btn-icon p-0.5"
              onClick={e => { e.stopPropagation(); onAddChannel(category.name) }}
            >
              <Plus size={14} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Channels */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{    height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {category.channels.map(channel => {
              const isVoice = channel.type === 'voice' || channel.type === 'video'
              const isActive = activeChannel === channel.id

              if (isVoice) {
                return (
                  <VoiceChannelRow
                    key={channel.id}
                    channel={channel}
                    active={isActive}
                    onClick={() => onChannelSelect(channel.id)}
                  />
                )
              }

              return (
                <div
                  key={channel.id}
                  className={`channel-item group ${isActive ? 'active' : ''}`}
                  onClick={() => onChannelSelect(channel.id)}
                >
                  <span style={{ color: isActive ? 'var(--purple)' : undefined }}>
                    <ChannelIcon type={channel.type} />
                  </span>

                  <span className="flex-1 truncate-text text-sm">{channel.name}</span>

                  {channel.locked && (
                    <Lock size={12} style={{ color: 'var(--faint)', flexShrink: 0 }} />
                  )}

                  {/* Unread badge */}
                  {!isActive && channel.unread > 0 && (
                    <div
                      className="flex items-center gap-1"
                    >
                      {channel.mentioned > 0 && (
                        <span
                          className="min-w-4 h-4 rounded-full flex-center text-white font-bold px-1"
                          style={{
                            background: 'var(--red)',
                            fontSize:   '0.6rem',
                          }}
                        >
                          {channel.mentioned}
                        </span>
                      )}
                      {!channel.mentioned && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: 'var(--text)' }}
                        />
                      )}
                    </div>
                  )}

                  {/* Hover Actions */}
                  {!channel.locked && (
                    <button
                      className="opacity-0 group-hover:opacity-100 btn-icon p-0.5 transition-opacity ml-1"
                      onClick={e => e.stopPropagation()}
                    >
                      <Settings size={13} />
                    </button>
                  )}
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============ MAIN CHANNEL LIST ============
export default function ChannelList({ activeChannel, onChannelSelect }) {
  const [modalCategory, setModalCategory] = useState(null)

  return (
    <>
      <div className="channel-panel">
        {/* Server Banner Header */}
        <div
          className="relative overflow-hidden flex-shrink-0"
          style={{ height: '80px' }}
        >
          <div
            className="absolute inset-0"
            style={{ background: SERVER_DATA.banner }}
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent 0%, var(--panel) 100%)' }}
          />
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-end justify-between">
            <div>
              <h2 className="font-bold text-base leading-tight">{SERVER_DATA.name}</h2>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                {SERVER_DATA.memberCount.toLocaleString()} members
              </p>
            </div>
            <button className="btn-icon">
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Boost Banner */}
        <div
          className="mx-3 mb-2 p-2 rounded-sable flex items-center gap-2 cursor-pointer"
          style={{
            background: 'rgba(155,109,255,0.08)',
            border:     '1px solid rgba(155,109,255,0.2)',
          }}
        >
          <AlertCircle size={14} style={{ color: 'var(--purple)', flexShrink: 0 }} />
          <span className="text-xs font-medium" style={{ color: 'var(--purple)' }}>
            Boost this server
          </span>
        </div>

        {/* Channel Categories - Scrollable */}
        <div className="flex-1 overflow-y-auto py-2">
          {SERVER_DATA.categories.map(cat => (
            <CategoryRow
              key={cat.id}
              category={cat}
              activeChannel={activeChannel}
              onChannelSelect={onChannelSelect}
              onAddChannel={setModalCategory}
            />
          ))}
        </div>

        {/* Bottom User Bar */}
        <div
          className="flex items-center gap-2 px-3 py-2 flex-shrink-0"
          style={{
            borderTop:  '1px solid var(--border)',
            background: 'var(--surface)',
          }}
        >
          <div
            className="relative w-8 h-8 rounded-full flex-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--purple), var(--pink))' }}
          >
            Y
            <div
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
              style={{
                background: 'var(--online)',
                border:     '2px solid var(--surface)',
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate-text">yashsopro</p>
            <p className="text-xs truncate-text" style={{ color: 'var(--muted)' }}>
              #0001
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button className="btn-icon p-1">
              <Volume2 size={14} />
            </button>
            <button className="btn-icon p-1">
              <Settings size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Create Channel Modal */}
      <AnimatePresence>
        {modalCategory && (
          <CreateChannelModal
            category={modalCategory}
            onClose={() => setModalCategory(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
