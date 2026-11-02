import { Page, Locator } from "@playwright/test";
import { SuccessPage } from "./SuccessPage";

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly emailInput: Locator;
    private readonly telephoneInput: Locator;
    private readonly passwordInput: Locator;
    private readonly confirmPasswordInput: Locator;
    private readonly privacyPolicyCheckbox: Locator;
    private readonly continueButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.firstNameInput = page.locator('input[name="firstname"]');
        this.lastNameInput = page.locator('input[name="lastname"]');
        this.emailInput = page.locator('input[name="email"]');
        this.telephoneInput = page.locator('input[name="telephone"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.confirmPasswordInput = page.locator('input[name="confirm"]');
        this.privacyPolicyCheckbox = page.locator('input[name="agree"]');
        this.continueButton = page.locator('input[value="Continue"]');
    }

    /**
     * Fills the registration form with the provided customer data
     * @param firstName - Customer first name
     * @param lastName - Customer last name
     * @param email - Customer email address
     * @param telephone - Customer telephone number
     * @param password - Customer password
     */
    async fillRegistrationForm(
        firstName: string,
        lastName: string,
        email: string,
        telephone: string,
        password: string
    ): Promise<void> {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.emailInput.fill(email);
        await this.telephoneInput.fill(telephone);
        await this.passwordInput.fill(password);
        await this.confirmPasswordInput.fill(password);
    }

    /**
     * Checks the Privacy Policy agreement checkbox
     */
    async agreeToPrivacyPolicy(): Promise<void> {
        await this.privacyPolicyCheckbox.check();
    }

    /**
     * Clicks the Continue button to submit the registration form
     * @returns Promise<SuccessPage> - Instance of the Success page
     */
    async clickContinue(): Promise<SuccessPage> {
        await this.continueButton.click();
        return new SuccessPage(this.page);
    }

    /**
     * Completes the full registration flow
     * @param firstName - Customer first name
     * @param lastName - Customer last name
     * @param email - Customer email address
     * @param telephone - Customer telephone number
     * @param password - Customer password
     * @returns Promise<SuccessPage> - Instance of the Success page
     */
    async completeRegistration(
        firstName: string,
        lastName: string,
        email: string,
        telephone: string,
        password: string
    ): Promise<SuccessPage> {
        await this.fillRegistrationForm(firstName, lastName, email, telephone, password);
        await this.agreeToPrivacyPolicy();
        return await this.clickContinue();
    }
}