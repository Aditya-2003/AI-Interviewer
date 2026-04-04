import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Cpu, ArrowRight, ChevronDown, Target, Zap, BarChart2,
  ShieldCheck, Github, CheckCircle2, Circle,
} from 'lucide-react'
import { BsRobot } from "react-icons/bs";


// ─── Utility: fade-in on scroll ────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('is-visible') },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

// ─── Read user from localStorage ────────────────────────────────────────────
function useLocalUser() {
  const raw = localStorage.getItem('loggedInUser')
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed === 'string') return { username: parsed }
    if (parsed && typeof parsed === 'object') return parsed
    return { username: String(parsed) }
  } catch {
    return { username: raw }
  }
}

// ─── Navbar ─────────────────────────────────────────────────────────────────
function Navbar() {
  const user = useLocalUser()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#07090f]/95 backdrop-blur-md border-b border-white/6 shadow-xl' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-900/50 group-hover:bg-indigo-500 transition-colors">
            <BsRobot className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white tracking-tight text-base">InterviewAI</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 hover:text-white text-sm font-medium transition-all"
            ><Circle className="w-1.5 h-1.5 fill-green-500 text-green-500" />
              {user.username?.split(' ')[0] ?? 'Dashboard'}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 hover:text-white text-sm font-medium transition-all"
            >
              Go to Dashboard
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-slate-400 hover:text-white font-medium px-4 py-2 rounded-xl hover:bg-white/6 transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-900/40"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const user = useLocalUser()
  const navigate = useNavigate()

  const handleStart = () => navigate(user ? '/dashboard' : '/login')

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-5 pt-20 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-700/8 rounded-full blur-[100px]" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />
        {/* Radial fade over grid */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, #07090f 100%)'
        }} />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/8 text-indigo-300 text-xs font-medium mb-7 animate-fade-in">
          <Circle className="w-1.5 h-1.5 fill-indigo-400 text-indigo-400 animate-pulse" />
          AI-Powered Interview Practice
        </div>

        {/* Heading */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6 animate-slide-up">
          Crack Your Next<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300">
            Interview with AI
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto mb-9 animate-slide-up [animation-delay:100ms]">
          Practice real interview questions with AI, get instant feedback, and improve faster than any other method.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up [animation-delay:200ms]">
          <button
            onClick={handleStart}
            className="group flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-all shadow-xl shadow-indigo-900/40 active:scale-95 text-sm"
          >
            Start Interview
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 text-slate-400 hover:text-white font-medium px-6 py-3.5 rounded-xl border border-white/8 hover:border-white/16 bg-white/4 hover:bg-white/7 text-sm transition-all"
          >
            Learn More
            <ChevronDown className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
        <ChevronDown className="w-5 h-5 text-slate-400" />
      </div>
    </section>
  )
}

// ─── How It Works ────────────────────────────────────────────────────────────
function HowItWorks() {
  const ref = useFadeIn()
  const steps = [
    { num: '01', title: 'Choose Role & Experience', desc: 'Pick your target job role and experience level — from Fresher to Senior.' },
    { num: '02', title: 'AI Asks Real Questions', desc: 'Our AI conducts a structured interview with questions tailored to your role.' },
    { num: '03', title: 'Get Feedback & Improve', desc: 'Receive instant, detailed feedback on every answer and track your growth.' },
  ]

  return (
    <section id="how-it-works" className="py-24 px-5 fade-section" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Three steps to interview mastery</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

          {steps.map((step, i) => (
            <div key={i} className="relative bg-[#0f1117] border border-white/7 rounded-2xl p-6 hover:border-indigo-500/30 hover:bg-[#111320] transition-all duration-300 group">
              <div className="w-11 h-11 rounded-xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:bg-indigo-600/25 transition-colors">
                <span className="text-indigo-400 font-bold text-sm font-mono">{step.num}</span>
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Features ────────────────────────────────────────────────────────────────
function Features() {
  const ref = useFadeIn()
  const features = [
    { icon: Target,     color: 'indigo',  title: 'Real Interview Questions',  desc: 'Questions sourced from actual interviews at top companies, tailored to your role and level.' },
    { icon: Zap,        color: 'amber',   title: 'Instant AI Feedback',       desc: 'Get detailed, actionable feedback on every answer within seconds — no waiting, no guessing.' },
    { icon: BarChart2,  color: 'emerald', title: 'Performance Tracking',      desc: 'Monitor your progress across sessions, identify weak areas, and see yourself improve over time.' },
    { icon: ShieldCheck,color: 'violet',  title: 'Secure & Personalized',     desc: 'Your data stays private. Interviews adapt to your resume and grow with you as you improve.' },
  ]

  const colorMap = {
    indigo:  { bg: 'bg-indigo-600/15',  border: 'border-indigo-500/20',  text: 'text-indigo-400'  },
    amber:   { bg: 'bg-amber-600/15',   border: 'border-amber-500/20',   text: 'text-amber-400'   },
    emerald: { bg: 'bg-emerald-600/15', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    violet:  { bg: 'bg-violet-600/15',  border: 'border-violet-500/20',  text: 'text-violet-400'  },
  }

  return (
    <section className="py-24 px-5 fade-section" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything you need to prepare</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f, i) => {
            const c = colorMap[f.color]
            return (
              <div key={i} className="bg-[#0f1117] border border-white/7 rounded-2xl p-6 hover:border-white/12 hover:bg-[#111320] transition-all duration-300 group">
                <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Demo Preview ─────────────────────────────────────────────────────────────
function DemoPreview() {
  const ref = useFadeIn()

  const messages = [
    { role: 'ai',   content: 'Tell me about yourself and your experience as a developer.' },
    { role: 'user', content: "I'm a MERN stack developer with 2 years of experience building full-stack applications. I've worked on e-commerce platforms and real-time dashboards." },
    { role: 'ai',   content: 'Great. Can you explain how the React Virtual DOM works and why it improves performance?' },
    { role: 'user', content: 'React creates a lightweight copy of the real DOM in memory. When state changes, it diffs the virtual DOM with the previous snapshot and only updates the changed nodes in the real DOM.' },
    { role: 'ai',   content: 'Excellent explanation. What is the difference between state and props in React?' },
  ]

  return (
    <section className="py-24 px-5 fade-section" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Live Preview</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">See what an interview feels like</h2>
          <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto">
            A focused, structured conversation — not a casual chat.
          </p>
        </div>

        {/* Mock interview window */}
        <div className="bg-[#0f1117] border border-white/8 rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
          {/* Window chrome */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#0a0c12] border-b border-white/6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Circle className="w-1.5 h-1.5 fill-emerald-400 text-emerald-400 animate-pulse" />
              Frontend Developer · Junior · Active
            </div>
            <div className="w-16" />
          </div>

          {/* Messages */}
          <div className="px-5 py-5 space-y-4 max-h-80 overflow-y-auto">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[80%]">
                  <p className={`text-xs font-medium mb-1 ${msg.role === 'ai' ? 'text-indigo-400 ml-1' : 'text-slate-400 mr-1 text-right'}`}>
                    {msg.role === 'ai' ? 'Interviewer' : 'You'}
                  </p>
                  <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'ai'
                      ? 'bg-[#1c1f2e] border border-white/7 text-slate-200 rounded-tl-sm'
                      : 'bg-indigo-600 text-white rounded-tr-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <p className="text-xs font-medium text-indigo-400 mb-1 ml-1">Interviewer</p>
                <div className="bg-[#1c1f2e] border border-white/7 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          </div>

          {/* Input bar */}
          <div className="px-5 py-4 border-t border-white/6 bg-[#0a0c12] flex items-center gap-3">
            <div className="flex-1 bg-[#1c1f2e] border border-white/8 rounded-xl px-4 py-2.5 text-sm text-slate-600">
              Type your answer…
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-600/40 border border-indigo-500/30 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-indigo-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CTA ─────────────────────────────────────────────────────────────────────
function CTA() {
  const user = useLocalUser()
  const navigate = useNavigate()
  const ref = useFadeIn()

  const perks = [
    'No credit card required',
    'Free to start',
    'Instant access',
  ]

  return (
    <section className="py-24 px-5 fade-section" ref={ref}>
      <div className="max-w-3xl mx-auto text-center">
        <div className="relative bg-gradient-to-b from-indigo-600/12 to-violet-600/8 border border-indigo-500/20 rounded-3xl px-8 py-16 overflow-hidden">
          {/* BG glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-600/15 blur-[60px] rounded-full" />
          </div>

          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-4 relative">
            Get Started Free
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative leading-tight">
            Start practicing today and<br />land your dream job
          </h2>
          <p className="text-slate-400 text-sm mb-8 relative">
            Join thousands of developers who've used AI Interviewer to level up their interview skills.
          </p>

          <button
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            className="group inline-flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-xl shadow-indigo-900/50 active:scale-95 text-sm relative"
          >
            Start Interview — It's Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="flex items-center justify-center gap-5 mt-6 relative">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-1.5 text-xs text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 px-5">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
            <Cpu className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-white">AI Interviewer</span>
        </div>

        <div className="flex items-center gap-6">
          {['About', 'Contact'].map((l) => (
            <a key={l} href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{l}</a>
          ))}
          <a
            href="https://github.com/Aditya-2003/AI-Interviewer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-300 transition-colors text-sm"
          >
            Github
          </a>
        </div>

        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} AI Interviewer. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="bg-[#07090f] min-h-screen font-sans">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <DemoPreview />
      <CTA />
      <Footer />
    </div>
  )
}