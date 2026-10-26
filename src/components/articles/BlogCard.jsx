import { Link } from "react-router-dom"
import { getAuthorName, getAuthorPic } from "@/lib/apiContract"
import { ProfileAvatar } from "@/lib/profileAvatar"
import { formatPostDate } from "@/utils/date"

function BlogCard({ id, image, category, title, description, author, date }) {
  const authorName = getAuthorName(author)
  const authorPic = getAuthorPic(author)

  return (
    <div className="flex flex-col gap-4">
      <Link to={`/post/${id}`} className="relative h-[212px] sm:h-[360px]">
        <img
          className="h-full w-full rounded-md object-cover"
          src={image}
          alt={title}
        />
      </Link>
      <div className="flex flex-col">
        <div className="flex">
          <span className="mb-2 rounded-full bg-green-200 px-3 py-1 text-sm font-semibold text-green-600">
            {category}
          </span>
        </div>
        <Link to={`/post/${id}`} className="text-black no-underline">
          <h2 className="mb-2 line-clamp-2 text-start text-xl font-bold !text-black hover:underline">
            {title}
          </h2>
        </Link>
        <p className="mb-4 line-clamp-3 flex-grow text-sm text-muted-foreground">
          {description}
        </p>
        <div className="flex items-center text-sm">
          <ProfileAvatar
            src={authorPic}
            name={authorName}
            className="mr-2 size-8 text-xs"
          />
          <span>{authorName}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span>{formatPostDate(date)}</span>
        </div>
      </div>
    </div>
  )
}

function BlogCardList({ posts = [] }) {
  return posts.map((post) => (
    <BlogCard
      key={post.id}
      id={post.id}
      image={post.image}
      category={post.category}
      title={post.title}
      description={post.description}
      author={post.author}
      date={post.date}
    />
  ))
}

export default BlogCard
export { BlogCardList }
