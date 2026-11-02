import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

// override: true keeps .env authoritative over same-named OS variables (e.g. Windows USERNAME)
dotenv.config({ override: true });

test.describe('FakeStore Carts API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const CART_ID = Number(process.env.CART_ID ?? 1);
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);
    const START_DATE = process.env.START_DATE || '2019-12-10';
    const END_DATE = process.env.END_DATE || '2020-10-10';

    // ---------------------------------------------------------
    // GET - All Carts
    // ---------------------------------------------------------

    test('GET - All Carts @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'carts response should be an array').toBeTruthy();
        expect(responseBody.length, 'carts response should not be empty').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - Cart by ID
    // ---------------------------------------------------------

    test('GET - Cart by ID @master @sanity @api', async ({ request }) => {

        const path = Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID));

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id, 'returned cart id should match the requested id').toBe(CART_ID);
        expect(Array.isArray(responseBody.products), 'cart should include a products array').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Carts by Date Range
    // ---------------------------------------------------------

    test('GET - Carts by Date Range @master @regression @api', async ({ request }) => {

        const path = Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', START_DATE)
            .replace('{enddate}', END_DATE);

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'carts by date response should be an array').toBeTruthy();

        responseBody.forEach((cart: { id: number; date: string }) => {
            const cartDate = new Date(cart.date);
            expect(cartDate >= new Date(START_DATE), `cart ${cart.id} date should be on or after ${START_DATE}`)
                .toBeTruthy();
            expect(cartDate <= new Date(END_DATE), `cart ${cart.id} date should be on or before ${END_DATE}`)
                .toBeTruthy();
        });
    });

    // ---------------------------------------------------------
    // GET - User Cart
    // ---------------------------------------------------------

    test('GET - User Cart @master @regression @api', async ({ request }) => {

        const path = Routes.GET_USER_CART.replace('{userId}', String(USER_ID));

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'user cart response should be an array').toBeTruthy();

        responseBody.forEach((cart: { userId: number }) => {
            expect(cart.userId, 'each cart should belong to the requested user').toBe(USER_ID);
        });
    });

    // ---------------------------------------------------------
    // GET - Carts with Limit
    // ---------------------------------------------------------

    test('GET - Carts with Limit @master @regression @api', async ({ request }) => {

        const path = Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT));

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'limited carts response should be an array').toBeTruthy();
        expect(responseBody.length, `response should contain exactly ${LIMIT} carts`).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Carts Sorted Ascending
    // ---------------------------------------------------------

    test('GET - Carts Sorted Ascending @master @regression @api', async ({ request }) => {

        const path = Routes.GET_CARTS_SORTED.replace('{order}', 'asc');

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((cart: { id: number }) => cart.id);
        const ascending = [...ids].sort((a, b) => a - b);

        expect(ids, 'cart ids should be in ascending order').toEqual(ascending);
    });

    // ---------------------------------------------------------
    // GET - Carts Sorted Descending
    // ---------------------------------------------------------

    test('GET - Carts Sorted Descending @master @regression @api', async ({ request }) => {

        const path = Routes.GET_CARTS_SORTED.replace('{order}', 'desc');

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((cart: { id: number }) => cart.id);
        const descending = [...ids].sort((a, b) => b - a);

        expect(ids, 'cart ids should be in descending order').toEqual(descending);
    });

    // ---------------------------------------------------------
    // POST - Create Cart
    // ---------------------------------------------------------

    test('POST - Create Cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateCartPayload(USER_ID);

        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.id, 'created cart should have an id').toBeTruthy();
        expect(responseBody.userId, 'created cart should belong to the submitted user').toBe(USER_ID);
        expect(responseBody.products, 'created cart should contain the submitted products').toEqual(payload.products);
    });

    // ---------------------------------------------------------
    // PUT - Update Cart
    // ---------------------------------------------------------

    test('PUT - Update Cart @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        const path = Routes.UPDATE_CART.replace('{id}', String(CART_ID));

        const response = await request.put(`${BASE_URL}${path}`, { data: payload });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.userId, 'updated cart should belong to the submitted user').toBe(USER_ID);
        expect(responseBody.products[0].quantity, 'updated cart quantity should match the submitted quantity')
            .toBe(payload.products[0].quantity);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Cart
    // ---------------------------------------------------------

    test('DELETE - Delete Cart @master @regression @api', async ({ request }) => {

        const path = Routes.DELETE_CART.replace('{id}', String(CART_ID));

        const response = await request.delete(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id, 'deleted cart response should reference the requested id').toBe(CART_ID);
    });
});
