import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:5173/")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Navigate to the '/admin/articles' page to trigger the protected-route redirect and then verify the login page is displayed.
        await page.goto("http://localhost:5173/admin/articles")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Load the root page (http://localhost:5173/) and check for the login UI (look for visible text like 'Email', 'Password', or 'Login' button).
        await page.goto("http://localhost:5173/")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Navigate to '/admin/articles' and check whether the Login page is displayed (look for 'Email', 'Password', or a 'Login' button).
        await page.goto("http://localhost:5173/admin/articles")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Navigate to '/admin/articles' and confirm the Login page is displayed by checking for the 'Log in' heading and the Email and Password fields.
        await page.goto("http://localhost:5173/admin/articles")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # --> Assertions to verify final state
        
        # --> Visiting /admin/articles redirected the visitor to the login page at /login.
        # Assert-outcome: passed
        # Assert: Browser URL contains '/login', indicating the login page is displayed.
        await expect(page).to_have_url(re.compile("/login"), timeout=15000), "Browser URL contains '/login', indicating the login page is displayed."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    