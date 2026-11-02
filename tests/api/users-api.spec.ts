import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

// override: true keeps .env authoritative over same-named OS variables (e.g. Windows USERNAME)
dotenv.config({ override: true });

test.describe('FakeStore Users API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);
    const LIMIT = Number(process.env.LIMIT ?? 3);

    // ---------------------------------------------------------
    // GET - All Users
    // ---------------------------------------------------------

    test('GET - All Users @master @sanity @api', async ({ request }) => {

        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'users response should be an array').toBeTruthy();
        expect(responseBody.length, 'users response should not be empty').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // GET - User by ID
    // ---------------------------------------------------------

    test('GET - User by ID @master @sanity @api', async ({ request }) => {

        const path = Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID));

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id, 'returned user id should match the requested id').toBe(USER_ID);
        expect(typeof responseBody.email, 'email should be a string').toBe('string');
        expect(responseBody.name, 'user should include a name object').toBeTruthy();
    });

    // ---------------------------------------------------------
    // GET - Users with Limit
    // ---------------------------------------------------------

    test('GET - Users with Limit @master @regression @api', async ({ request }) => {

        const path = Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT));

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(Array.isArray(responseBody), 'limited users response should be an array').toBeTruthy();
        expect(responseBody.length, `response should contain exactly ${LIMIT} users`).toBe(LIMIT);
    });

    // ---------------------------------------------------------
    // GET - Users Sorted Ascending
    // ---------------------------------------------------------

    test('GET - Users Sorted Ascending @master @regression @api', async ({ request }) => {

        const path = Routes.GET_USERS_SORTED.replace('{order}', 'asc');

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((user: { id: number }) => user.id);
        const ascending = [...ids].sort((a, b) => a - b);

        expect(ids, 'user ids should be in ascending order').toEqual(ascending);
    });

    // ---------------------------------------------------------
    // GET - Users Sorted Descending
    // ---------------------------------------------------------

    test('GET - Users Sorted Descending @master @regression @api', async ({ request }) => {

        const path = Routes.GET_USERS_SORTED.replace('{order}', 'desc');

        const response = await request.get(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();
        const ids = responseBody.map((user: { id: number }) => user.id);
        const descending = [...ids].sort((a, b) => b - a);

        expect(ids, 'user ids should be in descending order').toEqual(descending);
    });

    // ---------------------------------------------------------
    // POST - Create User
    // ---------------------------------------------------------

    test('POST - Create User @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserPayload();

        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.id, 'created user should have a generated id').toBeTruthy();
        expect(typeof responseBody.id, 'generated user id should be a number').toBe('number');
    });

    // ---------------------------------------------------------
    // PUT - Update User
    // ---------------------------------------------------------

    test('PUT - Update User @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateUserUpdatePayload();
        const path = Routes.UPDATE_USER.replace('{id}', String(USER_ID));

        const response = await request.put(`${BASE_URL}${path}`, { data: payload });

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.username, 'updated username should match the submitted username').toBe(payload.username);
        expect(responseBody.email, 'updated email should match the submitted email').toBe(payload.email);
        expect(responseBody.name.firstname, 'updated first name should match the submitted first name')
            .toBe(payload.name.firstname);
    });

    // ---------------------------------------------------------
    // DELETE - Delete User
    // ---------------------------------------------------------

    test('DELETE - Delete User @master @regression @api', async ({ request }) => {

        const path = Routes.DELETE_USER.replace('{id}', String(USER_ID));

        const response = await request.delete(`${BASE_URL}${path}`);

        expect(response.status()).toBe(200);

        const responseBody = await response.json();

        expect(responseBody.id, 'deleted user response should reference the requested id').toBe(USER_ID);
    });
});
