import { NavLink, Link, useNavigate } from "react-router-dom"
import {
  FileText,
  Folder,
  User,
  Bell,
  KeyRound,
  ExternalLink,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { cn } from "@/lib/utils"

const mainLinks = [
  { to: "/admin/articles", label: "Article management", icon: FileText },
  { to: "/admin/categories", label: "Category management", icon: Folder },
  { to: "/admin/profile", label: "Profile", icon: User },
  { to: "/admin/notifications", label: "Notification", icon: Bell },
  { to: "/admin/reset-password", label: "Reset password", icon: KeyRound },
]

export function AdminSidebar() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <aside className="flex h-svh w-[260px] shrink-0 flex-col border-r border-gray-200 bg-[#efeeeb]">
      <div className="px-6 pt-8 pb-6">
        <Link
          to="/"
          className="text-3xl font-semibold tracking-tight text-black no-underline"
        >
          TM<span className="text-emerald-500">.</span>
        </Link>
        <p className="mt-1 text-sm font-medium text-[#c4a484]">Admin panel</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {mainLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 no-underline transition-colors hover:bg-gray-200/80",
                isActive && "bg-[#e1e0dd] text-black"
              )
            }
          >
            <Icon className="size-5 shrink-0" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-gray-200 px-3 py-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 no-underline transition-colors hover:bg-gray-200/80"
        >
          <ExternalLink className="size-5 shrink-0" strokeWidth={1.75} />
          TM. website
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200/80"
        >
          <LogOut className="size-5 shrink-0" strokeWidth={1.75} />
          Log out
        </button>
      </div>
    </aside>
  )
}
