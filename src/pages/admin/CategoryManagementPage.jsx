import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Pencil, Search, Trash2, X } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
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
import { deleteCategory, getCategories } from "@/services/admin/categoryStore"
import { cn } from "@/lib/utils"

export function CategoryManagementPage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      try {
        const items = await getCategories({ keyword })
        if (!cancelled) setCategories(items)
      } catch (error) {
        if (cancelled) return
        console.error(error)
        toast.error(
          error.response?.data?.error ?? "Failed to load categories"
        )
        setCategories([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [keyword, refreshKey])

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteCategory(deleteTarget.id)
      toast.success("Delete category", {
        description: "Category has been successfully deleted.",
      })
      setDeleteTarget(null)
      setRefreshKey((value) => value + 1)
    } catch (error) {
      toast.error(error.response?.data?.error ?? "Failed to delete category")
    }
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-10 py-6">
        <h1 className="text-2xl font-bold text-black">Category management</h1>
        <Link
          to="/admin/categories/create"
          className="rounded-full bg-[#2b2a2a] px-5 py-2.5 text-sm font-medium text-white no-underline transition-colors hover:bg-black"
        >
          + Create category
        </Link>
      </header>

      <div className="px-10 py-8">
        <div className="mb-6">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search..."
              className="h-11 rounded-xl border-gray-300 bg-white pl-10"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="px-5 py-4 font-medium">Category</th>
                <th className="px-5 py-4 font-medium" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={2} className="px-5 py-10 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-5 py-10 text-center text-gray-500">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((category, index) => (
                  <tr
                    key={category.id}
                    className={cn(
                      "border-t border-gray-100",
                      index % 2 === 1 && "bg-[#f8f9fa]"
                    )}
                  >
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {category.name}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/admin/categories/${category.id}/edit`)
                          }
                          className="text-gray-500 transition-colors hover:text-black"
                          aria-label="Edit category"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(category)}
                          className="text-gray-500 transition-colors hover:text-black"
                          aria-label="Delete category"
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
              Delete category
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-[#757575]">
              Do you want to delete this category?
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
