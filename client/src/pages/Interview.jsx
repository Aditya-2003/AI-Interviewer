import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, Loader2, ArrowLeft, Circle } from 'lucide-react'

// ─── Sub-components ────────────────────────────────────────────────────────

function InterviewHeader({ interview }) {

    return (
        <div className="shrink-0 bg-[#0f1117] border-b border-white/6 px-6 py-4 flex items-center justify-between">
            {/* Back button row */}
                <div className="flex items-center gap-4">
            <div className="shrink-0 ">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center  text-slate-500 hover:text-slate-300 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
            </div>
                <div>
                    <h1 className="text-base font-semibold text-white">
                        {interview?.role ?? 'Interview'} Interview
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Experience: {interview?.experienceLevel ?? '—'}
                    </p>
                </div>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Circle className="w-2 h-2 fill-emerald-400 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">
                    {interview?.status === 'completed' ? 'Completed' : 'Active'}
                </span>
            </div>
        </div>
    )
}

function MessageBubble({ message }) {
    const isAI = message.role === 'ai'

    return (
        <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[75%] ${isAI ? 'order-2' : ''}`}>
                {/* Role label */}
                <p className={`text-xs font-medium mb-1.5 ${isAI ? 'text-indigo-400 ml-1' : 'text-slate-400 mr-1 text-right'}`}>
                    {isAI ? 'Interviewer' : 'You'}
                </p>

                {/* Bubble */}
                <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap
            ${isAI
                            ? 'bg-[#1c1f2e] border border-white/8 text-slate-100 rounded-tl-sm'
                            : 'bg-indigo-600 text-white rounded-tr-sm'
                        }`}
                >
                    {message.content}
                </div>
            </div>
        </div>
    )
}

function ThinkingIndicator() {
    return (
        <div className="flex justify-start">
            <div className="max-w-[75%]">
                <p className="text-xs font-medium text-indigo-400 mb-1.5 ml-1">Interviewer</p>
                <div className="bg-[#1c1f2e] border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
            </div>
        </div>
    )
}

function MessageList({ messages, loading, bottomRef }) {
    return (
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {messages.length === 0 && !loading && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-slate-600 text-sm">Loading interview…</p>
                </div>
            )}

            {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
            ))}

            {loading && <ThinkingIndicator />}

            {/* Scroll anchor */}
            <div ref={bottomRef} />
        </div>
    )
}

function AnswerInput({ value, onChange, onSend, loading, disabled }) {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (!loading && value.trim()) onSend()
        }
    }

    return (
        <div className="shrink-0 bg-[#0f1117] border-t border-white/6 px-6 py-4">
            <div className="flex items-end gap-3 max-w-4xl mx-auto">
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading || disabled}
                    placeholder="Type your answer… (Enter to send, Shift+Enter for new line)"
                    rows={3}
                    maxLength={2000}
                    className="flex-1 bg-[#1c1f2e] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm
                     placeholder-slate-600 focus:outline-none focus:border-indigo-500/40 resize-none
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors leading-relaxed"
                />
                <button
                    onClick={onSend}
                    disabled={loading || !value.trim() || disabled}
                    className="w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40
                     disabled:cursor-not-allowed text-white flex items-center justify-center
                     transition-all active:scale-95 shrink-0 mb-0.5"
                >
                    {loading
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Send className="w-4 h-4" />
                    }
                </button>
            </div>
            <p className="text-xs text-slate-600 text-center mt-2">
                Enter to send · Shift+Enter for new line
            </p>
        </div>
    )
}

//  Feedback Panel 

function FeedbackPanel({ feedback, onDashboard }) {
    if (!feedback) return null;

    // Parse feedback if it's a string
    let parsedFeedback = feedback;
    if (typeof feedback === 'string') {
        try {
            parsedFeedback = JSON.parse(feedback);
        } catch (err) {
            console.error("Failed to parse feedback:", err);
            return (
                <div className="bg-[#0f1117] min-h-screen px-6 py-10 text-white flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <p className="text-red-400 text-sm">Error displaying feedback</p>
                        <button
                            onClick={onDashboard}
                            className="text-indigo-400 hover:text-indigo-300 text-sm underline"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="bg-[#0f1117] min-h-screen px-6 py-10 text-white">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header */}
                <h1 className="text-2xl font-bold">Interview Feedback</h1>

                {/* Score Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ScoreCard title="Technical" data={parsedFeedback.technical} />
                    <ScoreCard title="Problem Solving" data={parsedFeedback.problemSolving} />
                    <ScoreCard title="Communication" data={parsedFeedback.communication} />
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid md:grid-cols-2 gap-6">
                    <ListCard title="Strengths" items={parsedFeedback.strengths || []} color="green" />
                    <ListCard title="Weaknesses" items={parsedFeedback.weaknesses || []} color="red" />
                </div>

                {/* Suggestions */}
                <ListCard title="Suggestions for Improvement" items={parsedFeedback.suggestions || []} color="blue" />

                {/* Final Recommendation */}
                <div className="bg-[#1c1f2e] border border-white/10 rounded-xl p-6">
                    <h2 className="text-lg font-semibold mb-2">Final Recommendation</h2>
                    <p className="text-xl font-bold text-indigo-400">
                        {parsedFeedback.recommendation?.decision || 'Pending'}
                    </p>
                    <p className="text-sm text-slate-300 mt-2">
                        {parsedFeedback.recommendation?.reason || 'No details available'}
                    </p>
                </div>

                {/* Button */}
                <div className="flex justify-center">
                    <button
                        onClick={onDashboard}
                        className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg"
                    >
                        Back to Dashboard
                    </button>
                </div>

            </div>
        </div>
    );
}

function ScoreCard({ title, data }) {
    if (!data) {
        return (
            <div className="bg-[#1c1f2e] border border-white/10 rounded-xl p-5">
                <h3 className="text-sm text-slate-400">{title}</h3>
                <p className="text-3xl font-bold text-slate-600">—</p>
                <p className="text-sm text-slate-400 mt-2">No data available</p>
            </div>
        );
    }

    return (
        <div className="bg-[#1c1f2e] border border-white/10 rounded-xl p-5">
            <h3 className="text-sm text-slate-400">{title}</h3>
            <p className="text-3xl font-bold text-indigo-400">{data.score ?? '—'}/10</p>
            <p className="text-sm text-slate-300 mt-2">{data.explanation || 'No details'}</p>
        </div>
    );
}

function ListCard({ title, items, color }) {
    const colorMap = {
        green: "text-green-400",
        red: "text-red-400",
        blue: "text-blue-400"
    };

    const itemsArray = Array.isArray(items) ? items : [];

    return (
        <div className="bg-[#1c1f2e] border border-white/10 rounded-xl p-5">
            <h3 className={`font-semibold mb-3 ${colorMap[color]}`}>
                {title}
            </h3>
            {itemsArray.length === 0 ? (
                <p className="text-sm text-slate-400 italic">None identified</p>
            ) : (
                <ul className="space-y-2 text-sm text-slate-300">
                    {itemsArray.map((item, i) => (
                        <li key={i}>• {item}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function InterviewPage() {
    const { sessionId } = useParams()
    const navigate = useNavigate()
    const bottomRef = useRef(null)
    const token = localStorage.getItem("token");

    const [interview, setInterview] = useState(null)
    const [messages, setMessages] = useState([])
    const [feedback, setFeedback] = useState(null)
    const [input, setInput] = useState('')
    const [isCompleted, setIsCompleted] = useState(false)
    const [completionPhase, setCompletionPhase] = useState('normal') // normal|wrapup|loading|feedback
    const [loading, setLoading] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const [error, setError] = useState('')

    // ── Load session on mount (refresh persistence) ──
    useEffect(() => {
        const loadSession = async () => {
            try {
                const url = `/api/interview/${sessionId}`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem("loggedInUser");
                    localStorage.removeItem("token");
                    navigate('/login');
                }
                if (!response.ok) {
                    const result = await response.json();
                    throw new Error(result.error || 'Failed to load interview session');
                }

                const data = await response.json();
                console.log("Loaded session data:", data);

                setInterview({
                    role: data.role,
                    experienceLevel: data.experienceLevel,
                    status: data.status,
                })

                if (data.status === 'completed') {
                    setIsCompleted(true)
                    setFeedback(data.feedback ?? '')
                    setCompletionPhase('feedback')
                } else {
                    setIsCompleted(false)
                    setFeedback(null)
                    setCompletionPhase('normal')
                }

                // Expect data.messages: [{ role: 'ai'|'user', content: '...' }]
                setMessages(data.conversation ?? [])
            } catch (err) {
                setError('Could not load interview session.')
            } finally {
                setPageLoading(false)
            }
        }
        loadSession()
    }, [sessionId, navigate])

    // ── Auto-scroll on new messages ──
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, loading])

    // ── Send answer ──
    const handleSend = async () => {
        const trimmed = input.trim()
        if (!trimmed || loading) return

        const userMessage = { role: 'user', content: trimmed }

        // 1. Append user message immediately
        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setLoading(true)
        setError('')


        try {
            const url = `/api/interview/message`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    sessionId,
                    message: trimmed,
                })
            });

            if (response.status === 401) {
                localStorage.removeItem("loggedInUser");
                localStorage.removeItem("token");
                navigate('/login');
            }

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Failed to send message');
            }

            const data = await response.json();
            console.log("Received AI response:", data);

            if (data.interviewCompleted) {
                setInterview(prev => ({
                    ...prev,
                    status: "completed"
                }))

                const wrapUpMessage = "That wraps up the interview. Thank you for your time today. We'll review everything and get back to you shortly."

                setMessages(prev => [...prev, { role: 'ai', content: wrapUpMessage }])
                setIsCompleted(true)
                setFeedback(data.feedback ?? '')
                setCompletionPhase('wrapup')

                // Show the wrap-up message briefly, then display loading screen, then feedback panel.
                setTimeout(() => {
                    setCompletionPhase('loading')
                    setTimeout(() => {
                        setCompletionPhase('feedback')
                    }, 2000)
                }, 800)

                return
            }
            
            if (!data.reply) throw new Error("Invalid AI response")
                
                // Server sends { reply: aiReply }
                const aiMessage = { role: 'ai', content: data.reply }
                
                // 3. Append AI response
                setMessages((prev) => [...prev, aiMessage])
            } catch (err) {
                console.error("Error sending message:", err);
            setError('Failed to send message. Please try again.')
            // Remove the optimistically added user message on failure
            setMessages((prev) => prev.slice(0, -1))
            setInput(trimmed)
        } finally {
            setLoading(false)
        }
    }
    
    // ── Loading screen ──
    if (pageLoading) {
        return (
            <div className="min-h-screen bg-[#0a0c12] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                    <p className="text-slate-500 text-sm">Loading interview session…</p>
                </div>
            </div>
        )
    }

    // ── Error screen ──
    if (error && messages.length === 0) {
        return (
            <div className="min-h-screen bg-[#0a0c12] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-red-400 text-sm">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-indigo-400 hover:text-indigo-300 text-sm underline"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    // ── Completion states ──
    if (completionPhase === 'feedback') {
        return (
            <div className="flex flex-col min-h-screen bg-[#0a0c12]">
                <FeedbackPanel
                    feedback={feedback}
                    onDashboard={() => navigate('/dashboard')}
                />
            </div>
        )
    }

    if (completionPhase === 'loading') {
        return (
            <div className="min-h-screen bg-[#0a0c12] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                    <p className="text-slate-400 text-sm">Wrapping up interview and generating feedback...</p>
                </div>
            </div>
        )
    }

    // ── Main interview screen ──
    return (
        <div className="flex flex-col h-screen bg-[#0a0c12]">

            {/* Header */}
            <InterviewHeader interview={interview} />

            {/* Messages */}
            <MessageList messages={messages} loading={loading} bottomRef={bottomRef} />

            {/* Inline send error */}
            {error && messages.length > 0 && (
                <p className="text-xs text-red-400 text-center pb-1 shrink-0">{error}</p>
            )}

            <AnswerInput
                value={input}
                onChange={setInput}
                onSend={handleSend}
                loading={loading}
                disabled={isCompleted}
            />
        </div>
    )
}