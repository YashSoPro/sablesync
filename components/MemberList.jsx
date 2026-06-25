'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Shield, Star, Crown,
  MoreHorizontal, MessageCircle,
  UserMinus, Ban, Volume2Off,
  ChevronDown, Zap, X
} from 'lucide-react'

// ============ MOCK DATA ============
const MEMBER_CATEGORIES = [
  {
    id:      'owner',
    label:   'Owner',
    color:   'var(--yellow)',
    members: [
      {
        id: 'u0', username: 'sable', displayName: 'Sable',
        color: '#ff6eb4', avatar: 'S', status: 'online',
        role: 'owner', badge: '👑', activity: 'Building SableSync',
        joined: 'Jan 2025',
      },
    ],
  },
  {
    id:      'admin',
    label:   'Admin',
    color:   'var(--red)',
    members: [
      {
        id: 'u1', username: 'yashsopro', displayName: 'Yash',
        color: '#9b6dff', avatar: 'Y', status: 'online',
        role: 'admin', badge: '⚡', activity: 'Playing Valorant',
        joined: 'Feb 2025',
      },
      {
        id: 'u6', username: 'phantom', displayName: 'Phantom',
        color: '#ffd43b', avatar: 'P', status: 'idle',
        role: 'admin', badge: '⚡', activity: null,
        joined: 'Feb 2025',
      },
    ],
  },
  {
    id:      'mod',
    label:   'Moderator',
    color:   'var(--blue)',
    members: [
      {
        id: 'u7', username: 'luna', displayName: 'Luna',
        color: '#4dabf7', avatar: 'L', status: 'online',
        role: 'mod', badge: '🛡️', activity: 'Listening to Spotify',
        joined: 'Mar 2025',
      },
      {
        id: 'u8', username: 'blaze', displayName: 'Blaze',
        color: '#ff6b6b', avatar: 'B', status: 'dnd',
        role: 'mod', badge: '🛡️', activity: 'Do Not Disturb',
        joined: 'Mar 2025',
      },
    ],
  },
  {
    id:      'booster',
    label:   'Server Booster',
    color:   'var(--pink)',
    members: [
      {
        id: 'u9', username: 'nova', displayName: 'Nova',
        color: '#69db7c', avatar: 'N', status: 'online',
        role: 'booster', badge: '💎', activity: 'Coding',
        joined: 'Apr 2025',
      },
    ],
  },
  {
    id:      'member',
    label:   'Members',
    color:   'var(--muted)',
    members: [
      {
        id: 'u2', username: 'kairo', displayName: 'Kairo',
        color: '#4dabf7', avatar: 'K', status: 'online',
        role: 'member', badge: null, activity: 'Watching Netflix',
        joined: 'May 2025',
      },
      {
        id: 'u3', username: 'vex', displayName: 'Vex',
        color: '#69db7c', avatar: 'V', status: 'idle',
        role: 'member', badge: null, activity: null,
        joined: 'May 2025',
      },
      {
        id: 'u4', username: 'echo', displayName: 'Echo',
        color: '#ff6b6b', avatar: 'E', status: 'dnd',
        role: 'member', badge: null, activity: 'In a voice call',
        joined: 'Jun 2025',
      },
      {
        id: 'u5', username: 'mira', displayName: 'Mira',
        color: '#ffd43b', avatar: 'M', status: 'offline',
        role: 'member', badge: null, activity: null,
        joined: 'Jun 2025',
      },
      {
        id: 'u10', username: 'zara', displayName: 'Zara',
        color: '#9b6dff', avatar: 'Z', status: 'offline',
        role: 'member', badge: null, activity: null,
        joined: 'Jun 2025',
      },
      {
        id: 'u11', username: 'rex', displayName: 'Rex',
        color: '#ff6eb4', avatar: 'R', status: 'offline',
        role: 'member', badge: null, activity: null,
        joined: 'Jun 2025',
      },
    ],
  },
]

// ============ STATUS CONFIG ============
const STATUS_CONFIG = {
  online:  { color: 'var(--online)', label: 'Online'          },
  idle:    { color: 'var(--idle)',   label: 'Idle'            },
  dnd:     { color: 'var(--red)',    label: 'Do Not Disturb'  },
  offline: { color: 'var(--offline)',label: 'Offline'         },
}

// ============ ROLE ICON ============
function RoleIcon({ role, size = 12 }) {
  if (role === 'owner') return <Crown   size={size} style={{ color: 'var(--yellow)' }} />
  if (role === 'admin') return <Zap     size={size} style={{ color: 'var(--red)'    }} />
  if (role === 'mod')   return <Shield  size={size} style={{ color: 'var(--blue)'   }} />
  if (role === 'booster') return <Star  size={size} style={{ color: 'var(--pink)'   }} />
  return null
}

// ============ CONTEXT MENU ============
function ContextMenu({ member, position, onClose }) {
  const actions = [
    { icon: <MessageCircle size={14} />, label: 'Message',      color: 'var(--text)',   action: () => {} },
    { icon: <UserMinus     size={14} />, label: 'Kick Member',  color: 'var(--yellow)', action: () => {} },
    { icon: <Volume2Off    size={14} />, label: 'Mute Member',  color: 'var(--muted)',  action: () => {} },
    { icon: <Ban           size={14} />, label: 'Ban Member',   color: 'var(--red)',    action: () => {} },
  ]

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1    }}
        exit={{    opacity: 0, scale: 0.92 }}
        className="fixed z-50 rounded-sable overflow-hidden"
        style={{
          top:       position.y,
          left:      position.x,
          background: 'var(--surface)',
          border:    '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          minWidth:  '180px',
        }}
      >
        {/* Member Header */}
        <div
          className="px-3 py-2 flex items-center gap-2"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: member.color }}
          >
            {member.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate-text">{member.displayName}</p>
            <p className="text-xs truncate-text" style={{ color: 'var(--muted)' }}>
              @{member.username}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="py-1">
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={() => { a.action(); onClose() }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm transition-colors text-left"
              style={{ color: a.color }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {a.icon}
              {a.label}
            </button>
          ))}
        </div>
      </motion.div>
    </>
  )
}

// ============ PROFILE POPUP ============
function ProfilePopup({ member, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{    opacity: 0 }}
      className="fixed inset-0 z-50 flex-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        exit={{    scale: 0.9, opacity: 0 }}
        className="w-72 rounded-sable-lg overflow-hidden"
        style={{ border: '1px solid var(--border)', boxShadow: '0 16px 48px rgba(0,0,0,0.6)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Banner */}
        <div
          className="h-20 relative"
          style={{
            background: `linear-gradient(135deg, ${member.color}66, ${member.color}22)`,
          }}
        >
          <button
            className="absolute top-2 right-2 btn-icon"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        {/* Avatar */}
        <div
          className="relative px-4"
          style={{ background: 'var(--panel)', marginTop: '-20px' }}
        >
          <div className="relative inline-block">
            <div
              className="w-16 h-16 rounded-full flex-center text-white font-bold text-2xl"
              style={{
                background: member.color,
                border:     '4px solid var(--panel)',
              }}
            >
              {member.avatar}
            </div>
            <div
              className="absolute bottom-1 right-1 w-4 h-4 rounded-full"
              style={{
                background: STATUS_CONFIG[member.status].color,
                border:     '3px solid var(--panel)',
              }}
            />
          </div>

          {/* Info */}
          <div className="pt-2 pb-4">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-lg">{member.displayName}</h3>
              {member.badge && <span className="text-base">{member.badge}</span>}
              <RoleIcon role={member.role} size={14} />
            </div>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>@{member.username}</p>

            {member.activity && (
              <div
                className="mt-3 p-2 rounded-sable flex items-center gap-2"
                style={{ background: 'var(--hover)' }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: STATUS_CONFIG[member.status].color }}
                />
                <span className="text-xs" style={{ color: 'var(--muted)' }}>
                  {member.activity}
                </span>
              </div>
            )}

            <div className="divider my-3" />

            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--faint)' }}>
                Member Since
              </p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{member.joined}</p>
            </div>

            <button className="btn btn-primary w-full mt-4 text-sm">
              <MessageCircle size={14} />
              Send Message
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============ MEMBER ROW ============
function MemberRow({ member, onContextMenu, onClick }) {
  const status = STATUS_CONFIG[member.status]
  const isOffline = member.status === 'offline'

  return (
    <motion.div
      whileHover={{ x: 2 }}
      onClick={() => onClick(member)}
      onContextMenu={e => { e.preventDefault(); onContextMenu(e, member) }}
      className="flex items-center gap-2.5 px-2 py-1.5 rounded-sable cursor-pointer transition-all group"
      style={{ opacity: isOffline ? 0.5 : 1 }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--hover)'
        e.currentTarget.style.opacity    = '1'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.opacity    = isOffline ? '0.5' : '1'
      }}
    >
      {/* Avatar + Status */}
      <div className="relative flex-shrink-0">
        <div
          className="w-8 h-8 rounded-full flex-center text-white font-bold text-sm"
          style={{ background: member.color }}
        >
          {member.avatar}
        </div>
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full"
          style={{
            background: status.color,
            border:     '2px solid var(--panel)',
          }}
        />
      </div>

      {/* Name + Activity */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className="text-sm font-medium truncate-text"
            style={{ color: isOffline ? 'var(--muted)' : 'var(--text)' }}
          >
            {member.displayName}
          </span>
          {member.badge && (
            <span className="text-xs flex-shrink-0">{member.badge}</span>
          )}
          <RoleIcon role={member.role} size={11} />
        </div>
        {member.activity && !isOffline && (
          <p
            className="text-xs truncate-text"
            style={{ color: 'var(--faint)' }}
          >
            {member.activity}
          </p>
        )}
      </div>

      {/* Hover Actions */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
        <button
          className="btn-icon p-1"
          onClick={e => { e.stopPropagation(); }}
          title="Message"
        >
          <MessageCircle size={13} />
        </button>
        <button
          className="btn-icon p-1"
          onClick={e => { e.stopPropagation(); onContextMenu(e, member) }}
          title="More"
        >
          <MoreHorizontal size={13} />
        </button>
      </div>
    </motion.div>
  )
}

// ============ CATEGORY SECTION ============
function CategorySection({ category, searchQuery, onContextMenu, onMemberClick }) {
  const [collapsed, setCollapsed] = useState(false)

  const filtered = category.members.filter(m =>
    m.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!filtered.length) return null

  return (
    <div className="mb-2">
      {/* Category Header */}
      <button
        className="flex items-center gap-1.5 w-full px-2 py-1.5 text-left"
        onClick={() => setCollapsed(c => !c)}
      >
        <motion.div
          animate={{ rotate: collapsed ? -90 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronDown size={12} style={{ color: 'var(--faint)' }} />
        </motion.div>
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: category.color, letterSpacing: '0.08em' }}
        >
          {category.label}
        </span>
        <span
          className="text-xs ml-auto"
          style={{ color: 'var(--faint)' }}
        >
          {filtered.length}
        </span>
      </button>

      {/* Members */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{    height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {filtered.map(member => (
              <MemberRow
                key={member.id}
                member={member}
                onContextMenu={onContextMenu}
                onClick={onMemberClick}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============ MAIN MEMBER LIST ============
export default function MemberList() {
  const [search,      setSearch]      = useState('')
  const [contextMenu, setContextMenu] = useState(null)
  const [profileMember, setProfileMember] = useState(null)

  const totalOnline = MEMBER_CATEGORIES
    .flatMap(c => c.members)
    .filter(m => m.status !== 'offline').length

  function handleContextMenu(e, member) {
    setContextMenu({
      member,
      position: {
        x: Math.min(e.clientX, window.innerWidth  - 200),
        y: Math.min(e.clientY, window.innerHeight - 180),
      },
    })
  }

  return (
    <>
      <div className="members-panel">
        {/* Header */}
        <div
          className="px-3 pt-4 pb-2 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">Members</h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{
                background: 'rgba(105,219,124,0.1)',
                color:      'var(--green)',
              }}
            >
              {totalOnline} online
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--faint)' }}
            />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search members..."
              className="input pl-8 text-xs py-2"
            />
            {search && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-icon p-0"
                onClick={() => setSearch('')}
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Member Categories */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          {MEMBER_CATEGORIES.map(category => (
            <CategorySection
              key={category.id}
              category={category}
              searchQuery={search}
              onContextMenu={handleContextMenu}
              onMemberClick={setProfileMember}
            />
          ))}

          {/* Empty State */}
          {search && MEMBER_CATEGORIES.every(c =>
            c.members.every(m =>
              !m.displayName.toLowerCase().includes(search.toLowerCase()) &&
              !m.username.toLowerCase().includes(search.toLowerCase())
            )
          ) && (
            <div className="flex-center flex-col gap-2 py-8">
              <Search size={24} style={{ color: 'var(--faint)' }} />
              <p className="text-sm" style={{ color: 'var(--muted)' }}>
                No members found
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            member={contextMenu.member}
            position={contextMenu.position}
            onClose={() => setContextMenu(null)}
          />
        )}
      </AnimatePresence>

      {/* Profile Popup */}
      <AnimatePresence>
        {profileMember && (
          <ProfilePopup
            member={profileMember}
            onClose={() => setProfileMember(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
