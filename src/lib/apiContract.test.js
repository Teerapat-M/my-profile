import { describe, expect, it } from "vitest"
import {
  adminPostsQuery,
  commentPayload,
  getAuthorName,
  getAuthorPic,
  getLikesCount,
  getLoginAccessToken,
  normalizeComment,
  normalizeUser,
  resolveCategoryId,
  unwrapCategories,
  unwrapComments,
} from "./apiContract"

describe("api contract helpers", () => {
  it("reads access_token from login {message, access_token, user}", () => {
    expect(
      getLoginAccessToken({
        message: "User has been signed in successfully",
        access_token: "jwt-a",
        user: { id: "u1" },
      })
    ).toBe("jwt-a")
    expect(getLoginAccessToken({ accessToken: "jwt-b" })).toBeUndefined()
  })

  it("reads likes_count and does not fall back to likes", () => {
    expect(getLikesCount({ likes_count: 4, liked: true, likes: 99 })).toBe(4)
    expect(getLikesCount({ likes: 99 })).toBe(0)
  })

  it("reads post.author {name, username, profilePic}", () => {
    const author = { name: "Ada", username: "ada", profilePic: "https://img/ada.png" }
    expect(getAuthorName(author)).toBe("Ada")
    expect(getAuthorPic(author)).toBe("https://img/ada.png")
  })

  it("keeps get-user / update-profile fields", () => {
    expect(
      normalizeUser({
        id: "u1",
        email: "ada@example.com",
        username: "ada",
        name: "Ada",
        role: "admin",
        profilePic: "https://img/ada.png",
      })
    ).toEqual({
      id: "u1",
      email: "ada@example.com",
      username: "ada",
      name: "Ada",
      role: "admin",
      profilePic: "https://img/ada.png",
    })
  })

  it("maps category NAME on posts to categories.id", () => {
    const categories = [
      { id: 7, name: "Cat" },
      { id: 3, name: "General" },
    ]
    expect(resolveCategoryId(categories, { category: "Cat" })).toBe(7)
    expect(resolveCategoryId(categories, { category: "General" })).toBe(3)
    expect(resolveCategoryId(categories, { category: "Cat" })).not.toBe(1)
  })

  it("unwraps category arrays and comment arrays", () => {
    expect(unwrapCategories([{ id: 1, name: "Cat" }])).toEqual([
      { id: 1, name: "Cat" },
    ])
    expect(
      unwrapComments([
        {
          id: 2,
          post_id: 9,
          user_id: "u1",
          comment_text: "hi",
          created_at: "2026-01-01",
          name: "Ada",
          username: "ada",
          profilePic: "https://img/ada.png",
        },
      ])
    ).toHaveLength(1)
    expect(
      normalizeComment({
        id: 2,
        post_id: 9,
        user_id: "u1",
        comment_text: "hi",
        created_at: "2026-01-01",
        name: "Ada",
        username: "ada",
        profilePic: "https://img/ada.png",
      })
    ).toEqual({
      id: 2,
      text: "hi",
      author: "Ada",
      profilePic: "https://img/ada.png",
      createdAt: "2026-01-01",
    })
    expect(commentPayload("hello")).toEqual({ comment: "hello" })
  })

  it("sends status=all or status=draft for admin lists", () => {
    expect(adminPostsQuery("all")).toEqual({ status: "all" })
    expect(adminPostsQuery("draft")).toEqual({ status: "draft" })
    expect(adminPostsQuery("published")).toEqual({})
  })
})
