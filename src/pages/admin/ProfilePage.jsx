import { useRef, useState } from "react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/AuthContext"
import { ProfileAvatar } from "@/lib/profileAvatar"
import { validateImageFile } from "@/services/postApiService"

const BIO_MAX = 120

export function ProfilePage() {
  const { user, updateProfile } = useAuth()
  const fileInputRef = useRef(null)
  const [isSaving, setIsSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [form, setForm] = useState({
    name: user?.name ?? "",
    username: user?.username ?? "",
    email: user?.email ?? "",
    bio: user?.bio ?? "",
    profilePic: user?.profilePic ?? "",
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
    const errorMessage = validateImageFile(file)
    if (errorMessage) {
      toast.error(errorMessage)
      event.target.value = ""
      return
    }
    setImageFile(file)
    setForm((prev) => ({ ...prev, profilePic: URL.createObjectURL(file) }))
  }

  async function handleSave() {
    if (!form.name.trim() || !form.username.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append("name", form.name.trim())
      formData.append("username", form.username.trim())
      if (imageFile) formData.append("imageFile", imageFile)

      const updated = await updateProfile(formData)
      setForm((prev) => ({
        ...prev,
        name: updated.name,
        username: updated.username,
        email: updated.email,
        profilePic: updated.profilePic || prev.profilePic,
      }))
      setImageFile(null)
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
            src={form.profilePic}
            name={form.name || form.username}
            className="size-28 text-3xl"
          />
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
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
              readOnly
              className="h-12 rounded-xl border-gray-300 bg-[#f3f3f3] px-3 text-gray-500"
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
