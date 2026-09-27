# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** frontend (my-profile-bell personal blog)
- **Date:** 2026-08-26
- **Prepared by:** TestSprite AI Team
- **Test type:** Frontend (codebase scope)
- **Local app:** http://localhost:5173/ (`npm run dev`)
- **Account:** WolfmanbellBU (Free plan, 150 credits remaining before this run)
- **Dashboard:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd

---

## 2️⃣ Requirement Validation Summary

### Requirement: Admin article management
- **Description:** Authenticated users can create, draft, publish, and edit articles with an image from the admin panel.

#### Test TC001 Publish a new article
- **Test Code:** [TC001_Publish_a_new_article.py](./TC001_Publish_a_new_article.py)
- **Test Error:** TEST BLOCKED — Vite/tunnel returned ERR_EMPTY_RESPONSE; login and publish UI never loaded.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd/test/26bd1a13-7652-4f7c-aec6-be54906c79b6
- **Status:** BLOCKED
- **Severity:** HIGH
- **Analysis / Findings:** This did not fail the publish feature itself. TestSprite cloud could not reach a stable SPA at port 5173 (`ERR_EMPTY_RESPONSE`). Re-run after keeping Vite up and using `--host` so the tunnel can connect reliably.

---

#### Test TC002 Create and save a new article as a draft
- **Test Code:** [TC002_Create_and_save_a_new_article_as_a_draft.py](./TC002_Create_and_save_a_new_article_as_a_draft.py)
- **Test Error:** TEST BLOCKED — blank page / 0 interactive elements on `/` and `/login`.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd/test/12eb53f1-25a8-4bf8-bbd0-d52d108cfd64
- **Status:** BLOCKED
- **Severity:** HIGH
- **Analysis / Findings:** Same environment block as TC001. Draft-save logic in `ArticleFormPage.jsx` was not exercised.

---

#### Test TC004 Edit an existing article and save the changes
- **Test Code:** [TC004_Edit_an_existing_article_and_save_the_changes.py](./TC004_Edit_an_existing_article_and_save_the_changes.py)
- **Test Error:** TEST BLOCKED — SPA did not render; edit flow unreachable.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd/test/8ca4e8d2-4a4c-4b36-bd4b-40925a8a124e
- **Status:** BLOCKED
- **Severity:** HIGH
- **Analysis / Findings:** `updatePost` / PUT `/posts/:id` was not validated. Re-run once the tunnel serves the app.

---

### Requirement: User login
- **Description:** Existing users can submit email/password on `/login` and reach the authenticated home page.

#### Test TC003 Log in with valid credentials
- **Test Code:** [TC003_Log_in_with_valid_credentials.py](./TC003_Log_in_with_valid_credentials.py)
- **Test Error:** TEST BLOCKED — `/login` title was `my-profile-bell` but no email/password fields rendered.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd/test/96e69b19-5746-4bca-ac57-4e33fd8ece50
- **Status:** BLOCKED
- **Severity:** HIGH
- **Analysis / Findings:** HTML shell arrived without hydrated React. Tunnel/dev-server instability, not a proven login-form bug.

---

#### Test TC007 Log in from the login page
- **Test Code:** [TC007_Log_in_from_the_login_page.py](./TC007_Log_in_from_the_login_page.py)
- **Test Error:** TEST BLOCKED — `127.0.0.1` ERR_EMPTY_RESPONSE; login form never loaded.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd/test/04f7214c-95dd-48d5-8c9d-66131e84ff66
- **Status:** BLOCKED
- **Severity:** HIGH
- **Analysis / Findings:** Duplicate of TC003 under tunnel failure. Local login page exists in `LoginPage.jsx`.

---

### Requirement: User signup
- **Description:** New users can register and land on `/registration-success`.

#### Test TC008 Sign up for a new account
- **Test Code:** [TC008_Sign_up_for_a_new_account.py](./TC008_Sign_up_for_a_new_account.py)
- **Test Error:** TEST BLOCKED — localhost ERR_EMPTY_RESPONSE; no registration form.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd/test/5738b312-7a6f-484b-9502-b26934fa87ce
- **Status:** BLOCKED
- **Severity:** HIGH
- **Analysis / Findings:** Signup UI was not reached. Not a product-logic failure.

---

#### Test TC009 Sign up for a new account and reach the confirmation page
- **Test Code:** [TC009_Sign_up_for_a_new_account_and_reach_the_confirmation_page.py](./TC009_Sign_up_for_a_new_account_and_reach_the_confirmation_page.py)
- **Test Error:** TEST BLOCKED — `/signup` blank; 0 interactive elements.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd/test/7b704be4-5def-4fef-9093-2b1f2e14599e
- **Status:** BLOCKED
- **Severity:** HIGH
- **Analysis / Findings:** Same tunnel/SPA load issue as TC008.

---

### Requirement: Browse published articles
- **Description:** Visitors can see article cards on home and open a post detail page.

#### Test TC005 Browse published articles on the home page
- **Test Code:** [TC005_Browse_published_articles_on_the_home_page.py](./TC005_Browse_published_articles_on_the_home_page.py)
- **Test Error:** TEST BLOCKED — home page ERR_EMPTY_RESPONSE.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd/test/8a4237ab-3b14-4fae-8011-bf509d9673ae
- **Status:** BLOCKED
- **Severity:** HIGH
- **Analysis / Findings:** Home listing was not executed. Vite logs later showed Axios `Network Error` on `GET /posts` when the page did load.

---

#### Test TC006 Read a post and see its details
- **Test Code:** [TC006_Read_a_post_and_see_its_details.py](./TC006_Read_a_post_and_see_its_details.py)
- **Test Error:** TEST BLOCKED — no article cards; SPA unresponsive.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd/test/00f0067e-8629-4cd1-b5ba-3dfa1005ac8c
- **Status:** BLOCKED
- **Severity:** HIGH
- **Analysis / Findings:** Detail page `/post/:postId` was never opened.

---

### Requirement: Protected admin access
- **Description:** Unauthenticated visitors must be redirected from `/admin/*` to `/login`.

#### Test TC010 Redirect logged-out users away from protected admin pages
- **Test Code:** [TC010_Redirect_logged_out_users_away_from_protected_admin_pages.py](./TC010_Redirect_logged_out_users_away_from_protected_admin_pages.py)
- **Test Error:**
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd/test/4c11c129-497c-4299-9ca8-ba0593c8c85b
- **Status:** ✅ Passed
- **Severity:** LOW
- **Analysis / Findings:** Visiting `/admin/articles` while logged out redirected to `/login`. Matches `ProtectedRoute.jsx`.

---

#### Test TC012 Visit the protected admin area while logged out
- **Test Code:** [TC012_Visit_the_protected_admin_area_while_logged_out.py](./TC012_Visit_the_protected_admin_area_while_logged_out.py)
- **Test Error:** TEST BLOCKED — `/admin` ERR_EMPTY_RESPONSE; no login UI.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd/test/d4ae8ab5-24b8-4fa3-9156-d1be589fc63e
- **Status:** BLOCKED
- **Severity:** MEDIUM
- **Analysis / Findings:** Same requirement as TC010, but this run hit the tunnel outage. Function is already proven by TC010.

---

### Requirement: Search and category filters
- **Description:** Visitors can search and filter the home article list.

#### Test TC011 Filter articles by category
- **Test Code:** [TC011_Filter_articles_by_category.py](./TC011_Filter_articles_by_category.py)
- **Test Error:** TEST BLOCKED — home SPA blank.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd/test/b51dbbe1-6daa-49fe-81e1-172c7f1d2c63
- **Status:** BLOCKED
- **Severity:** HIGH
- **Analysis / Findings:** Category filter was not exercised.

---

#### Test TC013 Search for articles from the home page
- **Test Code:** [TC013_Search_for_articles_from_the_home_page.py](./TC013_Search_for_articles_from_the_home_page.py)
- **Test Error:** TEST FAILURE — UI showed `Failed to load posts` / `No results found` for query `cat`.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd/test/e34e8c5a-5180-49b4-82f4-c57fd807fc28
- **Status:** ❌ Failed
- **Severity:** HIGH
- **Analysis / Findings:** This is the only functional failure. The home page loaded enough to show search, then `fetchPosts` (`GET /posts` via `VITE_API_BASE_URL`) returned a network error from the TestSprite cloud browser. Vite logs recorded `AxiosError: Network Error` in `ArticleSection.jsx` / `ArticleSearch.jsx`. Cause is likely the tunneled page calling the deployed Vercel API (CORS, mixed network, or API unreachable from the cloud browser), not a broken search input.

---

#### Test TC015 Find articles with search and category filters
- **Test Code:** [TC015_Find_articles_with_search_and_category_filters.py](./TC015_Find_articles_with_search_and_category_filters.py)
- **Test Error:** TEST BLOCKED — 127.0.0.1 ERR_EMPTY_RESPONSE.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd/test/22c3ba06-4cd3-4292-a60a-dcd16d7aa8ea
- **Status:** BLOCKED
- **Severity:** HIGH
- **Analysis / Findings:** Combined search+filter not executed because the server did not respond.

---

### Requirement: Admin profile
- **Description:** Logged-in users can save profile changes on `/admin/profile`.

#### Test TC014 Update profile details successfully
- **Test Code:** [TC014_Update_profile_details_successfully.py](./TC014_Update_profile_details_successfully.py)
- **Test Error:** TEST BLOCKED — `/login` ERR_EMPTY_RESPONSE.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/53321a46-08f5-5140-9485-6da5f15ce8cd/test/f6852d86-0d04-4d70-818f-8de9a9199e10
- **Status:** BLOCKED
- **Severity:** MEDIUM
- **Analysis / Findings:** Profile update was not reached. Requires a working login first.

---

## 3️⃣ Coverage & Matching Metrics

- **6.67% of tests passed** (1 of 15)
- **1 failed**, **13 blocked** (environment / tunnel)
- Frontend test plan coverage: public browse, auth, protected admin, article CRUD, search/filter, profile

| Requirement | Total Tests | ✅ Passed | ❌ Failed | BLOCKED |
|--------------------|-------------|-----------|------------|---------|
| Admin article management | 3 | 0 | 0 | 3 |
| User login | 2 | 0 | 0 | 2 |
| User signup | 2 | 0 | 0 | 2 |
| Browse published articles | 2 | 0 | 0 | 2 |
| Protected admin access | 2 | 1 | 0 | 1 |
| Search and category filters | 3 | 0 | 1 | 2 |
| Admin profile | 1 | 0 | 0 | 1 |
| **Total** | **15** | **1** | **1** | **13** |

---

## 4️⃣ Key Gaps / Risks

> Only 1/15 tests passed. Most cases never reached the real UI because TestSprite’s tunnel got `ERR_EMPTY_RESPONSE` on localhost:5173 while Vite was under load.

> **Infrastructure (highest impact):** Run Vite with `npm run dev -- --host 0.0.0.0` so the tunnel can bind, keep the process alive, and avoid restarting during execution. Re-run TestSprite after that.

> **Functional (TC013):** Home search showed `Failed to load posts`. `GET /posts` against `VITE_API_BASE_URL` (Vercel) failed from the cloud browser. Confirm CORS on the backend and that the API is reachable; optionally run backend locally on :4000 and point the frontend at it for a stable test run.

> **Not validated this round:** publish/draft/edit article, login, signup, post detail, category filter, profile update. Protected-route redirect to `/login` is the only confirmed behavior.

> **Auth for re-run:** TestSprite used `{{LOGIN_USER}}` / `{{LOGIN_PASSWORD}}`. Complete the config portal credentials if login tests should actually authenticate.
