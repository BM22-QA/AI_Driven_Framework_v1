export class Helper {

    /**
     * Removes all characters except digits and the decimal point,
     * then converts the result to a number.
     * @param price Price string, e.g. "$602.00"
     * @returns Numeric value, e.g. 602.00
     */
    static convertPriceToNumber(price: string): number {
        const cleanedPrice = price.replace(/[^0-9.]/g, '');
        return Number(cleanedPrice);
    }

    /**
     * Returns the fixed product details used for the checkout flow.
     */
    static getProductDetails() {
        return {
            productName: "MacBook",
            productQuantity: "1",
            totalPrice: "$602.00",
        };
    }

    /**
     * Returns the fixed login details used for the application.
     */
    static getLoginDetails() {
        return {
            email: "pavanol@xyz.com",
            password: "test@123",
        };
    }
}