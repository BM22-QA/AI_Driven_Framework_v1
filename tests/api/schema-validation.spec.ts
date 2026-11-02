import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import Ajv from 'ajv';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';

// override: true keeps .env authoritative over same-named OS variables (e.g. Windows USERNAME)
dotenv.config({ override: true });

test.describe('FakeStore API Schema Validation Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const CART_ID = Number(process.env.CART_ID ?? 1);

    const ajv = new Ajv({ allErrors: true });

    // ---------------------------------------------------------
    // Product Response Schema
    // ---------------------------------------------------------

    test('SCHEMA - Product Response @master @regression @api', async ({ request }) => {

        const schema = DataProvider.readJson('./api/schemas/product_api_schema.json');
        const validate = ajv.compile(schema);

        const path = Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID));

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const isValid = validate(responseBody);

        expect(isValid, `product response should match the product schema: ${JSON.stringify(validate.errors)}`)
            .toBeTruthy();
    });

    // ---------------------------------------------------------
    // User Response Schema
    // ---------------------------------------------------------

    test('SCHEMA - User Response @master @regression @api', async ({ request }) => {

        const schema = DataProvider.readJson('./api/schemas/user_api_schema.json');
        const validate = ajv.compile(schema);

        const path = Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID));

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const isValid = validate(responseBody);

        expect(isValid, `user response should match the user schema: ${JSON.stringify(validate.errors)}`)
            .toBeTruthy();
    });

    // ---------------------------------------------------------
    // Cart Response Schema
    // ---------------------------------------------------------

    test('SCHEMA - Cart Response @master @regression @api', async ({ request }) => {

        const schema = DataProvider.readJson('./api/schemas/cart_api_schema.json');
        const validate = ajv.compile(schema);

        const path = Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID));

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const isValid = validate(responseBody);

        expect(isValid, `cart response should match the cart schema: ${JSON.stringify(validate.errors)}`)
            .toBeTruthy();
    });
});
