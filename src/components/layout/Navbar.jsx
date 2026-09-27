import { Link, useNavigate } from "react-router-dom"
import { Menu, ChevronDown, User, KeyRound, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/context/AuthContext"
import { ProfileAvatar } from "@/lib/profileAvatar"

export function Navbar() {
  const navigate = useNavigate()
  const { user, isLoggedIn, logout } = useAuth()

  function handleLogout() {
    logout()
    navigate("/login")
  }

  return (
    <nav className="flex w-full items-center justify-between border-b border-gray-200 bg-[#f8f9fa] px-8 py-4">
      <Link
        to="/"
        className="cursor-pointer text-3xl font-semibold tracking-tight text-gray-800 no-underline"
      >
        TM<span className="text-emerald-500">.</span>
      </Link>

      <div className="hidden items-center gap-3 md:flex">
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white py-1.5 pr-3 pl-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <ProfileAvatar
                  src={user?.profilePicture}
                  name={user?.name || user?.username}
                  className="size-8 text-xs"
                />
                <span className="max-w-32 truncate">
                  {user?.name || user?.username}
                </span>
                <ChevronDown className="size-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-48">
              <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2.5">
                <Link to="/admin/profile">
                  <User className="size-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2.5">
                <Link to="/admin/reset-password">
                  <KeyRound className="size-4" />
                  Reset password
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer gap-2 py-2.5"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link
              to="/login"
              className="rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 no-underline transition-colors hover:bg-gray-50"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-[#2b2a2a] px-6 py-2.5 text-sm font-medium text-white no-underline transition-colors hover:bg-black"
            >
              Sign up
            </Link>
          </>
        )}
      </div>

      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Open menu"
              className="size-10 rounded-sm border-gray-300 bg-white text-gray-700 shadow-none hover:bg-gray-50"
            >
              <Menu className="size-5" strokeWidth={2} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            {isLoggedIn ? (
              <>
                <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2.5">
                  <Link to="/admin/profile">
                    <User className="size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2.5">
                  <Link to="/admin/reset-password">
                    <KeyRound className="size-4" />
                    Reset password
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer gap-2 py-2.5"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Log out
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild className="cursor-pointer justify-center py-2.5">
                  <Link to="/login">Log in</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer justify-center py-2.5">
                  <Link to="/signup">Sign up</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
