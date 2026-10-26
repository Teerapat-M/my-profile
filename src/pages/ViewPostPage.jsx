import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Markdown from "react-markdown"
import { toast } from "sonner"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { LoginAlertDialog } from "@/components/posts/LoginAlertDialog"
import { PostInteractionBar } from "@/components/posts/PostInteractionBar"
import { CommentSection } from "@/components/posts/CommentSection"
import { ProfileAvatar } from "@/lib/profileAvatar"
import { getAuthorName, getAuthorPic, getLikesCount } from "@/lib/apiContract"
import { useAuth } from "@/context/AuthContext"
import {
  createComment,
  fetchComments,
  fetchPostById,
  likePost,
  unlikePost,
} from "@/services/postService"
import { formatPostDate } from "@/utils/date"

function withDateLabels(comments) {
  return comments.map((item) => ({
    ...item,
    dateLabel: formatPostDate(item.createdAt),
  }))
}

export function ViewPostPage() {
  const { postId } = useParams()
  const { isLoggedIn } = useAuth()
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([])
  const [showLoginAlert, setShowLoginAlert] = useState(false)

  const postUrl = `${window.location.origin}/post/${postId}`
  const authorName = getAuthorName(post?.author)
  const authorPic = getAuthorPic(post?.author)

  useEffect(() => {
    const getPost = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const [data, postComments] = await Promise.all([
          fetchPostById(postId),
          fetchComments(postId).catch(() => []),
        ])
        setPost(data)
        setLikes(getLikesCount(data))
        setLiked(Boolean(data.liked))
        setComments(withDateLabels(postComments))
      } catch (err) {
        console.error(err)
        setError("Failed to load post")
        setPost(null)
      } finally {
        setIsLoading(false)
      }
    }

    getPost()
  }, [postId])

  const requireLogin = () => {
    if (!isLoggedIn) {
      setShowLoginAlert(true)
      return false
    }
    return true
  }

  const handleLike = async () => {
    if (!requireLogin()) return

    try {
      const data = liked ? await unlikePost(postId) : await likePost(postId)
      setLikes(getLikesCount(data))
      setLiked(Boolean(data.liked))
    } catch (err) {
      console.error(err)
      toast.error(
        err.response?.data?.error ??
          err.response?.data?.message ??
          "Failed to update like"
      )
    }
  }

  const handleSendComment = async (event) => {
    event.preventDefault()
    if (!requireLogin()) return

    const trimmed = comment.trim()
    if (!trimmed) return

    try {
      await createComment(postId, trimmed)
      const postComments = await fetchComments(postId)
      setComments(withDateLabels(postComments))
      setComment("")
    } catch (err) {
      console.error(err)
      toast.error(
        err.response?.data?.error ??
          err.response?.data?.message ??
          "Failed to post comment"
      )
    }
  }

  return (
    <div className="flex min-h-svh w-full flex-col bg-white">
      <Navbar />

      <main className="mx-auto w-full max-w-3xl flex-1 px-8 py-10">
        {isLoading ? (
          <p className="text-center text-[#757575]">Loading...</p>
        ) : error || !post ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="text-red-500">{error || "Post not found"}</p>
            <Button
              asChild
              className="rounded-full bg-[#2b2a2a] text-white hover:bg-black"
            >
              <Link to="/">Go To Homepage</Link>
            </Button>
          </div>
        ) : (
          <>
            <span className="mb-4 inline-flex rounded-full bg-green-200 px-3 py-1 text-sm font-semibold text-green-600">
              {post.category}
            </span>

            <h1 className="mb-4 text-3xl font-bold !text-black md:text-4xl">
              {post.title}
            </h1>

            <div className="mb-8 flex items-center text-sm text-[#757575]">
              <ProfileAvatar
                src={authorPic}
                name={authorName}
                className="mr-2 size-8 text-xs"
              />
              <span className="font-medium text-[#43403b]">{authorName}</span>
              <span className="mx-2 text-gray-300">|</span>
              <span>{formatPostDate(post.date)}</span>
            </div>

            <img
              src={post.image}
              alt={post.title}
              className="mb-8 h-auto w-full rounded-2xl object-cover"
            />

            <article className="prose prose-neutral mb-10 max-w-none text-[#43403b] prose-headings:!text-black prose-p:leading-relaxed">
              <Markdown>{post.content}</Markdown>
            </article>

            <PostInteractionBar
              likes={likes}
              onLike={handleLike}
              postUrl={postUrl}
            />

            <CommentSection
              comment={comment}
              onCommentChange={(event) => setComment(event.target.value)}
              onSend={handleSendComment}
              onRequireLogin={() => setShowLoginAlert(true)}
              isLoggedIn={isLoggedIn}
              comments={comments}
            />
          </>
        )}
      </main>

      <Footer />

      <LoginAlertDialog
        open={showLoginAlert}
        onOpenChange={setShowLoginAlert}
      />
    </div>
  )
}
