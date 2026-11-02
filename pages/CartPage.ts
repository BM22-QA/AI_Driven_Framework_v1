import { Page, Locator } from "@playwright/test";

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly cartHeading: Locator;
    private readonly cartTable: Locator;
    private readonly productNameCell: Locator;
    private readonly quantityInput: Locator;
    private readonly productPriceCell: Locator;
    private readonly cartTotalCell: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.cartHeading = page.locator('#content h1').filter({ hasText: /Shopping Cart/i });
        this.cartTable = page.locator('#content .table-responsive table');
        this.productNameCell = this.cartTable.locator('tbody td.text-left a');
        this.quantityInput = this.cartTable.locator('tbody input[name^="quantity"]');
        this.productPriceCell = this.cartTable.locator('tbody td.text-right');
        this.cartTotalCell = page.locator('#content table tbody tr').filter({ hasText: /^\s*Total:/ }).locator('td').last();
    }

    /**
     * Verifies that the cart page is displayed
     * @returns Promise<boolean> - true if the page is displayed
     */
    async isCartPageExists(): Promise<boolean> {
        try {
            await this.cartHeading.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking cart page: ${error}`);
            return false;
        }
    }

    /**
     * Removes every product currently present in the shopping cart
     */
    async clearCart(): Promise<void> {
        const removeButtons = this.cartTable.locator('tbody button[onclick*="cart.remove"]');
        let count = await removeButtons.count();
        while (count > 0) {
            await removeButtons.first().click();
            await this.page.waitForFunction(
                (previous: number) =>
                    document.querySelectorAll('#content .table-responsive table tbody button[onclick*="cart.remove"]').length < previous,
                count
            );
            count = await removeButtons.count();
        }
    }

    /**
     * Gets the product name in the cart
     * @returns Promise<string> - Product name text
     */
    async getProductNameInCart(): Promise<string> {
        return await this.productNameCell.first().textContent() ?? "";
    }

    /**
     * Gets the product quantity in the cart
     * @returns Promise<string> - Product quantity text
     */
    async getProductQuantity(): Promise<string> {
        return await this.quantityInput.inputValue();
    }

    /**
     * Gets the product price in the cart
     * @returns Promise<string> - Product price text
     */
    async getProductPriceInCart(): Promise<string> {
        return await this.productPriceCell.first().textContent() ?? "";
    }

    /**
     * Gets the cart total
     * @returns Promise<string> - Cart total text
     */
    async getCartTotal(): Promise<string> {
        return await this.cartTotalCell.last().textContent() ?? "";
    }
}
