import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ImageIcon, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getAuthorName, resolveCategoryId } from "@/lib/apiContract"
import { useAuth } from "@/context/AuthContext"
import { getCategories } from "@/services/admin/categoryStore"
import {
  createPostWithImage,
  deletePost,
  updatePost,
  POST_STATUS,
  validateImageFile,
} from "@/services/postApiService"
import { fetchPostById } from "@/services/postService"

const INTRO_MAX = 120

const emptyPost = {
  title: "",
  description: "",
  content: "",
  category_id: null,
  status_id: null,
}

export function ArticleFormPage() {
  const { articleId } = useParams()
  const isEdit = Boolean(articleId)
  const navigate = useNavigate()
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  const [categories, setCategories] = useState([])
  const [existing, setExisting] = useState(null)
  const [post, setPost] = useState(emptyPost)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isBooting, setIsBooting] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsBooting(true)
      setLoadError(null)
      try {
        const nextCategories = await getCategories()
        if (cancelled) return
        setCategories(nextCategories)

        if (!isEdit) {
          setPost(emptyPost)
          setImagePreview("")
          return
        }

        const existingPost = await fetchPostById(articleId)
        if (cancelled) return
        setExisting(existingPost)
        setPost({
          title: existingPost.title ?? "",
          description: existingPost.description ?? "",
          content: existingPost.content ?? "",
          category_id: resolveCategoryId(nextCategories, existingPost),
          status_id: POST_STATUS[existingPost.status] ?? null,
        })
        setImagePreview(existingPost.image ?? "")
      } catch (error) {
        if (cancelled) return
        console.error(error)
        setExisting(null)
        setLoadError(error.response?.data?.error ?? "Failed to load article")
      } finally {
        if (!cancelled) setIsBooting(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [articleId, isEdit])

  if (isBooting) {
    return (
      <div className="px-10 py-10">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (isEdit && !existing) {
    return (
      <div className="px-10 py-10">
        <p className="text-gray-600">{loadError || "Article not found."}</p>
        <Link to="/admin/articles" className="text-sm text-black underline">
          Back to articles
        </Link>
      </div>
    )
  }

  function handleInputChange(event) {
    const { name, value } = event.target
    setPost((prev) => ({
      ...prev,
      [name]: name === "description" ? value.slice(0, INTRO_MAX) : value,
    }))
  }

  function handleCategoryChange(value) {
    setPost((prev) => ({
      ...prev,
      category_id: Number(value),
    }))
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    const errorMessage = validateImageFile(file)

    if (!file) return

    if (errorMessage) {
      toast.error(errorMessage)
      event.target.value = ""
      return
    }

    setImageFile({ file })
    setImagePreview(URL.createObjectURL(file))
  }

  function validateForm(requireImage) {
    if (
      !post.title.trim() ||
      !post.category_id ||
      !post.description.trim() ||
      !post.content.trim()
    ) {
      toast.error("Please fill in all required fields")
      return false
    }

    if (requireImage && !imageFile && !imagePreview) {
      toast.error("Please select an image file.")
      return false
    }

    return true
  }

  async function handleSave(status) {
    const statusId = POST_STATUS[status]
    if (!validateForm(!isEdit)) return

    setIsLoading(true)

    try {
      if (isEdit) {
        const imageUrl = imagePreview?.startsWith("http")
          ? imagePreview
          : existing.image

        await updatePost(articleId, {
          title: post.title,
          image: imageUrl,
          category_id: post.category_id,
          description: post.description,
          content: post.content,
          status_id: statusId,
        })

        toast.success("Article updated", {
          description:
            status === "published"
              ? "Your article has been successfully published"
              : "Your article has been saved as draft",
        })
      } else {
        const formData = new FormData()
        formData.append("title", post.title)
        formData.append("category_id", post.category_id)
        formData.append("description", post.description)
        formData.append("content", post.content)
        formData.append("status_id", statusId)
        formData.append("imageFile", imageFile.file)

        await createPostWithImage(formData)

        if (status === "draft") {
          toast.success("Create article and saved as draft", {
            description: "You can publish article later",
          })
        } else {
          toast.success("Create article and published", {
            description: "Your article has been successfully published",
          })
        }
      }

      navigate(`/admin/articles?status=${status}`)
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create post. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    try {
      await deletePost(articleId)
      toast.success("Delete article", {
        description: "The article has been deleted successfully",
      })
      navigate("/admin/articles")
    } catch (error) {
      toast.error(error.response?.data?.error ?? "Failed to delete article")
    }
  }

  const authorName =
    getAuthorName(user) || user?.name || user?.username || "Thompson P."

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-10 py-6">
        <h1 className="text-2xl font-bold text-black">
          {isEdit ? "Edit article" : "Create article"}
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSave("draft")}
            className="rounded-full border border-gray-800 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 disabled:opacity-60"
          >
            Save as draft
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSave("published")}
            className="rounded-full bg-[#2b2a2a] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black disabled:opacity-60"
          >
            {isEdit ? "Save" : "Save and publish"}
          </button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl px-10 py-10">
        <div className="mb-6 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Thumbnail image
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-36 w-56 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-36 w-56 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-[#f8f9fa] text-gray-400">
                <ImageIcon className="size-10" strokeWidth={1.25} />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border border-gray-800 bg-white px-5 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50"
            >
              Upload thumbnail image
            </button>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <Select
            value={post.category_id ? String(post.category_id) : undefined}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="h-12 w-full rounded-xl border-gray-300 bg-white px-4">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((item) => (
                <SelectItem key={item.id} value={String(item.id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-5 flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">Author name</label>
          <Input
            value={authorName}
            readOnly
            className="h-12 rounded-xl border-gray-300 bg-[#f3f3f3] px-4 text-gray-500"
          />
        </div>

        <div className="mb-5 flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={post.title}
            onChange={handleInputChange}
            placeholder="Article title"
            className="h-12 rounded-xl border-gray-300 bg-white px-4"
          />
        </div>

        <div className="mb-5 flex flex-col gap-2">
          <label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            Introduction (max {INTRO_MAX} letters)
          </label>
          <Textarea
            id="description"
            name="description"
            value={post.description}
            onChange={handleInputChange}
            maxLength={INTRO_MAX}
            placeholder="Introduction"
            className="min-h-24 rounded-xl border-gray-300 bg-white px-4 py-3"
          />
        </div>

        <div className="mb-8 flex flex-col gap-2">
          <label htmlFor="content" className="text-sm font-medium text-gray-700">
            Content
          </label>
          <Textarea
            id="content"
            name="content"
            value={post.content}
            onChange={handleInputChange}
            placeholder="Content"
            className="min-h-72 rounded-xl border-gray-300 bg-white px-4 py-3"
          />
        </div>

        {isEdit && (
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="inline-flex items-center gap-2 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
          >
            <Trash2 className="size-4" />
            Delete article
          </button>
        )}
      </div>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent className="relative max-w-sm rounded-2xl p-8 sm:max-w-sm">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setShowDelete(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
          >
            <X className="size-5" />
          </button>
          <AlertDialogHeader className="place-items-center text-center sm:place-items-center sm:text-center">
            <AlertDialogTitle className="text-xl font-bold text-black">
              Delete article
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[#757575]">
              Do you want to delete this article?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-center gap-3 sm:justify-center sm:space-x-0">
            <AlertDialogCancel className="mt-0 rounded-full border-gray-800 bg-white px-8 text-gray-800 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="rounded-full bg-[#2b2a2a] px-8 text-white hover:bg-black"
              onClick={(event) => {
                event.preventDefault()
                handleDelete()
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
