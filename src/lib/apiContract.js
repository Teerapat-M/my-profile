export function getLoginAccessToken(data) {
  return data?.access_token
}

export function getLikesCount(payload) {
  return Number(payload?.likes_count ?? 0)
}

export function getAuthorName(author) {
  if (!author) return ""
  if (typeof author === "string") return author
  return author.name || author.username || ""
}

export function getAuthorPic(author) {
  if (!author || typeof author !== "object") return ""
  return author.profilePic || ""
}

export function normalizeUser(data = {}) {
  return {
    id: data.id,
    email: data.email ?? "",
    username: data.username ?? "",
    name: data.name ?? "",
    role: data.role ?? "user",
    profilePic: data.profilePic ?? "",
  }
}

export function unwrapCategories(data) {
  return (Array.isArray(data) ? data : []).map((category) => ({
    id: category.id,
    name: category.name,
  }))
}

export function unwrapComments(data) {
  return Array.isArray(data) ? data : []
}

export function normalizeComment(item) {
  return {
    id: item.id,
    text: item.comment_text ?? "",
    author: item.name || item.username || "Anonymous",
    profilePic: item.profilePic || "",
    createdAt: item.created_at ?? null,
  }
}

export function commentPayload(comment) {
  return { comment }
}

export function resolveCategoryId(categories, post) {
  const match = categories.find((category) => category.name === post?.category)
  return match?.id ?? null
}

export function adminPostsQuery(status) {
  if (status === "all" || status === "draft") return { status }
  return {}
}
