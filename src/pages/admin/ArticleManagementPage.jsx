import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Search, Pencil, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
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
import { adminPostsQuery } from "@/lib/apiContract"
import { getCategories } from "@/services/admin/categoryStore"
import { deletePost } from "@/services/postApiService"
import { fetchPosts } from "@/services/postService"
import { cn } from "@/lib/utils"

export function ArticleManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get("status") || "all"
  const category = searchParams.get("category") || "all"
  const [keyword, setKeyword] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [categories, setCategories] = useState([])
  const [articles, setArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      try {
        // ponytail: admin table loads the first 100 posts; paginate if the catalog grows.
        const params = {
          page: 1,
          limit: 100,
          ...adminPostsQuery(status),
        }
        if (category !== "all") params.category = category

        const [{ posts }, nextCategories] = await Promise.all([
          fetchPosts(params),
          getCategories(),
        ])
        if (cancelled) return
        setArticles(posts)
        setCategories(nextCategories)
      } catch (error) {
        if (cancelled) return
        console.error(error)
        toast.error(
          error.response?.data?.error ?? "Failed to load articles"
        )
        setArticles([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [refreshKey, status, category])

  const visibleArticles = useMemo(() => {
    const query = keyword.trim().toLowerCase()
    if (!query) return articles
    return articles.filter((article) =>
      article.title.toLowerCase().includes(query)
    )
  }, [articles, keyword])

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams)
    if (!value || value === "all") params.delete(key)
    else params.set(key, value)
    setSearchParams(params)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deletePost(deleteTarget.id)
      toast.success("Delete article", {
        description: "The article has been deleted successfully",
      })
      setDeleteTarget(null)
      setRefreshKey((value) => value + 1)
    } catch (error) {
      toast.error(error.response?.data?.error ?? "Failed to delete article")
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-10 py-6">
        <h1 className="text-2xl font-bold text-black">Article management</h1>
        <Link
          to="/admin/articles/create"
          className="rounded-full bg-[#2b2a2a] px-5 py-2.5 text-sm font-medium text-white no-underline transition-colors hover:bg-black"
        >
          + Create article
        </Link>
      </header>

      <div className="px-10 py-8">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search..."
              className="h-11 rounded-xl border-gray-300 bg-white pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Select
              value={status}
              onValueChange={(value) => updateParam("status", value)}
            >
              <SelectTrigger className="h-11 min-w-36 rounded-xl border-gray-300 bg-white px-4">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={category}
              onValueChange={(value) => updateParam("category", value)}
            >
              <SelectTrigger className="h-11 min-w-36 rounded-xl border-gray-300 bg-white px-4">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Category</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-gray-500">
              <tr className="border-b border-gray-200">
                <th className="px-5 py-4 font-medium">Article title</th>
                <th className="px-5 py-4 font-medium">Category</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : visibleArticles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-gray-500">
                    No articles found
                  </td>
                </tr>
              ) : (
                visibleArticles.map((article, index) => (
                  <tr
                    key={article.id}
                    className={cn(
                      "border-t border-gray-100",
                      index % 2 === 1 && "bg-[#f8f9fa]"
                    )}
                  >
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {article.title}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{article.category}</td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-2 font-medium",
                          article.status === "published"
                            ? "text-emerald-600"
                            : "text-gray-500"
                        )}
                      >
                        <span
                          className={cn(
                            "size-2 rounded-full",
                            article.status === "published"
                              ? "bg-emerald-500"
                              : "bg-gray-400"
                          )}
                        />
                        {article.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/admin/articles/${article.id}/edit`}
                          className="text-gray-500 no-underline transition-colors hover:text-black"
                          aria-label="Edit article"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(article)}
                          className="text-gray-500 transition-colors hover:text-black"
                          aria-label="Delete article"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent className="relative max-w-sm rounded-2xl p-8 sm:max-w-sm">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setDeleteTarget(null)}
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
