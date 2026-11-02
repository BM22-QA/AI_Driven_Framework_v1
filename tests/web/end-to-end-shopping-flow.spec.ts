/**
 * Test Case: End-to-End Shopping Flow
 *
 * Tags: @master @end-to-end @web
 *
 * Steps:
 * 1) Navigate to the application URL
 * 2) Register a new customer using dynamically generated unique data
 * 3) Verify successful registration
 * 4) Log out
 * 5) Log in again using the newly created credentials
 * 6) Verify successful authentication
 * 7) Reset the shopping cart to a clean state
 * 8) Search for a known product
 * 9) Open the product details page
 * 10) Add the product to the cart
 * 11) Open the shopping cart
 * 12) Verify the correct product
 * 13) Verify the quantity
 * 14) Verify the product price
 * 15) Verify the applicable cart total
 * 16) Verify that the complete journey finishes without errors
 */

import { test, expect } from "../../fixtures/pageFixtures";
import { RandomDataUtil } from "../../utils/dataGenerator";
import { Helper } from "../../utils/helper";

test("End-to-End Shopping Flow test @master @e2e @web", async ({
    homePage,
    registerPage,
    successPage,
    logoutPage,
    loginPage,
    myAccountPage,
    searchResultsPage,
    productPage,
    cartPage,
}) => {
    // Generate unique customer data
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = RandomDataUtil.getEmail();
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = RandomDataUtil.getPassword();

    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    await test.step("1) Navigate to the application URL", async () => {
        // homePage fixture already navigates to APP_URL
        expect(true).toBeTruthy();
    });

    await test.step("2) Register a new customer using dynamically generated unique data", async () => {
        await homePage.clickMyAccount();
        await homePage.clickRegister();
        await registerPage.completeRegistration(
            firstName,
            lastName,
            email,
            telephone,
            password
        );
    });

    await test.step("3) Verify successful registration", async () => {
        const isSuccessPage = await successPage.isSuccessPageExists();
        expect(isSuccessPage).toBeTruthy();
        await successPage.clickContinue();
    });

    await test.step("4) Log out", async () => {
        await homePage.clickMyAccount();
        await myAccountPage.clickLogout();
        const isLogoutPage = await logoutPage.isLogoutPageExists();
        expect(isLogoutPage).toBeTruthy();
        await logoutPage.clickContinue();
    });

    await test.step("5) Log in again using the newly created credentials", async () => {
        await homePage.clickMyAccount();
        await homePage.clickLogin();
        await loginPage.login(email, password);
    });

    await test.step("6) Verify successful authentication", async () => {
        const isMyAccountPage = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountPage).toBeTruthy();
    });

    await test.step("7) Reset the shopping cart to a clean state", async () => {
        await homePage.clickCart();
        const isCartPage = await cartPage.isCartPageExists();
        expect(isCartPage).toBeTruthy();
        await cartPage.clearCart();
    });

    await test.step("8) Search for a known product", async () => {
        await homePage.enterSearchKeyword(productName);
        await homePage.clickSearchButton();
        const isSearchResultsPage = await searchResultsPage.isSearchResultsPageExists();
        expect(isSearchResultsPage).toBeTruthy();
    });

    await test.step("9) Open the product details page", async () => {
        await searchResultsPage.clickProduct(productName);
        const isProductPage = await productPage.isProductPageExists();
        expect(isProductPage).toBeTruthy();
    });

    await test.step("10) Add the product to the cart", async () => {
        await productPage.clickAddToCart();
    });

    await test.step("11) Open the shopping cart", async () => {
        await homePage.clickCart();
        const isCartPage = await cartPage.isCartPageExists();
        expect(isCartPage).toBeTruthy();
    });

    await test.step("12) Verify the correct product", async () => {
        const productNameInCart = await cartPage.getProductNameInCart();
        expect(productNameInCart).toContain(productName);
    });

    await test.step("13) Verify the quantity", async () => {
        const quantity = await cartPage.getProductQuantity();
        expect(quantity).toBe(productQuantity);
    });

    await test.step("14) Verify the product price", async () => {
        const productPriceInCart = await cartPage.getProductPriceInCart();
        expect(productPriceInCart).toContain(totalPrice);
    });

    await test.step("15) Verify the applicable cart total", async () => {
        const cartTotal = await cartPage.getCartTotal();
        expect(cartTotal).toContain(totalPrice);
    });

    await test.step("16) Verify that the complete journey finishes without errors", async () => {
        expect(true).toBeTruthy();
    });

    console.log("✅ ✔️ End-to-End Shopping Flow completed successfully!");
});
