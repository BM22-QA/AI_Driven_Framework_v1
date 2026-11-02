import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

// override: true keeps .env authoritative over same-named OS variables (e.g. Windows USERNAME)
dotenv.config({ override: true });

test.describe('FakeStore Product CRUD Workflow', () => {

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;

    test('Product CRUD Workflow @master @regression @api', async ({ request }) => {

        // ---------------------------------------------------------
        // Create
        // ---------------------------------------------------------

        const createPayload = RandomDataUtil.generateProductPayload();

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: createPayload });

        expect(createResponse.status()).toBe(201);

        const created = await createResponse.json();
        expect(created.id, 'created product should have an id').toBeTruthy();

        const productId = created.id;

        // ---------------------------------------------------------
        // Update
        // ---------------------------------------------------------

        const updatePayload = RandomDataUtil.generateUpdatedProductPayload();
        const updatePath = Routes.UPDATE_PRODUCT.replace('{id}', String(productId));

        const updateResponse = await request.put(`${BASE_URL}${updatePath}`, { data: updatePayload });

        expect(updateResponse.status()).toBe(200);

        const updated = await updateResponse.json();
        expect(updated.id, 'updated product id should match the created id').toBe(productId);
        expect(updated.title, 'updated title should match the submitted title').toBe(updatePayload.title);
        expect(updated.price, 'updated price should match the submitted price').toBe(updatePayload.price);

        // ---------------------------------------------------------
        // Delete
        // ---------------------------------------------------------

        const deletePath = Routes.DELETE_PRODUCT.replace('{id}', String(productId));

        const deleteResponse = await request.delete(`${BASE_URL}${deletePath}`);

        expect(deleteResponse.status()).toBe(200);
    });
});

test.describe('FakeStore User CRUD Workflow', () => {

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;

    test('User CRUD Workflow @master @regression @api', async ({ request }) => {

        // ---------------------------------------------------------
        // Create
        // ---------------------------------------------------------

        const createPayload = RandomDataUtil.generateUserPayload();

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: createPayload });

        expect(createResponse.status()).toBe(201);

        const created = await createResponse.json();
        expect(created.id, 'created user should have a generated id').toBeTruthy();

        const userId = created.id;

        // ---------------------------------------------------------
        // Update
        // ---------------------------------------------------------

        const updatePayload = RandomDataUtil.generateUserUpdatePayload();
        const updatePath = Routes.UPDATE_USER.replace('{id}', String(userId));

        const updateResponse = await request.put(`${BASE_URL}${updatePath}`, { data: updatePayload });

        expect(updateResponse.status()).toBe(200);

        const updated = await updateResponse.json();
        expect(updated.username, 'updated username should match the submitted username').toBe(updatePayload.username);
        expect(updated.email, 'updated email should match the submitted email').toBe(updatePayload.email);

        // ---------------------------------------------------------
        // Delete
        // ---------------------------------------------------------

        const deletePath = Routes.DELETE_USER.replace('{id}', String(userId));

        const deleteResponse = await request.delete(`${BASE_URL}${deletePath}`);

        expect(deleteResponse.status()).toBe(200);
    });
});

test.describe('FakeStore Cart CRUD Workflow', () => {

    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID ?? 1);

    test('Cart CRUD Workflow @master @regression @api', async ({ request }) => {

        // ---------------------------------------------------------
        // Create
        // ---------------------------------------------------------

        const createPayload = RandomDataUtil.generateCartPayload(USER_ID);

        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: createPayload });

        expect(createResponse.status()).toBe(201);

        const created = await createResponse.json();
        expect(created.id, 'created cart should have an id').toBeTruthy();
        expect(created.userId, 'created cart should belong to the submitted user').toBe(USER_ID);
        expect(created.products, 'created cart should contain the submitted products').toEqual(createPayload.products);

        const cartId = created.id;

        // ---------------------------------------------------------
        // Update
        // ---------------------------------------------------------

        const updatePayload = {
            userId: USER_ID,
            date: RandomDataUtil.getCurrentDate(),
            products: [{ productId: 1, quantity: createPayload.products[0].quantity + 1 }],
        };
        const updatePath = Routes.UPDATE_CART.replace('{id}', String(cartId));

        const updateResponse = await request.put(`${BASE_URL}${updatePath}`, { data: updatePayload });

        expect(updateResponse.status()).toBe(200);

        const updated = await updateResponse.json();
        expect(updated.products[0].quantity, 'updated cart quantity should reflect the requested change')
            .toBe(updatePayload.products[0].quantity);

        // ---------------------------------------------------------
        // Delete
        // ---------------------------------------------------------

        const deletePath = Routes.DELETE_CART.replace('{id}', String(cartId));

        const deleteResponse = await request.delete(`${BASE_URL}${deletePath}`);

        expect(deleteResponse.status()).toBe(200);
    });
});
