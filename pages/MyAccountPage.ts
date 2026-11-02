import { Page, Locator } from "@playwright/test";
import { LogoutPage } from "./LogoutPage";

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly logoutLink: Locator;
    private readonly myAccountHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.logoutLink = page.locator('.dropdown-menu a[href*="route=account/logout"]');
        this.myAccountHeading = page.locator('h2, h1').filter({ hasText: /My Account/i });
    }

    /**
     * Clicks the Logout link
     * @returns Promise<LogoutPage> - Instance of the Logout page
     */
    async clickLogout(): Promise<LogoutPage> {
        await this.logoutLink.click();
        return new LogoutPage(this.page);
    }

    /**
     * Verifies that the My Account page is displayed
     * @returns Promise<boolean> - true if the page is displayed
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            await this.myAccountHeading.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking My Account page: ${error}`);
            return false;
        }
    }
}