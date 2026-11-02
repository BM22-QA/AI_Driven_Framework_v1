import { Page, Locator } from "@playwright/test";
import { ProductPage } from "./ProductPage";

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly resultsHeading: Locator;
    private readonly productHeadingLinks: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.resultsHeading = page.locator('#content h1').filter({ hasText: /Search/i });
        this.productHeadingLinks = page.locator('#content .product-layout h4');
    }

    /**
     * Verifies that the search results page is displayed
     * @returns Promise<boolean> - true if the page is displayed
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        try {
            await this.resultsHeading.waitFor({ state: 'visible', timeout: 10000 });
            return true;
        } catch (error) {
            console.log(`Error checking search results page: ${error}`);
            return false;
        }
    }

    /**
     * Opens the product details page for the given product name
     * @param productName - Name of the product to open
     * @returns Promise<ProductPage> - Instance of the Product page
     */
    async clickProduct(productName: string): Promise<ProductPage> {
        await this.productHeadingLinks.getByRole('link', { name: productName, exact: true }).click();
        return new ProductPage(this.page);
    }
}
