import { Page, Locator } from "@playwright/test";
import { MyAccountPage } from "./MyAccountPage";

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('input[value="Login"]');
    }

    /**
     * Enters the email address into the email field
     * @param email - Customer email address
     */
    async enterEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    /**
     * Enters the password into the password field
     * @param password - Customer password
     */
    async enterPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    /**
     * Clicks the Login button
     * @returns Promise<MyAccountPage> - Instance of the My Account page
     */
    async clickLogin(): Promise<MyAccountPage> {
        await this.loginButton.click();
        return new MyAccountPage(this.page);
    }

    /**
     * Performs the complete login flow
     * @param email - Customer email address
     * @param password - Customer password
     * @returns Promise<MyAccountPage> - Instance of the My Account page
     */
    async login(email: string, password: string): Promise<MyAccountPage> {
        await this.enterEmail(email);
        await this.enterPassword(password);
        return await this.clickLogin();
    }
}