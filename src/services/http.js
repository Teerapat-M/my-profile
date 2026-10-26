export function getAccessToken() {
  return localStorage.getItem("access_token")
}

export function authHeaders() {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
