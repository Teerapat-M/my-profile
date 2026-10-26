import axios from "axios"
import { ENDPOINTS } from "@/config/api"
import { unwrapCategories } from "@/lib/apiContract"
import { authHeaders } from "@/services/http"

export async function getCategories({ keyword = "" } = {}) {
  const response = await axios.get(ENDPOINTS.categories, {
    headers: authHeaders(),
  })
  const query = keyword.trim().toLowerCase()
  const categories = unwrapCategories(response.data)
  if (!query) return categories
  return categories.filter((category) =>
    category.name.toLowerCase().includes(query)
  )
}

export async function getCategoryById(id) {
  try {
    const response = await axios.get(`${ENDPOINTS.categories}/${id}`, {
      headers: authHeaders(),
    })
    return response.data
  } catch (error) {
    if (error.response?.status === 404) return null
    throw error
  }
}

export async function createCategory({ name }) {
  const response = await axios.post(
    ENDPOINTS.categories,
    { name: name.trim() },
    { headers: authHeaders() }
  )
  return response.data
}

export async function updateCategory(id, { name }) {
  const response = await axios.put(
    `${ENDPOINTS.categories}/${id}`,
    { name: name.trim() },
    { headers: authHeaders() }
  )
  return response.data
}

export async function deleteCategory(id) {
  const response = await axios.delete(`${ENDPOINTS.categories}/${id}`, {
    headers: authHeaders(),
  })
  return response.data
}
