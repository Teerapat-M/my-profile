const USERS_KEY = "hh_registered_users"

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function createToken(userId) {
  return `local.${userId}.${Date.now()}`
}

function getUserIdFromToken(accessToken) {
  if (!accessToken?.startsWith("local.")) return null
  return accessToken.split(".")[1]
}

function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role ?? "user",
    profilePic: user.profilePic ?? "",
  }
}

export function localRegister({ name, username, email, password }) {
  const users = readUsers()
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedUsername = username.trim().toLowerCase()

  if (users.some((user) => user.username.toLowerCase() === normalizedUsername)) {
    const error = new Error("This username is already taken")
    error.response = { data: { error: "This username is already taken" } }
    throw error
  }

  if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
    const error = new Error("User with this email already exists")
    error.response = { data: { error: "User with this email already exists" } }
    throw error
  }

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    username: username.trim(),
    email: normalizedEmail,
    password,
    role: "user",
    profilePic: "",
  }

  writeUsers([...users, user])
  return { message: "User created successfully" }
}

export function localLogin({ email, password }) {
  const users = readUsers()
  const normalizedEmail = email.trim().toLowerCase()
  const user = users.find(
    (entry) =>
      entry.email.toLowerCase() === normalizedEmail && entry.password === password
  )

  if (!user) {
    const error = new Error("Invalid credentials")
    error.response = {
      data: { error: "Your password is incorrect or this email doesn't exist" },
    }
    throw error
  }

  return {
    message: "User has been signed in successfully",
    access_token: createToken(user.id),
    user: toPublicUser(user),
  }
}

export function localGetUser(accessToken) {
  const userId = getUserIdFromToken(accessToken)
  const user = readUsers().find((entry) => entry.id === userId)

  if (!user) {
    const error = new Error("Unauthorized")
    error.response = { data: { error: "Unauthorized: Invalid token" } }
    throw error
  }

  return toPublicUser(user)
}

function readProfileFields(profile) {
  if (typeof FormData !== "undefined" && profile instanceof FormData) {
    return {
      name: profile.get("name"),
      username: profile.get("username"),
      imageFile: profile.get("imageFile"),
    }
  }
  return profile
}

export function localUpdateProfile(accessToken, profile) {
  const userId = getUserIdFromToken(accessToken)
  const users = readUsers()
  const index = users.findIndex((entry) => entry.id === userId)

  if (index === -1) {
    const error = new Error("Unauthorized")
    error.response = { data: { error: "Unauthorized: Invalid token" } }
    throw error
  }

  const fields = readProfileFields(profile)
  const name = String(fields.name ?? users[index].name).trim()
  const username = String(fields.username ?? users[index].username).trim()
  const normalizedUsername = username.toLowerCase()

  if (
    users.some(
      (user, i) =>
        i !== index && user.username.toLowerCase() === normalizedUsername
    )
  ) {
    const error = new Error("This username is already taken")
    error.response = { data: { error: "This username is already taken" } }
    throw error
  }

  let profilePic = users[index].profilePic ?? ""
  if (fields.imageFile instanceof File) {
    profilePic = URL.createObjectURL(fields.imageFile)
  } else if (typeof fields.profilePic === "string" && fields.profilePic) {
    profilePic = fields.profilePic
  }

  users[index] = {
    ...users[index],
    name,
    username,
    profilePic,
  }

  writeUsers(users)
  return toPublicUser(users[index])
}

export function localResetPassword(accessToken, { currentPassword, newPassword }) {
  const userId = getUserIdFromToken(accessToken)
  const users = readUsers()
  const index = users.findIndex((entry) => entry.id === userId)

  if (index === -1) {
    const error = new Error("Unauthorized")
    error.response = { data: { error: "Unauthorized: Invalid token" } }
    throw error
  }

  if (users[index].password !== currentPassword) {
    const error = new Error("Current password is incorrect")
    error.response = { data: { error: "Current password is incorrect" } }
    throw error
  }

  users[index] = { ...users[index], password: newPassword }
  writeUsers(users)
  return { message: "Password reset successfully" }
}
