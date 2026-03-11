import { ChevronRight, Mic } from 'lucide-react'

export default function RecentInterviews({ interviews = [] }) {
  // interviews shape: [{ id, role, sessions, date, status }]
  const list = interviews.length
    ? interviews
    : [
        { id: 1, role: 'Backend Developer',  sessions: 3, date: 'Yesterday'    },
        { id: 2, role: 'System Design',       sessions: 2, date: 'Apr 20, 2024' },
      ]

  return (
    <div className="bg-[#161822] border border-white/8 rounded-2xl p-5 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Recent Interviews</h3>
        <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {list.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center justify-between gap-3 bg-[#1c1f2e] hover:bg-white/6 rounded-xl px-4 py-3.5 transition-colors group"
          >
            <div className="text-left">
              <p className="text-sm font-semibold text-white">{item.role}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {item.sessions} session{item.sessions !== 1 ? 's' : ''} · {item.date}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors shrink-0" />
          </button>
        ))}
      </div>

      {!interviews.length && (
        <p className="text-xs text-slate-600 text-center pb-1">
          These are placeholder entries — connect your API to load real data.
        </p>
      )}
    </div>
  )
}