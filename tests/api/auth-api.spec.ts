import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

// override: true keeps .env authoritative over same-named OS variables (e.g. Windows USERNAME)
dotenv.config({ override: true });

test.describe('FakeStore Auth API Tests', () => {

    // ---------------------------------------------------------
    // Configuration
    // ---------------------------------------------------------

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USERNAME = process.env.USERNAME || 'mor_2314';
    const PASSWORD = process.env.PASSWORD || '';

    // ---------------------------------------------------------
    // POST - Successful Login
    // ---------------------------------------------------------

    test('POST - Successful Login @master @sanity @api', async ({ request }) => {

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: { username: USERNAME, password: PASSWORD },
        });

        expect(response.status()).toBe(201);

        const responseBody = await response.json();

        expect(responseBody.token, 'login response should contain a token').toBeTruthy();
        expect(typeof responseBody.token, 'token should be a string').toBe('string');
        expect(responseBody.token.length, 'token should not be empty').toBeGreaterThan(0);
    });

    // ---------------------------------------------------------
    // POST - Invalid Login
    // ---------------------------------------------------------

    test('POST - Invalid Login @master @regression @api', async ({ request }) => {

        const payload = RandomDataUtil.generateInvalidLoginPayload();

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, { data: payload });

        expect(response.status()).toBe(401);

        const message = await response.text();

        expect(message, 'invalid login should return the expected error message')
            .toContain('username or password is incorrect');
    });
});
