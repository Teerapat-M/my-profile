const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://backend-express-server.vercel.app"

export const ENDPOINTS = {
  posts: `${API_BASE_URL}/posts`,
  categories: `${API_BASE_URL}/categories`,
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    getUser: `${API_BASE_URL}/auth/get-user`,
    updateProfile: `${API_BASE_URL}/auth/update-profile`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
  },
}
