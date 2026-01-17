
'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface Message {
    id: string
    sender_id: string
    message: string
    created_at: string
}

interface ChatWindowProps {
    matchId: string
    currentUserId: string
    initialMessages: Message[]
}

export function ChatWindow({ matchId, currentUserId, initialMessages }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [newMessage, setNewMessage] = useState('')
    const supabase = createClient()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const channel = supabase
            .channel(`match_chat:${matchId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `match_id=eq.${matchId}`,
                },
                (payload) => {
                    // Only add if not already in list (prevent duplicates from manual add)
                    setMessages((prev) => {
                        if (prev.find(m => m.id === payload.new.id)) return prev;
                        return [...prev, payload.new as Message]
                    })
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [matchId, supabase])

    const [errorMsg, setErrorMsg] = useState<string | null>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const msgContent = newMessage
        setNewMessage('') // Optimistic clear
        setErrorMsg(null)

        const tempId = Math.random().toString(36).substring(7);
        const optimisticMsg: Message = {
            id: tempId,
            sender_id: currentUserId,
            message: msgContent,
            created_at: new Date().toISOString()
        };

        // Optimistic UI update immediately
        setMessages(prev => [...prev, optimisticMsg]);

        const { data, error } = await supabase.from('messages').insert({
            match_id: matchId,
            sender_id: currentUserId,
            message: msgContent,
        }).select().single()

        if (error) {
            console.error('Error sending message:', error)
            setErrorMsg(`Failed to send: ${error.message} (Code: ${error.code})`)
            // Revert on error
            setMessages(prev => prev.filter(m => m.id !== tempId));
            setNewMessage(msgContent)
        } else if (data) {
            // Replace temp message with real one
            setMessages(prev => prev.map(m => m.id === tempId ? data : m));
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-200 dark:bg-surface-dark rounded-2xl border border-slate-300 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-300 dark:border-slate-700 bg-slate-300/50 dark:bg-slate-800/50">
                <h3 className="font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">chat</span> Match Chat
                </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.sender_id === currentUserId
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${isMe
                                    ? 'bg-primary text-background-dark font-medium rounded-tr-none'
                                    : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                                    }`}
                            >
                                {msg.message}
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-300 dark:border-slate-700 bg-slate-300/30 dark:bg-slate-800/30 flex gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white dark:bg-slate-900 border-none"
                />
                <Button type="submit" size="sm" disabled={!newMessage.trim()}>
                    <span className="material-symbols-outlined">send</span>
                </Button>
            </form>
            {errorMsg && (
                <div className="px-4 pb-2 text-xs text-red-500 font-bold bg-slate-300/30 dark:bg-slate-800/30">
                    {errorMsg}
                </div>
            )}
        </div>
    )
}
