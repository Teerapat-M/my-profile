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
        
        # -> Click the visible 'Reload' button to retry loading the home page.
        # Reload button
        elem = page.locator('[id="reload-button"]')
        await elem.click(timeout=10000)
        
        # -> Reload the home page and wait for the search input or article list to appear.
        await page.goto("http://localhost:5173/")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Type 'cat' into the Search field and perform the search (submit) to filter the article list.
        # Search text field
        elem = page.locator('xpath=/html/body/div/div/section[2]/div/div/div/div[2]/div/input')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("cat")
        
        # --> Assertions to verify final state
        
        # --> Searching for articles did not return matching results — the article list shows a loading/error state.
        # Assert-outcome: failed
        # Assert: Expected the article list to display matching results, not the 'Failed to load posts' error.
        await expect(page.locator("xpath=/html/body/div").nth(0)).to_contain_text("Failed to load posts", timeout=15000), "Expected the article list to display matching results, not the 'Failed to load posts' error."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    