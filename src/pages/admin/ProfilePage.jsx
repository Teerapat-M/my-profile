import { useRef, useState } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/AuthContext"
import { ProfileAvatar } from "@/lib/profileAvatar"

const BIO_MAX = 120

export function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const fileInputRef = useRef(null)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    name: user?.name ?? "",
    username: user?.username ?? "",
    email: user?.email ?? "",
    bio: user?.bio ?? "",
    profilePicture: user?.profilePicture ?? "",
  })

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "bio" ? value.slice(0, BIO_MAX) : value,
    }))
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setForm((prev) => ({ ...prev, profilePicture: String(reader.result) }))
    }
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.username.trim() || !form.email.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSaving(true)
    try {
      await updateProfile(form)
      toast.success("Saved profile", {
        description: "Your profile has been successfully updated",
      })
    } catch (error) {
      toast.error(
        error.response?.data?.error ?? "Failed to update profile. Please try again."
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-10 py-6">
        <h1 className="text-2xl font-bold text-black">Profile</h1>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-full bg-[#2b2a2a] px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
        >
          Save
        </button>
      </header>

      <div className="w-full max-w-xl px-10 py-10">
        <div className="mb-8 flex items-center gap-6">
          <ProfileAvatar
            src={form.profilePicture}
            name={form.name || form.username}
            className="size-28 text-3xl"
          />
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border border-gray-800 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
            >
              Upload profile picture
            </button>
          </div>
        </div>

        <div className="mb-8 border-t border-gray-200" />

        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault()
            handleSave()
          }}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="h-12 rounded-xl border-gray-300 bg-white px-3"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <Input
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="h-12 rounded-xl border-gray-300 bg-white px-3"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="h-12 rounded-xl border-gray-300 bg-white px-3"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="bio" className="text-sm font-medium text-gray-700">
              Bio (max {BIO_MAX} letters)
            </label>
            <Textarea
              id="bio"
              name="bio"
              value={form.bio}
              onChange={handleChange}
              maxLength={BIO_MAX}
              className="min-h-28 rounded-xl border-gray-300 bg-white px-3 py-3"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
