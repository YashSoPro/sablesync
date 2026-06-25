'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar     from '@/components/Sidebar'
import ChannelList from '@/components/ChannelList'
import ChatWindow  from '@/components/ChatWindow'
import MemberList  from '@/components/MemberList'

// ============ MOCK CHANNEL MAP ============
const CHANNEL_NAMES = {
  'announcements': 'announcements',
  'rules':         'rules',
  'changelog':     'changelog',
  'general':       'general',
  'memes':         'memes',
  'off-topic':     'off-topic',
  'resources':     'resources',
  'lounge':        'Lounge',
  'gaming':        'Gaming',
  'study':         'Study Room',
  'stage':         'Main Stage',
  'dev-general':   'dev-general',
  'bugs':          'bug-reports',
  'feedback':      'feedback',
}

// ============ MOBILE BOTTOM NAV ============
function MobileNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'servers',  label: 'Servers'  },
    { id: 'channels', label: 'Channels' },
    { id: 'chat',     label: 'Chat'     },
    { id: 'members',  label: 'Members'  },
  ]

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden"
      style={{
        background:  'var(--surface)',
        borderTop:   '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="flex-1 flex flex-col items-center py-2 gap-1 transition-colors"
          style={{ color: activeTab === tab.id ? 'var(--purple)' : 'var(--muted)' }}
        >
          <div
            className="w-1 h-1 rounded-full transition-all"
            style={{
              background: activeTab === tab.id ? 'var(--purple)' : 'transparent',
              marginBottom: '2px',
            }}
          />
          <span className="text-xs font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

// ============ LOADING SCREEN ============
function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{    opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex-center flex-col gap-4"
      style={{ background: 'var(--bg)' }}
    >
      {/* Logo */}
      <motion.div
        animate={{
          scale:  [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-16 h-16 rounded-sable-lg flex-center text-white font-black text-3xl"
        style={{
          background: 'linear-gradient(135deg, var(--purple), var(--pink))',
          boxShadow:  '0 0 40px rgba(155,109,255,0.5)',
        }}
      >
        S
      </motion.div>

      {/* Loading Bar */}
      <div
        className="w-48 h-1 rounded-full overflow-hidden"
        style={{ background: 'var(--border)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--purple), var(--pink))' }}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </div>

      <p className="text-sm" style={{ color: 'var(--muted)' }}>
        Loading SableSync...
      </p>
    </motion.div>
  )
}

// ============ NOTIFICATION TOAST ============
function NotificationToast({ notification, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0,   scale: 1    }}
      exit={{    opacity: 0, y: -20, scale: 0.95 }}
      className="flex items-start gap-3 p-3 rounded-sable cursor-pointer"
      style={{
        background: 'var(--surface)',
        border:     '1px solid var(--border)',
        boxShadow:  '0 8px 24px rgba(0,0,0,0.4)',
        maxWidth:   '320px',
      }}
      onClick={onDismiss}
    >
      <div
        className="w-8 h-8 rounded-full flex-center text-white font-bold text-sm flex-shrink-0"
        style={{ background: notification.color }}
      >
        {notification.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">{notification.title}</p>
        <p className="text-xs truncate-text" style={{ color: 'var(--muted)' }}>
          {notification.body}
        </p>
      </div>
    </motion.div>
  )
}

// ============ KEYBOARD SHORTCUT MODAL ============
function ShortcutsModal({ onClose }) {
  const shortcuts = [
    { keys: ['Ctrl', 'K'],     action: 'Quick Switch Channel'  },
    { keys: ['Ctrl', '/'],     action: 'Open Shortcuts'        },
    { keys: ['Ctrl', 'Shift', 'M'], action: 'Toggle Mute'     },
    { keys: ['Esc'],           action: 'Close Modal / Deselect'},
    { keys: ['↑'],             action: 'Edit Last Message'     },
    { keys: ['Ctrl', 'E'],     action: 'Open Emoji Picker'     },
    { keys: ['Ctrl', 'Shift', 'I'], action: 'Mark as Read'    },
    { keys: ['Alt', '↑/↓'],   action: 'Navigate Channels'     },
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
        className="card w-full max-w-md mx-4"
        style={{ border: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Keyboard Shortcuts</h3>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        <div className="flex flex-col gap-3">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--muted)' }}>{s.action}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((key, j) => (
                  <span key={j}>
                    <kbd
                      className="px-2 py-0.5 rounded text-xs font-mono font-semibold"
                      style={{
                        background: 'var(--surface)',
                        border:     '1px solid var(--border)',
                        color:      'var(--text)',
                      }}
                    >
                      {key}
                    </kbd>
                    {j < s.keys.length - 1 && (
                      <span className="text-xs mx-0.5" style={{ color: 'var(--faint)' }}>+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============ QUICK SWITCHER ============
function QuickSwitcher({ onClose }) {
  const [query, setQuery] = useState('')

  const allChannels = Object.entries(CHANNEL_NAMES).map(([id, name]) => ({ id, name }))
  const filtered    = allChannels.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{    opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-24"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: -10 }}
        animate={{ scale: 1,    opacity: 1, y: 0    }}
        exit={{    scale: 0.95, opacity: 0, y: -10  }}
        className="w-full max-w-lg mx-4 rounded-sable-lg overflow-hidden"
        style={{
          background: 'var(--surface)',
          border:     '1px solid var(--border)',
          boxShadow:  '0 24px 64px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <span style={{ color: 'var(--muted)' }}>🔍</span>
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Jump to a channel..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--text)' }}
            onKeyDown={e => e.key === 'Escape' && onClose()}
          />
          <kbd
            className="px-2 py-0.5 rounded text-xs font-mono"
            style={{
              background: 'var(--hover)',
              border:     '1px solid var(--border)',
              color:      'var(--faint)',
            }}
          >
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-64 overflow-y-auto py-2">
          {filtered.length ? (
            filtered.map(channel => (
              <button
                key={channel.id}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors"
                style={{ color: 'var(--muted)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--hover)'
                  e.currentTarget.style.color      = 'var(--text)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color      = 'var(--muted)'
                }}
                onClick={onClose}
              >
                <span style={{ color: 'var(--faint)' }}>#</span>
                {channel.name}
              </button>
            ))
          ) : (
            <div className="flex-center py-8" style={{ color: 'var(--muted)' }}>
              No channels found
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============ MAIN APP PAGE ============
export default function AppPage() {
  const [loading,        setLoading]        = useState(true)
  const [activeServer,   setActiveServer]   = useState(1)
  const [activeChannel,  setActiveChannel]  = useState('general')
  const [membersOpen,    setMembersOpen]    = useState(true)
  const [mobileTab,      setMobileTab]      = useState('chat')
  const [notifications,  setNotifications]  = useState([])
  const [showShortcuts,  setShowShortcuts]  = useState(false)
  const [showSwitcher,   setShowSwitcher]   = useState(false)

  // ---- Simulate loading ----
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600)
    return () => clearTimeout(t)
  }, [])

  // ---- Keyboard shortcuts ----
  useEffect(() => {
    function handleKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        setShowShortcuts(s => !s)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setShowSwitcher(s => !s)
      }
      if (e.key === 'Escape') {
        setShowShortcuts(false)
        setShowSwitcher(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // ---- Fake notification after load ----
  useEffect(() => {
    if (loading) return
    const t = setTimeout(() => {
      setNotifications([{
        id:     Date.now(),
        title:  'Nova mentioned you',
        body:   '@yashsopro check this out in #general',
        color:  '#69db7c',
        avatar: 'N',
      }])
    }, 3000)
    return () => clearTimeout(t)
  }, [loading])

  function handleChannelSelect(channelId) {
    setActiveChannel(channelId)
    setMobileTab('chat')
  }

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>

      {/* Main App */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="app-layout"
        >
          {/* ---- DESKTOP LAYOUT ---- */}
          <div className="hidden md:flex w-full h-full">
            {/* Sidebar */}
            <Sidebar
              activeServer={activeServer}
              onServerSelect={setActiveServer}
            />

            {/* Channel List */}
            <ChannelList
              activeChannel={activeChannel}
              onChannelSelect={handleChannelSelect}
            />

            {/* Chat Window */}
            <ChatWindow
              channelName={CHANNEL_NAMES[activeChannel] || activeChannel}
              onToggleMembers={() => setMembersOpen(o => !o)}
              membersOpen={membersOpen}
            />

            {/* Member List */}
            <AnimatePresence>
              {membersOpen && (
                <motion.div
                  initial={{ width: 0,   opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{    width: 0,   opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ overflow: 'hidden', flexShrink: 0 }}
                >
                  <MemberList />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ---- MOBILE LAYOUT ---- */}
          <div className="flex md:hidden w-full h-full pb-16">
            <AnimatePresence mode="wait">
              {mobileTab === 'servers' && (
                <motion.div
                  key="servers"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0   }}
                  exit={{    opacity: 0, x: -20  }}
                  className="w-full h-full"
                >
                  <Sidebar
                    activeServer={activeServer}
                    onServerSelect={id => {
                      setActiveServer(id)
                      setMobileTab('channels')
                    }}
                  />
                </motion.div>
              )}

              {mobileTab === 'channels' && (
                <motion.div
                  key="channels"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0   }}
                  exit={{    opacity: 0, x: -20  }}
                  className="w-full h-full"
                >
                  <ChannelList
                    activeChannel={activeChannel}
                    onChannelSelect={handleChannelSelect}
                  />
                </motion.div>
              )}

              {mobileTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{    opacity: 0 }}
                  className="w-full h-full"
                >
                  <ChatWindow
                    channelName={CHANNEL_NAMES[activeChannel] || activeChannel}
                    onToggleMembers={() => setMobileTab('members')}
                    membersOpen={false}
                  />
                </motion.div>
              )}

              {mobileTab === 'members' && (
                <motion.div
                  key="members"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0  }}
                  exit={{    opacity: 0, x: 20  }}
                  className="w-full h-full"
                >
                  <MemberList />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Nav */}
          <MobileNav
            activeTab={mobileTab}
            onTabChange={setMobileTab}
          />
        </motion.div>
      )}

      {/* ---- GLOBAL OVERLAYS ---- */}

      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {notifications.map(n => (
            <NotificationToast
              key={n.id}
              notification={n}
              onDismiss={() =>
                setNotifications(prev => prev.filter(x => x.id !== n.id))
              }
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Shortcuts Modal */}
      <AnimatePresence>
        {showShortcuts && (
          <ShortcutsModal onClose={() => setShowShortcuts(false)} />
        )}
      </AnimatePresence>

      {/* Quick Switcher */}
      <AnimatePresence>
        {showSwitcher && (
          <QuickSwitcher onClose={() => setShowSwitcher(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
