import axios from "axios"
import { ENDPOINTS } from "@/config/api"
import {
  commentPayload,
  normalizeComment,
  unwrapComments,
} from "@/lib/apiContract"
import { authHeaders } from "@/services/http"

export async function fetchPosts(params = {}) {
  const response = await axios.get(ENDPOINTS.posts, {
    params: {
      page: 1,
      limit: 6,
      ...params,
    },
    headers: authHeaders(),
  })

  return {
    posts: response.data.posts ?? [],
    nextPage: response.data.nextPage ?? null,
    currentPage: response.data.currentPage ?? 1,
    totalPages: response.data.totalPages ?? 1,
    totalPosts: response.data.totalPosts ?? 0,
  }
}

export async function fetchPostById(postId) {
  const response = await axios.get(`${ENDPOINTS.posts}/${postId}`, {
    headers: authHeaders(),
  })
  return response.data
}

export async function fetchComments(postId) {
  const response = await axios.get(`${ENDPOINTS.posts}/${postId}/comments`, {
    headers: authHeaders(),
  })
  return unwrapComments(response.data).map(normalizeComment)
}

export async function createComment(postId, commentText) {
  const response = await axios.post(
    `${ENDPOINTS.posts}/${postId}/comments`,
    commentPayload(commentText),
    { headers: authHeaders() }
  )
  return response.data
}

export async function likePost(postId) {
  const response = await axios.post(
    `${ENDPOINTS.posts}/${postId}/likes`,
    {},
    { headers: authHeaders() }
  )
  return response.data
}

export async function unlikePost(postId) {
  const response = await axios.delete(`${ENDPOINTS.posts}/${postId}/likes`, {
    headers: authHeaders(),
  })
  return response.data
}
