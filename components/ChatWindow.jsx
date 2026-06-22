'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Hash, Bell, Pin, Users, Search,
  Plus, Gift, Smile, Send, X,
  Edit2, Trash2, Reply, MoreHorizontal,
  CheckCheck, AlertCircle, Image,
  FileText, AtSign, ChevronDown
} from 'lucide-react'

// ============ MOCK DATA ============
const CURRENT_USER = { id: 'u1', username: 'yashsopro', displayName: 'Yash', color: '#9b6dff' }

const MOCK_MESSAGES = [
  {
    id: 'm1', userId: 'u2',
    username: 'sable', displayName: 'Sable',
    color: '#ff6eb4', avatar: 'S',
    content: 'yo welcome to SableSync everyone 🔥',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    reactions: [{ emoji: '🔥', count: 12, reacted: false }, { emoji: '👑', count: 5, reacted: true }],
    pinned: true,
  },
  {
    id: 'm2', userId: 'u3',
    username: 'kairo', displayName: 'Kairo',
    color: '#4dabf7', avatar: 'K',
    content: 'finally a platform that actually listens lmaooo',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
    reactions: [{ emoji: '💀', count: 8, reacted: false }],
    pinned: false,
  },
  {
    id: 'm3', userId: 'u4',
    username: 'nova', displayName: 'Nova',
    color: '#69db7c', avatar: 'N',
    content: 'the UI goes crazy hard ngl, who built this??',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    reactions: [],
    pinned: false,
  },
  {
    id: 'm4', userId: 'u2',
    username: 'sable', displayName: 'Sable',
    color: '#ff6eb4', avatar: 'S',
    content: 'we built it from scratch, every feature you guys asked for is in here',
    timestamp: new Date(Date.now() - 1000 * 60 * 55),
    reactions: [{ emoji: '🚀', count: 20, reacted: true }],
    pinned: false,
  },
  {
    id: 'm5', userId: 'u1',
    username: 'yashsopro', displayName: 'Yash',
    color: '#9b6dff', avatar: 'Y',
    content: 'badge system goes hard, already got 3 badges lol',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    reactions: [{ emoji: '😭', count: 3, reacted: false }],
    pinned: false,
  },
  {
    id: 'm6', userId: 'u5',
    username: 'phantom', displayName: 'Phantom',
    color: '#ffd43b', avatar: 'P',
    content: 'moved my whole server here already no cap',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    reactions: [],
    pinned: false,
  },
  {
    id: 'm7', userId: 'u3',
    username: 'kairo', displayName: 'Kairo',
    color: '#4dabf7', avatar: 'K',
    content: 'the live rooms feature is insane, was in one for 2 hours',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    reactions: [{ emoji: '🎤', count: 6, reacted: false }],
    pinned: false,
  },
]

const EMOJIS = ['👍','❤️','😂','😮','😢','😡','🔥','💯','🚀','✨','👑','💀']

// ============ UTILS ============
function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function formatDate(date) {
  const now   = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const msgDay= new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diff  = today - msgDay

  if (diff === 0) return 'Today'
  if (diff === 86400000) return 'Yesterday'
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  )
}

// ============ DATE DIVIDER ============
function DateDivider({ date }) {
  return (
    <div className="divider-text my-4 px-4">
      {formatDate(date)}
    </div>
  )
}

// ============ REACTION PILL ============
function ReactionPill({ emoji, count, reacted, onToggle }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{   scale: 0.95 }}
      onClick={onToggle}
      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold transition-all"
      style={{
        background: reacted
          ? 'rgba(155,109,255,0.2)'
          : 'rgba(255,255,255,0.05)',
        border: `1px solid ${reacted ? 'rgba(155,109,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
        color:  reacted ? 'var(--purple)' : 'var(--muted)',
      }}
    >
      <span>{emoji}</span>
      <span>{count}</span>
    </motion.button>
  )
}

// ============ EMOJI PICKER ============
function EmojiPicker({ onSelect, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1,   y: 0 }}
      exit={{    opacity: 0, scale: 0.9, y: 8 }}
      className="absolute bottom-full right-0 mb-2 p-2 rounded-sable z-50"
      style={{
        background: 'var(--surface)',
        border:     '1px solid var(--border)',
        boxShadow:  '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <div className="grid grid-cols-6 gap-1">
        {EMOJIS.map(emoji => (
          <button
            key={emoji}
            onClick={() => { onSelect(emoji); onClose() }}
            className="w-8 h-8 flex-center rounded text-lg transition-all hover:scale-125"
            style={{ background: 'transparent' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {emoji}
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ============ MESSAGE ACTIONS ============
function MessageActions({ message, isOwn, onReply, onEdit, onDelete, onReact }) {
  const [showEmoji, setShowEmoji] = useState(false)

  return (
    <div
      className="absolute -top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 z-10"
      style={{
        background: 'var(--surface)',
        border:     '1px solid var(--border)',
        borderRadius: '8px',
        padding:    '3px',
        boxShadow:  '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      {/* React */}
      <div className="relative">
        <button
          className="btn-icon p-1.5"
          onClick={() => setShowEmoji(e => !e)}
          title="Add Reaction"
        >
          <Smile size={14} />
        </button>
        <AnimatePresence>
          {showEmoji && (
            <EmojiPicker
              onSelect={emoji => onReact(message.id, emoji)}
              onClose={() => setShowEmoji(false)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Reply */}
      <button className="btn-icon p-1.5" onClick={() => onReply(message)} title="Reply">
        <Reply size={14} />
      </button>

      {/* Edit (own only) */}
      {isOwn && (
        <button className="btn-icon p-1.5" onClick={() => onEdit(message)} title="Edit">
          <Edit2 size={14} />
        </button>
      )}

      {/* Delete (own only) */}
      {isOwn && (
        <button
          className="btn-icon p-1.5"
          onClick={() => onDelete(message.id)}
          title="Delete"
          style={{ color: 'var(--red)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,107,107,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Trash2 size={14} />
        </button>
      )}

      <button className="btn-icon p-1.5" title="More">
        <MoreHorizontal size={14} />
      </button>
    </div>
  )
}

// ============ SINGLE MESSAGE ============
function MessageRow({ message, isOwn, showHeader, onReply, onEdit, onDelete, onReact }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="message-row group relative"
      style={{ paddingTop: showHeader ? '12px' : '2px' }}
    >
      {/* Avatar or spacer */}
      {showHeader ? (
        <div
          className="w-10 h-10 rounded-full flex-center text-white font-bold text-sm flex-shrink-0 mt-0.5 cursor-pointer"
          style={{ background: message.color, flexShrink: 0 }}
        >
          {message.avatar}
        </div>
      ) : (
        <div className="w-10 flex-shrink-0 flex-center">
          <span
            className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: 'var(--faint)', fontSize: '0.65rem' }}
          >
            {formatTime(message.timestamp)}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="message-content">
        {showHeader && (
          <div className="message-header">
            <span
              className="message-username"
              style={{ color: message.color }}
            >
              {message.displayName}
            </span>
            <span className="message-timestamp">
              {formatTime(message.timestamp)}
            </span>
            {message.pinned && (
              <span
                className="text-xs px-1.5 py-0.5 rounded font-medium"
                style={{
                  background: 'rgba(255,212,59,0.1)',
                  color:      'var(--yellow)',
                  fontSize:   '0.65rem',
                }}
              >
                📌 pinned
              </span>
            )}
          </div>
        )}

        <p className="message-text">{message.content}</p>

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {message.reactions.map((r, i) => (
              <ReactionPill
                key={i}
                emoji={r.emoji}
                count={r.count}
                reacted={r.reacted}
                onToggle={() => onReact(message.id, r.emoji)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hover Actions */}
      <MessageActions
        message={message}
        isOwn={isOwn}
        onReply={onReply}
        onEdit={onEdit}
        onDelete={onDelete}
        onReact={onReact}
      />
    </motion.div>
  )
}

// ============ REPLY PREVIEW ============
function ReplyPreview({ message, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{    opacity: 0, height: 0 }}
      className="flex items-center gap-3 px-4 py-2"
      style={{
        background: 'rgba(155,109,255,0.06)',
        borderTop:  '1px solid rgba(155,109,255,0.2)',
        borderLeft: '3px solid var(--purple)',
      }}
    >
      <Reply size={14} style={{ color: 'var(--purple)', flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold" style={{ color: message.color }}>
          {message.displayName}
        </span>
        <p className="text-xs truncate-text" style={{ color: 'var(--muted)' }}>
          {message.content}
        </p>
      </div>
      <button className="btn-icon p-1" onClick={onCancel}>
        <X size={14} />
      </button>
    </motion.div>
  )
}

// ============ EDIT MODAL ============
function EditModal({ message, onSave, onCancel }) {
  const [text, setText] = useState(message.content)

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSave(message.id, text) }
    if (e.key === 'Escape') onCancel()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{    opacity: 0 }}
      className="fixed inset-0 z-50 flex-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1   }}
        exit={{    scale: 0.9 }}
        className="card w-full max-w-lg mx-4"
        style={{ border: '1px solid var(--border)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">Edit Message</h3>
          <button className="btn-icon" onClick={onCancel}><X size={18} /></button>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          className="input resize-none"
          rows={3}
          autoFocus
        />
        <p className="text-xs mt-2" style={{ color: 'var(--faint)' }}>
          Enter to save · Escape to cancel
        </p>
        <div className="flex gap-2 mt-4">
          <button className="btn btn-ghost flex-1" onClick={onCancel}>Cancel</button>
          <button
            className="btn btn-primary flex-1"
            onClick={() => onSave(message.id, text)}
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ============ TYPING INDICATOR ============
function TypingIndicator({ users }) {
  if (!users.length) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{    opacity: 0, y: 4 }}
      className="flex items-center gap-2 px-4 py-1"
    >
      <div className="flex gap-0.5">
        {[0,1,2].map(i => (
          <motion.div
            key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: 'var(--muted)' }}
          />
        ))}
      </div>
      <span className="text-xs" style={{ color: 'var(--muted)' }}>
        <strong>{users.join(', ')}</strong>
        {users.length === 1 ? ' is' : ' are'} typing...
      </span>
    </motion.div>
  )
}

// ============ CHAT HEADER ============
function ChatHeader({ channelName, onToggleMembers, membersOpen }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
      style={{
        borderBottom: '1px solid var(--border)',
        background:   'var(--bg)',
      }}
    >
      <Hash size={20} style={{ color: 'var(--muted)', flexShrink: 0 }} />
      <h2 className="font-bold text-base flex-1">{channelName}</h2>

      <div className="flex items-center gap-1">
        <button className="btn-icon" title="Notifications"><Bell    size={18} /></button>
        <button className="btn-icon" title="Pinned Messages"><Pin   size={18} /></button>
        <button
          className="btn-icon"
          title="Member List"
          onClick={onToggleMembers}
          style={{ color: membersOpen ? 'var(--purple)' : undefined }}
        >
          <Users size={18} />
        </button>
        <div
          className="w-px h-5 mx-1"
          style={{ background: 'var(--border)' }}
        />
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-sable cursor-text"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', minWidth: '140px' }}
        >
          <Search size={14} style={{ color: 'var(--faint)' }} />
          <span className="text-sm" style={{ color: 'var(--faint)' }}>Search</span>
        </div>
      </div>
    </div>
  )
}

// ============ MESSAGE INPUT ============
function MessageInput({ channelName, replyTo, onClearReply, onSend, typingUsers }) {
  const [text,        setText]        = useState('')
  const [showEmoji,   setShowEmoji]   = useState(false)
  const [attachMenu,  setAttachMenu]  = useState(false)
  const textareaRef = useRef(null)

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  function submit() {
    if (!text.trim()) return
    onSend(text.trim())
    setText('')
    textareaRef.current?.focus()
  }

  // Auto resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 140) + 'px'
  }, [text])

  return (
    <div
      className="flex-shrink-0 px-4 pb-4 pt-2"
      style={{ background: 'var(--bg)' }}
    >
      <AnimatePresence>
        {replyTo && (
          <ReplyPreview message={replyTo} onCancel={onClearReply} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        <TypingIndicator users={typingUsers} />
      </AnimatePresence>

      <div
        className="flex items-end gap-2 rounded-sable px-3 py-2"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {/* Attach */}
        <div className="relative">
          <button
            className="btn-icon p-1.5 flex-shrink-0"
            onClick={() => setAttachMenu(a => !a)}
          >
            <Plus size={18} />
          </button>
          <AnimatePresence>
            {attachMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1,   y: 0 }}
                exit={{    opacity: 0, scale: 0.9, y: 8 }}
                className="absolute bottom-full left-0 mb-2 rounded-sable overflow-hidden"
                style={{
                  background: 'var(--surface)',
                  border:     '1px solid var(--border)',
                  boxShadow:  '0 8px 24px rgba(0,0,0,0.4)',
                  minWidth:   '160px',
                }}
              >
                {[
                  { icon: <Image    size={15} />, label: 'Upload Image'    },
                  { icon: <FileText size={15} />, label: 'Upload File'     },
                  { icon: <Gift     size={15} />, label: 'Send Gift'       },
                  { icon: <AtSign   size={15} />, label: 'Mention Someone' },
                ].map((item, i) => (
                  <button
                    key={i}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors text-left"
                    style={{ color: 'var(--muted)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--hover)'
                      e.currentTarget.style.color      = 'var(--text)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color      = 'var(--muted)'
                    }}
                    onClick={() => setAttachMenu(false)}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder={`Message #${channelName}`}
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none text-sm"
          style={{
            color:      'var(--text)',
            lineHeight: '1.5',
            maxHeight:  '140px',
            fontFamily: 'inherit',
          }}
        />

        {/* Right Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="relative">
            <button
              className="btn-icon p-1.5"
              onClick={() => setShowEmoji(e => !e)}
            >
              <Smile size={18} />
            </button>
            <AnimatePresence>
              {showEmoji && (
                <EmojiPicker
                  onSelect={emoji => setText(t => t + emoji)}
                  onClose={() => setShowEmoji(false)}
                />
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{   scale: 0.9 }}
            onClick={submit}
            disabled={!text.trim()}
            className="w-8 h-8 rounded-sable flex-center transition-all"
            style={{
              background: text.trim()
                ? 'linear-gradient(135deg, var(--purple), var(--pink))'
                : 'var(--hover)',
              color: text.trim() ? 'white' : 'var(--faint)',
            }}
          >
            <Send size={15} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

// ============ SCROLL TO BOTTOM BUTTON ============
function ScrollToBottomBtn({ onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1   }}
      exit={{    opacity: 0, scale: 0.8 }}
      onClick={onClick}
      className="absolute bottom-24 right-6 w-10 h-10 rounded-full flex-center"
      style={{
        background: 'var(--surface)',
        border:     '1px solid var(--border)',
        boxShadow:  '0 4px 12px rgba(0,0,0,0.4)',
        color:      'var(--muted)',
      }}
    >
      <ChevronDown size={18} />
    </motion.button>
  )
}

// ============ MAIN CHAT WINDOW ============
export default function ChatWindow({ channelName = 'general', onToggleMembers, membersOpen }) {
  const [messages,    setMessages]    = useState(MOCK_MESSAGES)
  const [replyTo,     setReplyTo]     = useState(null)
  const [editMsg,     setEditMsg]     = useState(null)
  const [showScroll,  setShowScroll]  = useState(false)
  const [typingUsers] = useState(['Nova', 'Kairo'])

  const bottomRef   = useRef(null)
  const scrollRef   = useRef(null)

  // Scroll to bottom on mount + new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleScroll() {
    const el = scrollRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100
    setShowScroll(!atBottom)
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function handleSend(text) {
    const newMsg = {
      id:          `m${Date.now()}`,
      userId:      CURRENT_USER.id,
      username:    CURRENT_USER.username,
      displayName: CURRENT_USER.displayName,
      color:       CURRENT_USER.color,
      avatar:      'Y',
      content:     replyTo ? `> ${replyTo.displayName}: ${replyTo.content}\n${text}` : text,
      timestamp:   new Date(),
      reactions:   [],
      pinned:      false,
    }
    setMessages(prev => [...prev, newMsg])
    setReplyTo(null)
  }

  function handleDelete(id) {
    setMessages(prev => prev.filter(m => m.id !== id))
  }

  function handleEdit(id, newContent) {
    setMessages(prev =>
      prev.map(m => m.id === id ? { ...m, content: newContent } : m)
    )
    setEditMsg(null)
  }

  function handleReact(msgId, emoji) {
    setMessages(prev => prev.map(msg => {
      if (msg.id !== msgId) return msg
      const existing = msg.reactions.find(r => r.emoji === emoji)
      if (existing) {
        return {
          ...msg,
          reactions: msg.reactions.map(r =>
            r.emoji === emoji
              ? { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted }
              : r
          ).filter(r => r.count > 0),
        }
      }
      return {
        ...msg,
        reactions: [...msg.reactions, { emoji, count: 1, reacted: true }],
      }
    }))
  }

  // Group messages — show header if different user or >5min gap
  function shouldShowHeader(msg, prev) {
    if (!prev) return true
    if (msg.userId !== prev.userId) return true
    return (msg.timestamp - prev.timestamp) > 1000 * 60 * 5
  }

  // Insert date dividers
  const rendered = []
  messages.forEach((msg, i) => {
    const prev = messages[i - 1]
    if (!prev || !isSameDay(msg.timestamp, prev.timestamp)) {
      rendered.push({ type: 'divider', date: msg.timestamp, key: `d-${i}` })
    }
    rendered.push({ type: 'message', msg, showHeader: shouldShowHeader(msg, prev), key: msg.id })
  })

  return (
    <div className="chat-area">
      {/* Header */}
      <ChatHeader
        channelName={channelName}
        onToggleMembers={onToggleMembers}
        membersOpen={membersOpen}
      />

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto py-4 relative"
      >
        {/* Welcome Banner */}
        <div className="px-4 mb-6">
          <div
            className="w-12 h-12 rounded-sable-lg flex-center mb-3"
            style={{ background: 'rgba(155,109,255,0.15)', border: '1px solid rgba(155,109,255,0.3)' }}
          >
            <Hash size={24} style={{ color: 'var(--purple)' }} />
          </div>
          <h2 className="text-2xl font-black mb-1">Welcome to #{channelName}!</h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            This is the start of the #{channelName} channel.
          </p>
        </div>

        {/* Message List */}
        {rendered.map(item =>
          item.type === 'divider' ? (
            <DateDivider key={item.key} date={item.date} />
          ) : (
            <MessageRow
              key={item.key}
              message={item.msg}
              isOwn={item.msg.userId === CURRENT_USER.id}
              showHeader={item.showHeader}
              onReply={setReplyTo}
              onEdit={setEditMsg}
              onDelete={handleDelete}
              onReact={handleReact}
            />
          )
        )}

        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom */}
      <AnimatePresence>
        {showScroll && <ScrollToBottomBtn onClick={scrollToBottom} />}
      </AnimatePresence>

      {/* Input */}
      <MessageInput
        channelName={channelName}
        replyTo={replyTo}
        onClearReply={() => setReplyTo(null)}
        onSend={handleSend}
        typingUsers={typingUsers}
      />

      {/* Edit Modal */}
      <AnimatePresence>
        {editMsg && (
          <EditModal
            message={editMsg}
            onSave={handleEdit}
            onCancel={() => setEditMsg(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
