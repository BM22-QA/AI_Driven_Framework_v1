import { Page, Locator } from "@playwright/test";
import { HomePage } from "./HomePage";

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly logoutHeading: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.logoutHeading = page.locator('#content h1').filter({ hasText: /Account Logout/i });
        this.continueButton = page.locator('#content a[href*="route=common/home"]');
    }

    /**
     * Verifies that the logout confirmation page is displayed
     * @returns Promise<boolean> - true if the page is displayed
     */
    async isLogoutPageExists(): Promise<boolean> {
        try {
            await this.logoutHeading.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking logout page: ${error}`);
            return false;
        }
    }

    /**
     * Clicks the Continue button on the logout page
     * @returns Promise<HomePage> - Instance of the Home page
     */
    async clickContinue(): Promise<HomePage> {
        await this.continueButton.click();
        return new HomePage(this.page);
    }
}
