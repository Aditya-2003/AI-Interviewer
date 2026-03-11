import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, KeyRound, FileText, MessageSquare,
  Settings, LogOut, Cpu,
} from 'lucide-react'

const NAV_ITEMS = [
  { to: '/dashboard',   label: 'Dashboard', icon: LayoutDashboard },
  { to: '/api-key',     label: 'API Key',   icon: KeyRound },
  { to: '/resume',      label: 'Resume',    icon: FileText },
  { to: '/interviews',  label: 'Interviews',icon: MessageSquare },
  { to: '/settings',    label: 'Settings',  icon: Settings },
]

export default function Sidebar() {
 
  const navigate   = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  }

  return (
    <aside className="flex flex-col w-64 shrink-0 bg-[#0f1117] border-r border-white/5 min-h-screen">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Cpu className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-white text-base tracking-tight">InterviewAI</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
              ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                : 'text-slate-400 hover:text-white hover:bg-white/6'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout at bottom */}
      <div className="px-3 py-5 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/6 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Log out
        </button>
      </div>
    </aside>
  )
}