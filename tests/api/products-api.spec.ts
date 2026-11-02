import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

// override: true keeps .env authoritative over same-named OS variables (e.g. Windows USERNAME)
dotenv.config({ override: true });

test.describe('FakeStore Products API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Products
    // ---------------------------------------------------------

    test('GET - All Products @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'products response should be an array').toBeTruthy();
        expect(responseBody.length, 'products response should not be empty').toBeGreaterThan(0);

        responseBody.forEach((product: { id: number; title: string; price: number; category: string; image: string }) => {
            expect(product.id, 'each product should have an id').toBeTruthy();
            expect(typeof product.title, 'title should be a string').toBe('string');
            expect(typeof product.price, 'price should be a number').toBe('number');
            expect(typeof product.category, 'category should be a string').toBe('string');
            expect(typeof product.image, 'image should be a string').toBe('string');
        });
    });

    // ---------------------------------------------------------
    // GET - Product by ID
    // ---------------------------------------------------------

    test('GET - Product by ID @master @sanity @api', async ({ request }) => {

        const path = Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID));

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id, 'returned product id should match the requested id').toBe(PRODUCT_ID);
        expect(typeof responseBody.title, 'title should be a string').toBe('string');
        expect(typeof responseBody.price, 'price should be a number').toBe('number');
        expect(typeof responseBody.description, 'description should be a string').toBe('string');
        expect(typeof responseBody.category, 'category should be a string').toBe('string');
        expect(typeof responseBody.image, 'image should be a string').toBe('string');
        expect(responseBody.rating, 'product should include rating details').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Products with Limit
    // ---------------------------------------------------------

    test('GET - Products with Limit @master @regression @api', async ({ request }) => {

        const path = Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT));

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'limited products response should be an array').toBeTruthy();
        expect(responseBody.length, `response should contain exactly ${LIMIT} products`).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Products Sorted Ascending
    // ---------------------------------------------------------

    test('GET - Products Sorted Ascending @master @regression @api', async ({ request }) => {

        const path = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc');

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((product: { id: number }) => product.id);
        const ascending = [...ids].sort((a, b) => a - b);

        expect(ids, 'product ids should be in ascending order').toEqual(ascending);
    });

    // ---------------------------------------------------------
    // GET - Products Sorted Descending
    // ---------------------------------------------------------

    test('GET - Products Sorted Descending @master @regression @api', async ({ request }) => {

        const path = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc');

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((product: { id: number }) => product.id);
        const descending = [...ids].sort((a, b) => b - a);

        expect(ids, 'product ids should be in descending order').toEqual(descending);
    });

    // ---------------------------------------------------------
    // GET - All Product Categories
    // ---------------------------------------------------------

    test('GET - All Product Categories @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'categories response should be an array').toBeTruthy();
        expect(responseBody.length, 'categories response should not be empty').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - Products by Category
    // ---------------------------------------------------------

    test('GET - Products by Category @master @regression @api', async ({ request }) => {

        const category = 'electronics';
        const path = Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', category);

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'category products response should be an array').toBeTruthy();
        expect(responseBody.length, 'category should contain at least one product').toBeGreaterThan(0);

        responseBody.forEach((product: { category: string }) => {
            expect(product.category, 'each product should belong to the requested category').toBe(category);
        });
    });

    // ---------------------------------------------------------
    // POST - Create Product
    // ---------------------------------------------------------

    test('POST - Create Product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateProductPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.id, 'created product should have an id').toBeTruthy();
        expect(responseBody.title, 'created title should match the submitted title').toBe(payload.title);
        expect(responseBody.price, 'created price should match the submitted price').toBe(payload.price);
        expect(responseBody.description, 'created description should match the submitted description').toBe(payload.description);
        expect(responseBody.category, 'created category should match the submitted category').toBe(payload.category);
        expect(responseBody.image, 'created image should match the submitted image').toBe(payload.image);
    });

    // ---------------------------------------------------------
    // PUT - Update Product
    // ---------------------------------------------------------

    test('PUT - Update Product @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUpdatedProductPayload();
        const path = Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID));

        const response = await request.put(`${BASE_URL}${path}`, { data: payload });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id, 'updated product id should match the requested id').toBe(PRODUCT_ID);
        expect(responseBody.title, 'updated title should match the submitted title').toBe(payload.title);
        expect(responseBody.price, 'updated price should match the submitted price').toBe(payload.price);
        expect(responseBody.category, 'updated category should match the submitted category').toBe(payload.category);
    });

    // ---------------------------------------------------------
    // DELETE - Delete Product
    // ---------------------------------------------------------

    test('DELETE - Delete Product @master @regression @api', async ({ request }) => {

        const path = Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID));

        const response = await request.delete(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id, 'deleted product response should reference the requested id').toBe(PRODUCT_ID);
    });
});
