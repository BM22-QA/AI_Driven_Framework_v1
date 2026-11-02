import { Page, Locator } from "@playwright/test";
import { MyAccountPage } from "./MyAccountPage";

export class SuccessPage {
    private readonly page: Page;

    // Locators
    private readonly successHeading: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.successHeading = page.locator('#content h1').filter({ hasText: /Your Account Has Been Created!/i });
        this.continueButton = page.locator('#content').getByRole('link', { name: 'Continue', exact: true });
    }

    /**
     * Verifies that the success page is displayed
     * @returns Promise<boolean> - true if the page is displayed
     */
    async isSuccessPageExists(): Promise<boolean> {
        try {
            await this.successHeading.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking success page: ${error}`);
            return false;
        }
    }

    /**
     * Clicks the Continue button on the success page
     * @returns Promise<MyAccountPage> - Instance of the My Account page
     */
    async clickContinue(): Promise<MyAccountPage> {
        await this.continueButton.click();
        return new MyAccountPage(this.page);
    }
}