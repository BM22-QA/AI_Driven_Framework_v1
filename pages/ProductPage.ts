import { Page, Locator } from "@playwright/test";
import { CartPage } from "./CartPage";

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly productNameHeading: Locator;
    private readonly productPrice: Locator;
    private readonly addToCartButton: Locator;
    private readonly successAlert: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.productNameHeading = page.locator('#content h1');
        this.productPrice = page.locator('#content ul li h2');
        this.addToCartButton = page.locator('#button-cart');
        this.successAlert = page.locator('.alert-success');
    }

    /**
     * Verifies that the product details page is displayed
     * @returns Promise<boolean> - true if the page is displayed
     */
    async isProductPageExists(): Promise<boolean> {
        try {
            await this.addToCartButton.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking product page: ${error}`);
            return false;
        }
    }

    /**
     * Gets the product name from the page heading
     * @returns Promise<string> - Product name text
     */
    async getProductName(): Promise<string> {
        return await this.productNameHeading.textContent() ?? "";
    }

    /**
     * Gets the product price from the page
     * @returns Promise<string> - Product price text
     */
    async getProductPrice(): Promise<string> {
        return await this.productPrice.textContent() ?? "";
    }

    /**
     * Clicks the Add to Cart button and waits for the cart confirmation
     * @returns Promise<CartPage> - Instance of the Cart page
     */
    async clickAddToCart(): Promise<CartPage> {
        await this.addToCartButton.click();
        await this.successAlert.waitFor({ state: 'visible', timeout: 10000 });
        return new CartPage(this.page);
    }
}