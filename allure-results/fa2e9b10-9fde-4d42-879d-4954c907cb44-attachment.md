# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web\end-to-end-shopping-flow.spec.ts >> End-to-End Shopping Flow test @master @end-to-end @web
- Location: tests\web\end-to-end-shopping-flow.spec.ts:28:5

# Error details

```
Error: page.goto: net::ERR_NAME_NOT_RESOLVED at https://naveenautomationlabs.com/opencart
Call log:
  - navigating to "https://naveenautomationlabs.com/opencart", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e6]:
    - heading "This site can’t be reached" [level=1] [ref=e7]
    - paragraph [ref=e8]:
      - strong [ref=e9]: naveenautomationlabs.com
      - text: ’s DNS address could not be found. Diagnosing the problem.
    - generic [ref=e10]:
      - paragraph
      - list [ref=e11]:
        - listitem [ref=e12]:
          - link "Try running Windows Network Diagnostics" [ref=e13] [cursor=pointer]:
            - /url: javascript:diagnoseErrors()
          - text: .
    - generic [ref=e14]: DNS_PROBE_STARTED
  - button "Reload" [ref=e17] [cursor=pointer]
```

# Test source

```ts
  1  | import { test as base, Page } from "@playwright/test";
  2  | import dotenv from "dotenv";
  3  | import { HomePage } from "../pages/HomePage";
  4  | import { RegisterPage } from "../pages/RegisterPage";
  5  | import { LoginPage } from "../pages/LoginPage";
  6  | import { MyAccountPage } from "../pages/MyAccountPage";
  7  | import { ProductPage } from "../pages/ProductPage";
  8  | import { CartPage } from "../pages/CartPage";
  9  | import { SuccessPage } from "../pages/SuccessPage";
  10 | 
  11 | dotenv.config();
  12 | 
  13 | const APP_URL = process.env.WEB_APP_URL || "https://naveenautomationlabs.com/opencart";
  14 | 
  15 | type PageFixtures = {
  16 |     homePage: HomePage;
  17 |     registerPage: RegisterPage;
  18 |     loginPage: LoginPage;
  19 |     myAccountPage: MyAccountPage;
  20 |     productPage: ProductPage;
  21 |     cartPage: CartPage;
  22 |     successPage: SuccessPage;
  23 | };
  24 | 
  25 | export const test = base.extend<PageFixtures>({
  26 |     homePage: async ({ page }, use) => {
> 27 |         await page.goto(APP_URL);
     |                    ^ Error: page.goto: net::ERR_NAME_NOT_RESOLVED at https://naveenautomationlabs.com/opencart
  28 |         await use(new HomePage(page));
  29 |     },
  30 |     registerPage: async ({ page }, use) => {
  31 |         await use(new RegisterPage(page));
  32 |     },
  33 |     loginPage: async ({ page }, use) => {
  34 |         await use(new LoginPage(page));
  35 |     },
  36 |     myAccountPage: async ({ page }, use) => {
  37 |         await use(new MyAccountPage(page));
  38 |     },
  39 |     productPage: async ({ page }, use) => {
  40 |         await use(new ProductPage(page));
  41 |     },
  42 |     cartPage: async ({ page }, use) => {
  43 |         await use(new CartPage(page));
  44 |     },
  45 |     successPage: async ({ page }, use) => {
  46 |         await use(new SuccessPage(page));
  47 |     },
  48 | });
  49 | 
  50 | export { expect } from "@playwright/test";
```