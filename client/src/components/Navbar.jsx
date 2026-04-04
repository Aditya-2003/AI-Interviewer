import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, ChevronDown, User, Settings, LogOut, Circle } from 'lucide-react'
import { BsRobot } from "react-icons/bs";

export default function Navbar({ userInfo, setLoggedInUser }) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate('/login');
    }, 1000);

    setLoggedInUser("");
  }

  // const initials = user?.name
  //   ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  //   : user?.email?.[0]?.toUpperCase() ?? 'U'

  // const displayName = user?.name ?? user?.email ?? 'User'

  return (
    <header className="h-16 bg-[#0f1117] border-b border-white/5 flex items-center justify-end px-6 shrink-0">


      <div className="relative flex items-center gap-2">
       
          <button 
          onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 hover:text-white text-sm font-medium transition-all"
          ><Circle className="w-1.5 h-1.5 fill-green-500 text-green-500" />
            {userInfo?.username ? userInfo.username : "User"}
          
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-12 w-48 bg-[#161822] border border-white/8 rounded-xl shadow-2xl py-1.5 z-20">
              <DropItem icon={User} label="Profile" onClick={() => setOpen(false)} />
              <DropItem icon={Settings} label="Settings" onClick={() => setOpen(false)} />
              <div className="border-t border-white/6 my-1" />
              <DropItem icon={LogOut} label="Logout" onClick={handleLogout} danger />
            </div>
          </>
        )}
      </div>
    </header>
  )
}

function DropItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
        ${danger ? 'text-red-400 hover:bg-red-500/10' : 'text-slate-300 hover:bg-white/6 hover:text-white'}`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </button>
  )
}