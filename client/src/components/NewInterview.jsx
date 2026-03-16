import { useState } from 'react'
import { Mic, ChevronDown, Loader2, MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'System Design',
  'DevOps Engineer',
  'Mobile Developer',
  'Data Engineer',
  'ML Engineer',
  'Business Analyst',
  'HRMS Analyst'
]

const EXPERIENCE = ['Fresher', 'Junior', 'Mid', 'Senior']

export default function NewInterview() {
  const navigate = useNavigate()
  const [role, setRole] = useState(ROLES[0])
  const [level, setLevel] = useState(EXPERIENCE[1])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/interview/start`,
        {
          method: "POST",
          
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            role: role,
            experience: level
          })
        })

      const data = await response.json();

      if (response.ok) {
        navigate(`/interview/${data.sessionId}`);
      } else {
        setError(data.error || "Failed to start interview");
      }
    } catch (err) {
      setError(err.message);
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#161822] border border-white/8 rounded-2xl p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">New Interview</h3>
        <button className="text-slate-500 hover:text-slate-300 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Role dropdown */}
      <div className="relative">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full appearance-none bg-[#1c1f2e] border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm font-medium focus:outline-none focus:border-indigo-500/50 cursor-pointer pr-10"
        >
          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>

      {/* Experience row */}
      <div className="flex items-center justify-between gap-4">
        <label className="text-sm text-slate-300 font-medium shrink-0">Experience Level:</label>
        <div className="relative flex-1 max-w-[180px] ml-auto">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full appearance-none bg-[#1c1f2e] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-indigo-500/50 cursor-pointer pr-10"
          >
            {EXPERIENCE.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {error && <p className="text-xs text-red-400 -mt-2">{error}</p>}

      {/* Footer row */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">Don't see your role?</p>
        <button
          onClick={handleStart}
          disabled={loading}
          className="flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-all active:scale-95 focus:outline-none text-sm shadow-lg shadow-indigo-900/40"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Starting…</>
            : <><Mic className="w-4 h-4" /> Start Interview</>
          }
        </button>
      </div>
    </div>
  )
}