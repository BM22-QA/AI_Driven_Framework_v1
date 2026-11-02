import { test as base, Page } from "@playwright/test";
import dotenv from "dotenv";
import { HomePage } from "../pages/HomePage";
import { RegisterPage } from "../pages/RegisterPage";
import { LoginPage } from "../pages/LoginPage";
import { MyAccountPage } from "../pages/MyAccountPage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { SuccessPage } from "../pages/SuccessPage";
import { SearchResultsPage } from "../pages/SearchResultsPage";
import { LogoutPage } from "../pages/LogoutPage";

dotenv.config();

const APP_URL = process.env.WEB_APP_URL || "https://naveenautomationlabs.com/opencart";

type PageFixtures = {
    homePage: HomePage;
    registerPage: RegisterPage;
    loginPage: LoginPage;
    myAccountPage: MyAccountPage;
    productPage: ProductPage;
    cartPage: CartPage;
    successPage: SuccessPage;
    searchResultsPage: SearchResultsPage;
    logoutPage: LogoutPage;
};

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        await page.goto(APP_URL);
        await use(new HomePage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    myAccountPage: async ({ page }, use) => {
        await use(new MyAccountPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    successPage: async ({ page }, use) => {
        await use(new SuccessPage(page));
    },
    searchResultsPage: async ({ page }, use) => {
        await use(new SearchResultsPage(page));
    },
    logoutPage: async ({ page }, use) => {
        await use(new LogoutPage(page));
    },
});

export { expect } from "@playwright/test";