export function getInitials(name) {
  const parts = String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (!parts.length) return "TM"
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
}

export function ProfileAvatar({ src, name, className = "size-8 text-xs" }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name || "User"}
        className={`rounded-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-emerald-600 font-semibold tracking-tight text-white ${className}`}
      aria-hidden
    >
      {getInitials(name)}
    </div>
  )
}
