import axios from "axios"
import { ENDPOINTS } from "@/config/api"
import { normalizeUser } from "@/lib/apiContract"
import {
  localGetUser,
  localLogin,
  localRegister,
  localResetPassword,
  localUpdateProfile,
} from "@/services/localAuthStore"

function isRemoteUnavailable(error) {
  if (!error.response) return true
  if (error.response.status >= 500) return true
  const message = error.response.data?.error
  return (
    message === "fetch failed" ||
    message === "An error occurred during registration"
  )
}

export async function registerUser(payload) {
  try {
    const response = await axios.post(ENDPOINTS.auth.register, payload)
    return response.data
  } catch (error) {
    if (!isRemoteUnavailable(error)) throw error
    return localRegister(payload)
  }
}

export async function loginUser(payload) {
  try {
    const response = await axios.post(ENDPOINTS.auth.login, payload)
    return response.data
  } catch (error) {
    if (!isRemoteUnavailable(error)) throw error
    return localLogin(payload)
  }
}

export async function fetchCurrentUser(accessToken) {
  if (accessToken?.startsWith("local.")) return normalizeUser(localGetUser(accessToken))

  try {
    const response = await axios.get(ENDPOINTS.auth.getUser, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return normalizeUser(response.data)
  } catch (error) {
    if (!isRemoteUnavailable(error)) throw error
    return normalizeUser(localGetUser(accessToken))
  }
}

export async function updateUserProfile(accessToken, profile) {
  try {
    const response = await axios.put(ENDPOINTS.auth.updateProfile, profile, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return normalizeUser(response.data)
  } catch (error) {
    if (
      accessToken?.startsWith("local.") ||
      isRemoteUnavailable(error) ||
      error.response?.status === 404
    ) {
      return normalizeUser(localUpdateProfile(accessToken, profile))
    }
    throw error
  }
}

export async function resetUserPassword(accessToken, passwords) {
  try {
    const response = await axios.put(
      ENDPOINTS.auth.resetPassword,
      {
        oldPassword: passwords.oldPassword ?? passwords.currentPassword,
        newPassword: passwords.newPassword,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
    return response.data
  } catch (error) {
    if (
      accessToken?.startsWith("local.") ||
      isRemoteUnavailable(error) ||
      error.response?.status === 404
    ) {
      return localResetPassword(accessToken, passwords)
    }
    throw error
  }
}
