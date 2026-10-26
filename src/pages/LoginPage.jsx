import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Input } from "@/components/ui/input"
import { getLoginAccessToken } from "@/lib/apiContract"
import { loginUser } from "@/services/authService"
import { useAuth } from "@/context/AuthContext"

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: "", password: "" })
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setHasError(false)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Please fill in all fields")
      setHasError(true)
      return
    }

    setIsSubmitting(true)

    try {
      const data = await loginUser(form)
      const accessToken = getLoginAccessToken(data)
      if (!accessToken) {
        throw new Error("Login did not return access_token")
      }
      await login(accessToken)
      navigate("/")
    } catch {
      setHasError(true)
      toast.error("Your password is incorrect or this email doesn't exist", {
        description: "Please try another password or email",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClassName = hasError
    ? "h-12 rounded-xl border-red-500 bg-white px-4 text-red-500 placeholder:text-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20"
    : "h-12 rounded-xl border-gray-300 bg-white px-4 text-gray-800 placeholder:text-gray-400"

  return (
    <div className="flex min-h-svh w-full flex-col bg-[#f8f9fa]">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-[520px] rounded-2xl bg-[#efeeeb] px-8 py-10 sm:px-12 sm:py-12">
          <h1 className="mb-8 text-center text-3xl font-bold text-black">
            Log in
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={inputClassName}
                aria-invalid={hasError}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className={inputClassName}
                aria-invalid={hasError}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-full bg-[#2b2a2a] py-3 text-sm font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
            >
              Log in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have any account?{" "}
            <Link to="/signup" className="font-medium text-black underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
