import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  toolCalls?: string[]
  timestamp: Date
}

interface ThinkingState {
  isThinking: boolean
  currentTool?: string
  message?: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function ChatAssistantDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm here to help you find a great car deal. You can ask me about car prices, specific models, or what to look for when buying.",
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [thinkingState, setThinkingState] = useState<ThinkingState>({
    isThinking: false
  })
  const [width, setWidth] = useState(() => {
    // Responsive default width
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? window.innerWidth : 448 // Full width on mobile, 28rem on desktop
    }
    return 448
  })
  const [isResizing, setIsResizing] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)
  const currentMessageRef = useRef<string>('')
  const resizeStartX = useRef(0)
  const resizeStartWidth = useRef(0)
  const pendingMessageRef = useRef<string | null>(null)

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev)
    
    const handleToggleWithMessage = (event: Event) => {
      const customEvent = event as CustomEvent
      setIsOpen(true)
      
      // If there's an initial message in the event, store it for processing
      if (customEvent.detail?.message) {
        pendingMessageRef.current = customEvent.detail.message
      }
    }
    
    const handleResize = () => {
      // Auto-adjust width on mobile
      if (window.innerWidth < 768) {
        setWidth(window.innerWidth)
      }
    }
    
    window.addEventListener('toggle-ai-chat', handleToggle)
    window.addEventListener('open-ai-chat-with-message', handleToggleWithMessage)
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('toggle-ai-chat', handleToggle)
      window.removeEventListener('open-ai-chat-with-message', handleToggleWithMessage)
      window.removeEventListener('resize', handleResize)
      // Clean up EventSource on unmount
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinkingState])

  // Handle pending message when drawer opens
  useEffect(() => {
    if (isOpen && pendingMessageRef.current && !isStreaming) {
      const messageToSend = pendingMessageRef.current
      pendingMessageRef.current = null
      
      // Small delay to ensure the drawer is fully rendered
      setTimeout(() => {
        sendMessage(messageToSend)
      }, 100)
    }
  }, [isOpen, isStreaming])

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const deltaX = resizeStartX.current - e.clientX
      const newWidth = Math.min(
        Math.max(resizeStartWidth.current + deltaX, 320), // Min width 320px
        window.innerWidth * 0.9 // Max 90% of viewport
      )
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  const handleResizeStart = (e: React.MouseEvent) => {
    setIsResizing(true)
    resizeStartX.current = e.clientX
    resizeStartWidth.current = width
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsStreaming(true)
    currentMessageRef.current = ''

    // Show immediate thinking indicator
    setThinkingState({
      isThinking: true,
      message: 'Connecting to AI...',
    })

    try {
      // Prepare history for API (exclude system messages)
      const history = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }))

      const response = await fetch(`${API_BASE_URL}/api/llm/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text.trim(),
          history: history,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      let buffer = ''
      let assistantMessageAdded = false
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.trim() || !line.startsWith('data: ')) continue
          
          const data = line.slice(6) // Remove 'data: ' prefix
          
          try {
            const event = JSON.parse(data)
            
            switch (event.type) {
              case 'connected':
                console.log('[SSE] Connected to stream')
                setThinkingState({
                  isThinking: true,
                  message: 'Connected',
                })
                break

              case 'thinking':
                console.log('[SSE] AI is thinking')
                setThinkingState({
                  isThinking: true,
                  message: event.message || 'Thinking...',
                })
                break
                
              case 'content':
                // Clear thinking state when content starts arriving
                if (currentMessageRef.current.length === 0) {
                  setThinkingState({ isThinking: false })
                  
                  // Add assistant message only when first content arrives
                  if (!assistantMessageAdded) {
                    assistantMessageAdded = true
                    const assistantMessage: Message = {
                      role: 'assistant',
                      content: '',
                      timestamp: new Date(),
                    }
                    setMessages(prev => [...prev, assistantMessage])
                  }
                }
                
                currentMessageRef.current += event.content
                setMessages(prev => {
                  const newMessages = [...prev]
                  const lastMessage = newMessages[newMessages.length - 1]
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content = currentMessageRef.current
                  }
                  return newMessages
                })
                break
                
              case 'tool_call':
                console.log('[SSE] Tool called:', event.tool, event.message)
                setThinkingState({
                  isThinking: true,
                  currentTool: event.tool,
                  message: event.message || `Calling ${event.tool}...`,
                })
                break
                
              case 'tool_executing':
                console.log('[SSE] Tool executing:', event.tool, event.message)
                setThinkingState({
                  isThinking: true,
                  currentTool: event.tool,
                  message: event.message || `Using ${event.tool} tool...`,
                })
                break
                
              case 'tool_result':
                console.log('[SSE] Tool result received:', event.tool)
                setThinkingState({
                  isThinking: true,
                  message: event.message || 'Analyzing results...',
                })
                break
                
              case 'generating':
                console.log('[SSE] Generating response')
                setThinkingState({
                  isThinking: true,
                  message: event.message || 'Generating response...',
                })
                break
                
              case 'done':
                console.log('[SSE] Stream complete')
                setThinkingState({ isThinking: false })
                setIsStreaming(false)
                break
                
              case 'error':
                console.error('[SSE] Error:', event.message)
                
                // Add error message to chat
                if (!assistantMessageAdded) {
                  assistantMessageAdded = true
                  const errorMessage: Message = {
                    role: 'assistant',
                    content: `❌ ${event.message || 'Failed to get response. Please try again.'}`,
                    timestamp: new Date(),
                  }
                  setMessages(prev => [...prev, errorMessage])
                } else {
                  setMessages(prev => {
                    const newMessages = [...prev]
                    const lastMessage = newMessages[newMessages.length - 1]
                    if (lastMessage && lastMessage.role === 'assistant') {
                      lastMessage.content = `❌ ${event.message || 'Failed to get response. Please try again.'}`
                    }
                    return newMessages
                  })
                }
                
                setThinkingState({ isThinking: false })
                setIsStreaming(false)
                break
            }
          } catch (parseError) {
            console.error('[SSE] Failed to parse event:', parseError)
          }
        }
      }

      // Final cleanup
      setThinkingState({ isThinking: false })
      setIsStreaming(false)

    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }])
      setThinkingState({ isThinking: false })
      setIsStreaming(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const handleQuickAction = (text: string) => {
    sendMessage(text)
  }

  // Clean up markdown content (convert HTML breaks to markdown)
  const cleanMarkdown = (content: string): string => {
    return content
      .replace(/<br\s*\/?>/gi, '  \n') // Convert <br> to markdown line breaks
      .replace(/&nbsp;/g, ' ') // Convert HTML spaces
      .replace(/&lt;/g, '<') // Convert HTML entities
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Drawer */}
      <div 
        className="fixed inset-y-0 right-0 z-50 bg-slate-900 shadow-xl border-l border-slate-800 flex flex-col"
        style={{ 
          width: `${width}px`,
          maxWidth: '100vw',
          transition: isResizing ? 'none' : 'transform 300ms ease-in-out'
        }}
      >
        {/* Resize Handle (hidden on mobile) */}
        <div
          className="hidden md:block absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize group hover:bg-sky-500/50 transition-colors"
          onMouseDown={handleResizeStart}
          title="Drag to resize"
        >
          <div className="absolute left-0 top-0 bottom-0 w-4 -translate-x-1.5" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">AI Assistant</h2>
            <p className="text-xs text-slate-400">Ask about prices, cars, or advice</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    AI
                  </div>
                )}
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    You
                  </div>
                )}
                <div className={`rounded-lg p-3 text-sm max-w-[85%] ${
                  message.role === 'user' 
                    ? 'bg-sky-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  {message.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="mb-1">{children}</li>,
                          code: ({ inline, children, ...props }: any) => 
                            inline ? (
                              <code className="bg-slate-700 px-1 py-0.5 rounded text-sky-400" {...props}>
                                {children}
                              </code>
                            ) : (
                              <code className="block bg-slate-950 p-2 rounded my-2 overflow-x-auto" {...props}>
                                {children}
                              </code>
                            ),
                          pre: ({ children }) => <pre className="bg-slate-950 p-2 rounded my-2 overflow-x-auto">{children}</pre>,
                          strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                          a: ({ children, href }) => (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 underline">
                              {children}
                            </a>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-slate-600 pl-4 italic text-slate-400 my-2">
                              {children}
                            </blockquote>
                          ),
                          h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-4 text-white">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3 text-white">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-base font-bold mb-1 mt-2 text-white">{children}</h3>,
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-4">
                              <table className="min-w-full border-collapse border border-slate-700">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({ children }) => (
                            <thead className="bg-slate-800">
                              {children}
                            </thead>
                          ),
                          tbody: ({ children }) => (
                            <tbody className="divide-y divide-slate-700">
                              {children}
                            </tbody>
                          ),
                          tr: ({ children }) => (
                            <tr className="hover:bg-slate-800/50 transition-colors">
                              {children}
                            </tr>
                          ),
                          th: ({ children }) => (
                            <th className="px-4 py-2 text-left text-xs font-semibold text-sky-400 uppercase tracking-wider border border-slate-700">
                              {children}
                            </th>
                          ),
                          td: ({ children }) => (
                            <td className="px-4 py-3 text-sm text-slate-300 border border-slate-700">
                              {children}
                            </td>
                          ),
                          hr: () => <hr className="my-4 border-slate-700" />,
                          input: ({ checked, ...props }: any) => (
                            <input
                              type="checkbox"
                              checked={checked}
                              readOnly
                              className="mr-2 accent-sky-500"
                              {...props}
                            />
                          ),
                        }}
                      >
                        {cleanMarkdown(message.content)}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Thinking indicator */}
            {thinkingState.isThinking && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  AI
                </div>
                <div className="bg-slate-800 rounded-lg rounded-tl-none p-3 text-sm text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-xs">{thinkingState.message || 'Thinking...'}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex gap-2 overflow-x-auto pb-2 mb-2">
            <button 
              onClick={() => handleQuickAction('What affects car prices?')}
              className="text-xs bg-slate-800 text-sky-400 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-slate-700 transition-colors disabled:opacity-50"
              disabled={isStreaming}
            >
              What affects car prices?
            </button>
            <button 
              onClick={() => handleQuickAction('Help me choose a reliable car under $20,000')}
              className="text-xs bg-slate-800 text-sky-400 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-slate-700 transition-colors disabled:opacity-50"
              disabled={isStreaming}
            >
              Help me choose
            </button>
          </div>
          <form onSubmit={handleSubmit} className="relative">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask something..."
              disabled={isStreaming}
              className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 pl-3 pr-10 text-sm text-slate-100 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button 
              type="submit"
              disabled={isStreaming || !inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sky-500 hover:text-sky-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
