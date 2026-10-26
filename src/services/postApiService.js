import axios from "axios"
import { ENDPOINTS } from "@/config/api"
import { authHeaders } from "@/services/http"

/**
 * สร้างโพสต์ใหม่พร้อมอัปโหลดรูป (multipart/form-data)
 * ต้องส่ง FormData ที่มี title, category_id, description, content, status_id, imageFile
 */
export async function createPostWithImage(formData) {
  const response = await axios.post(ENDPOINTS.posts, formData, {
    headers: authHeaders(),
  })

  return response.data
}

export async function updatePost(postId, payload) {
  const response = await axios.put(`${ENDPOINTS.posts}/${postId}`, payload, {
    headers: authHeaders(),
  })

  return response.data
}

export async function deletePost(postId) {
  const response = await axios.delete(`${ENDPOINTS.posts}/${postId}`, {
    headers: authHeaders(),
  })

  return response.data
}

export const POST_STATUS = {
  draft: 1,
  published: 2,
}

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

export function validateImageFile(file) {
  if (!file) {
    return "Please select an image file."
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Please upload a valid image file (JPEG, PNG, GIF, WebP)."
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "The file is too large. Please upload an image smaller than 5MB."
  }

  return null
}
