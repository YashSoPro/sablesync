'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Compass, Settings,
  MessageCircle, Bell, X
} from 'lucide-react'

// ============ MOCK DATA ============
const SERVERS = [
  { id: 1, name: 'SableSync HQ',    initial: 'S', color: 'linear-gradient(135deg, #9b6dff, #ff6eb4)', unread: 3,  mentioned: true  },
  { id: 2, name: 'Gaming Lounge',   initial: 'G', color: 'linear-gradient(135deg, #4dabf7, #69db7c)', unread: 12, mentioned: false },
  { id: 3, name: 'Design Cave',     initial: 'D', color: 'linear-gradient(135deg, #ff6eb4, #ffd43b)', unread: 0,  mentioned: false },
  { id: 4, name: 'Dev Zone',        initial: 'Z', color: 'linear-gradient(135deg, #69db7c, #4dabf7)', unread: 5,  mentioned: true  },
  { id: 5, name: 'Anime & Manga',   initial: 'A', color: 'linear-gradient(135deg, #ffd43b, #ff6b6b)', unread: 0,  mentioned: false },
  { id: 6, name: 'Music Heads',     initial: 'M', color: 'linear-gradient(135deg, #ff6b6b, #9b6dff)', unread: 1,  mentioned: false },
]

// ============ TOOLTIP WRAPPER ============
function SidebarTooltip({ label, children }) {
  const [visible, setVisible] = useState(false)

  return (
    <div
      className="relative flex-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: -6, scale: 0.92 }}
            animate={{ opacity: 1, x: 0,  scale: 1     }}
            exit={{   opacity: 0, x: -6, scale: 0.92   }}
            transition={{ duration: 0.12 }}
            className="absolute left-full ml-3 z-50 pointer-events-none"
            style={{
              background:   'var(--surface)',
              border:       '1px solid var(--border)',
              borderRadius: '8px',
              padding:      '6px 12px',
              whiteSpace:   'nowrap',
              fontSize:     '0.8rem',
              fontWeight:   600,
              color:        'var(--text)',
              boxShadow:    '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            {/* Arrow */}
            <div
              className="absolute right-full top-1/2 -translate-y-1/2"
              style={{
                width: 0, height: 0,
                borderTop:    '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderRight:  '5px solid var(--border)',
                marginRight:  '-1px',
              }}
            />
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============ SERVER ICON ============
function ServerIcon({ server, active, onClick }) {
  return (
    <SidebarTooltip label={server.name}>
      <div className="relative">
        {/* Active Pill */}
        <motion.div
          animate={{
            height: active ? 36 : server.unread ? 8 : 0,
            opacity: (active || server.unread) ? 1 : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 rounded-r-full"
          style={{ background: 'var(--text)' }}
        />

        {/* Icon Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{   scale: 0.95 }}
          onClick={onClick}
          className="relative w-12 h-12 flex-center overflow-hidden no-select"
          style={{
            background:    server.img ? undefined : server.color,
            borderRadius:  active ? '30%' : '50%',
            transition:    'border-radius 0.2s ease',
            boxShadow:     active ? '0 0 0 2px var(--text)' : undefined,
          }}
        >
          <span className="text-white font-bold text-lg">{server.initial}</span>

          {/* Unread Badge */}
          {!active && server.unread > 0 && (
            <div
              className="absolute bottom-0 right-0 min-w-4 h-4 rounded-full flex-center text-white font-bold"
              style={{
                background: server.mentioned ? 'var(--red)' : 'var(--surface)',
                border:     '2px solid var(--surface)',
                fontSize:   '0.6rem',
                padding:    '0 3px',
                color:      server.mentioned ? 'white' : 'var(--text)',
              }}
            >
              {server.unread > 9 ? '9+' : server.unread}
            </div>
          )}
        </motion.button>
      </div>
    </SidebarTooltip>
  )
}

// ============ ICON BUTTON ============
function SidebarIconBtn({ icon, label, onClick, color, badge }) {
  return (
    <SidebarTooltip label={label}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{   scale: 0.95  }}
        onClick={onClick}
        className="relative w-12 h-12 flex-center rounded-full transition-all"
        style={{
          background: 'var(--panel)',
          color:      color || 'var(--muted)',
          border:     '1px solid var(--border)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderRadius = '30%'
          e.currentTarget.style.color        = color || 'var(--text)'
          e.currentTarget.style.background   = 'var(--hover)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderRadius = '50%'
          e.currentTarget.style.color        = color || 'var(--muted)'
          e.currentTarget.style.background   = 'var(--panel)'
        }}
      >
        {icon}
        {badge && (
          <div
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex-center text-white font-bold"
            style={{
              background: 'var(--red)',
              fontSize:   '0.6rem',
              border:     '2px solid var(--surface)',
            }}
          >
            {badge}
          </div>
        )}
      </motion.button>
    </SidebarTooltip>
  )
}

// ============ ADD SERVER MODAL ============
function AddServerModal({ onClose }) {
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
        className="card w-full max-w-sm mx-4"
        style={{ border: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold">Create a Server</h3>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Server Name Input */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Server Name</label>
            <input
              className="input"
              placeholder="My Awesome Server"
              autoFocus
            />
          </div>

          {/* Server Type */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Server Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['Gaming', 'Education', 'Music', 'Tech', 'Art', 'Other'].map(type => (
                <button
                  key={type}
                  className="p-3 rounded-sable text-sm font-medium text-left transition-all"
                  style={{
                    background: 'var(--surface)',
                    border:     '1px solid var(--border)',
                    color:      'var(--muted)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--purple)'
                    e.currentTarget.style.color       = 'var(--text)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.color       = 'var(--muted)'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            className="btn btn-primary w-full mt-2"
            onClick={onClose}
          >
            Create Server
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============ MAIN SIDEBAR ============
export default function Sidebar({ activeServer, onServerSelect }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className="sidebar">
        {/* DMs Button */}
        <SidebarIconBtn
          icon={<MessageCircle size={22} />}
          label="Direct Messages"
          color="var(--purple)"
          badge={2}
        />

        {/* Divider */}
        <div
          className="w-8 rounded-full"
          style={{ height: '2px', background: 'var(--border)' }}
        />

        {/* Server List */}
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto w-full items-center px-1">
          {SERVERS.map(server => (
            <ServerIcon
              key={server.id}
              server={server}
              active={activeServer === server.id}
              onClick={() => onServerSelect(server.id)}
            />
          ))}
        </div>

        {/* Divider */}
        <div
          className="w-8 rounded-full"
          style={{ height: '2px', background: 'var(--border)' }}
        />

        {/* Bottom Buttons */}
        <SidebarIconBtn
          icon={<Plus size={22} />}
          label="Add a Server"
          color="var(--green)"
          onClick={() => setShowModal(true)}
        />
        <SidebarIconBtn
          icon={<Compass size={22} />}
          label="Explore Servers"
          color="var(--blue)"
        />
        <SidebarIconBtn
          icon={<Bell size={22} />}
          label="Notifications"
          color="var(--yellow)"
        />

        {/* Divider */}
        <div
          className="w-8 rounded-full"
          style={{ height: '2px', background: 'var(--border)' }}
        />

        {/* User Avatar */}
        <SidebarTooltip label="Your Profile">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{   scale: 0.95  }}
            className="relative w-12 h-12 rounded-full flex-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, var(--purple), var(--pink))',
              border:     '2px solid var(--border)',
            }}
          >
            <span className="text-white font-bold">Y</span>
            {/* Online dot */}
            <div
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full"
              style={{
                background: 'var(--online)',
                border:     '2px solid var(--surface)',
              }}
            />
          </motion.button>
        </SidebarTooltip>

        {/* Settings */}
        <SidebarIconBtn
          icon={<Settings size={20} />}
          label="Settings"
        />
      </div>

      {/* Add Server Modal */}
      <AnimatePresence>
        {showModal && (
          <AddServerModal onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
