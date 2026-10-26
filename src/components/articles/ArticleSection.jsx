import { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { BlogCardList } from "@/components/articles/BlogCard"
import { ArticleSearch } from "@/components/articles/ArticleSearch"
import { ARTICLE_CATEGORIES } from "@/constants/categories"
import { getCategories } from "@/services/admin/categoryStore"
import { fetchPosts } from "@/services/postService"

const HIGHLIGHT = "Highlight"
const POSTS_PER_PAGE = 6

function ArticleSection() {
  const [categories, setCategories] = useState(ARTICLE_CATEGORIES)
  const [selectedCategory, setSelectedCategory] = useState(HIGHLIGHT)
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getCategories()
      .then((items) => {
        setCategories([HIGHLIGHT, ...items.map((item) => item.name)])
      })
      .catch(() => {
        setCategories(ARTICLE_CATEGORIES)
      })
  }, [])

  const loadPosts = async (pageToLoad, category, append = false) => {
    try {
      setIsLoading(true)
      setError(null)

      const params = {
        page: pageToLoad,
        limit: POSTS_PER_PAGE,
      }

      if (category !== HIGHLIGHT) {
        params.category = category
      }

      const data = await fetchPosts(params)

      setPosts((prevPosts) =>
        append ? [...prevPosts, ...data.posts] : data.posts
      )
      setPage(pageToLoad)
      setHasMore(Boolean(data.nextPage))
    } catch (err) {
      console.error(err)
      setError("Failed to load posts")
      if (!append) {
        setPosts([])
        setHasMore(false)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setPosts([])
    setPage(1)
    setHasMore(false)
    loadPosts(1, selectedCategory, false)
  }, [selectedCategory])

  const handleCategoryChange = (value) => {
    setSelectedCategory(value)
  }

  const handleViewMore = () => {
    if (isLoading || !hasMore) return
    loadPosts(page + 1, selectedCategory, true)
  }

  return (
    <section className="w-full bg-white px-8 py-10">
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="mb-6 text-2xl font-bold !text-black">Latest articles</h2>

        {/* Desktop */}
        <div className="hidden md:block rounded-2xl bg-[#ebe9e4] px-4 py-3">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-1">
              {categories.map((category) => {
                const isSelected = selectedCategory === category

                return (
                  <Button
                    key={category}
                    type="button"
                    variant="ghost"
                    disabled={isSelected}
                    onClick={() => handleCategoryChange(category)}
                    className={`rounded-lg border-0 px-4 py-2 text-sm ${
                      isSelected
                        ? "bg-[#dad6ce] font-medium text-[#43403b] hover:bg-[#dad6ce] disabled:opacity-100 disabled:pointer-events-none"
                        : "bg-transparent text-[#757575] hover:bg-[#f5f4f0] hover:text-[#757575]"
                    }`}
                  >
                    {category}
                  </Button>
                )
              })}
            </div>

            <div className="relative w-72 shrink-0">
              <ArticleSearch inputClassName="h-10" />
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden rounded-2xl bg-[#ebe9e4] px-4 py-5">
          <div className="flex flex-col gap-5">
            <ArticleSearch inputClassName="h-11" />

            <div className="flex flex-col gap-2">
              <label htmlFor="category-select" className="text-sm text-[#757575]">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger
                  id="category-select"
                  className="!h-11 w-full border-0 bg-white text-[#43403b] shadow-none focus-visible:ring-0"
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="w-[var(--radix-select-trigger-width)]"
                >
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          {isLoading && posts.length === 0 ? (
            <p className="col-span-full text-center text-[#757575]">Loading...</p>
          ) : error && posts.length === 0 ? (
            <p className="col-span-full text-center text-red-500">{error}</p>
          ) : (
            <BlogCardList posts={posts} />
          )}
        </div>

        <div className="mt-10 flex justify-center">
          {isLoading && posts.length > 0 ? (
            <p className="text-[#757575]">Loading...</p>
          ) : hasMore ? (
            <Button
              type="button"
              variant="outline"
              onClick={handleViewMore}
              disabled={isLoading}
              className="rounded-full border-gray-300 px-8 py-2 text-sm font-medium text-[#43403b] hover:bg-gray-50"
            >
              View More
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default ArticleSection
