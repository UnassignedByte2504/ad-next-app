import { test, expect } from "@playwright/test";

test.describe("Theme Synchronization", () => {
  test("should persist theme preference across page reload", async ({
    page,
  }) => {
    // 1. Navigate to homepage
    await page.goto("/");

    // Wait for hydration
    await page.waitForTimeout(500);

    // 2. Get initial state
    const initialClass = await page.locator("html").getAttribute("class");
    console.log("Initial HTML class:", initialClass);

    // 3. Find and click the theme toggle button
    const themeToggle = page.getByRole("button", { name: /theme|tema|modo/i });
    await themeToggle.click();

    // 4. Wait for theme to change
    await page.waitForTimeout(300);

    // 5. Get current HTML class and localStorage
    const afterClickClass = await page.locator("html").getAttribute("class");
    const localStorageValue = await page.evaluate(() => {
      const stored = localStorage.getItem("bemyre-store");
      return stored ? JSON.parse(stored) : null;
    });
    console.log("After click HTML class:", afterClickClass);
    console.log("localStorage theme:", localStorageValue?.state?.ui?.theme);

    // Verify theme changed
    expect(afterClickClass).not.toBe(initialClass);

    // 6. Reload the page
    await page.reload();

    // 7. Wait for hydration to complete
    await page.waitForTimeout(500);

    // 8. Verify HTML class matches localStorage theme
    const afterReloadClass = await page.locator("html").getAttribute("class");
    const afterReloadStorage = await page.evaluate(() => {
      const stored = localStorage.getItem("bemyre-store");
      return stored ? JSON.parse(stored) : null;
    });

    console.log("After reload HTML class:", afterReloadClass);
    console.log(
      "After reload localStorage theme:",
      afterReloadStorage?.state?.ui?.theme
    );

    // The HTML class should match the stored theme
    const storedTheme = afterReloadStorage?.state?.ui?.theme;
    if (storedTheme === "dark") {
      expect(afterReloadClass).toContain("dark");
    } else if (storedTheme === "light") {
      expect(afterReloadClass).toContain("light");
    }
    // For "system", we'd need to check the media query preference

    // 9. Verify toggle still works
    const themeToggleAfterReload = page.getByRole("button", {
      name: /theme|tema|modo/i,
    });
    await themeToggleAfterReload.click();
    await page.waitForTimeout(300);

    const finalClass = await page.locator("html").getAttribute("class");
    console.log("Final HTML class:", finalClass);

    // Theme should have changed from the persisted state
    expect(finalClass).not.toBe(afterReloadClass);
  });

  test("should apply correct theme on fresh load with existing preference", async ({
    page,
    context,
  }) => {
    // Set localStorage before navigating
    await context.addInitScript(() => {
      localStorage.setItem(
        "bemyre-store",
        JSON.stringify({
          state: {
            auth: {},
            ui: { theme: "dark", sidebarCollapsed: false },
          },
          version: 2,
        })
      );
    });

    // Navigate with pre-set localStorage
    await page.goto("/");

    // Wait for hydration
    await page.waitForTimeout(500);

    // Check HTML class immediately
    const htmlClass = await page.locator("html").getAttribute("class");
    console.log("HTML class with pre-set dark theme:", htmlClass);

    // Should have dark class
    expect(htmlClass).toContain("dark");
  });
});
