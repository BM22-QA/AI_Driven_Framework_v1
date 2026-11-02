import { Page, Locator } from "@playwright/test";
import { RegisterPage } from "./RegisterPage";
import { LoginPage } from "./LoginPage";
import { CartPage } from "./CartPage";

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly myAccountLink: Locator;
    private readonly registerLink: Locator;
    private readonly loginLink: Locator;
    private readonly searchInput: Locator;
    private readonly cartLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.myAccountLink = page.locator('a[title="My Account"]');
        this.registerLink = page.locator('a[href*="route=account/register"]');
        this.loginLink = page.locator('a[href*="route=account/login"]');
        this.searchInput = page.locator('input[name="search"]');
        this.cartLink = page.locator('#top-links a[href*="route=checkout/cart"]');
    }

    /**
     * Clicks the My Account link in the top navigation
     */
    async clickMyAccount(): Promise<void> {
        await this.myAccountLink.click();
    }

    /**
     * Clicks the Register link
     * @returns Promise<RegisterPage> - Instance of the Register page
     */
    async clickRegister(): Promise<RegisterPage> {
        await this.registerLink.click();
        return new RegisterPage(this.page);
    }

    /**
     * Clicks the Login link
     * @returns Promise<LoginPage> - Instance of the Login page
     */
    async clickLogin(): Promise<LoginPage> {
        await this.loginLink.click();
        return new LoginPage(this.page);
    }

    /**
     * Enters a search keyword into the search field
     * @param keyword - Search keyword to enter
     */
    async enterSearchKeyword(keyword: string): Promise<void> {
        await this.searchInput.fill(keyword);
    }

    /**
     * Clicks the search button
     */
    async clickSearchButton(): Promise<void> {
        await this.page.locator('#search button').click();
    }

    /**
     * Clicks the shopping cart link
     * @returns Promise<CartPage> - Instance of the Cart page
     */
    async clickCart(): Promise<CartPage> {
        await this.cartLink.click();
        return new CartPage(this.page);
    }
}