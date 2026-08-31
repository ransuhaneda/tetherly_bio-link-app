import { test, expect } from '@playwright/test';

test.describe('public and authentication entry points', () => {
  test('landing page exposes the primary account actions', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('link', { name: /log in/i })).toBeVisible();
    await expect(
      page
        .getByRole('link', { name: /create an account|sign up|get started/i })
        .first()
    ).toBeVisible();
  });

  test('visitor can open the login form', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.locator('#login-password')).toBeVisible();
    await expect(page.getByRole('button', { name: /^log in$/i })).toBeVisible();
  });

  test('visitor can open the account creation form', async ({ page }) => {
    await page.goto('/signup');

    await expect(
      page.getByRole('heading', { name: /create an account/i })
    ).toBeVisible();
    await expect(page.getByLabel('Your name')).toBeVisible();
    await expect(page.getByLabel('Your username')).toBeVisible();
    await expect(page.getByLabel('Email address')).toBeVisible();
    await expect(page.getByLabel('Create a password')).toBeVisible();
    await expect(page.getByLabel('Confirm your password')).toBeVisible();
  });

  test('unknown public profile shows the not-found state', async ({ page }) => {
    await page.goto('/@definitely-not-a-real-tetherly-profile');

    await expect(
      page.getByRole('heading', { name: /this tether isn.t available/i })
    ).toBeVisible();
  });
});

test('login form enforces required fields before submitting', async ({
  page,
}) => {
  await page.goto('/login');
  await page.getByRole('button', { name: /^log in$/i }).click();

  await expect(page.getByLabel('Email address')).toHaveJSProperty(
    'validity.valid',
    false
  );
});

test('signup form rejects an invalid username in the browser', async ({
  page,
}) => {
  await page.goto('/signup');
  const username = page.getByLabel('Your username');
  await username.fill('a');
  await page.getByRole('button', { name: /create your account/i }).click();

  await expect(username).toHaveAttribute('pattern', '[a-zA-Z0-9_-]+');
  expect(
    await username.evaluate((input: HTMLInputElement) => input.checkValidity())
  ).toBe(false);
});

test('new account session survives a page reload', async ({ page }) => {
  const unique = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const password = 'Tetherly-E2E-Session-9!';

  await page.goto('/signup');
  await page.getByLabel('Your name').fill('Session E2E');
  await page.getByLabel('Your username').fill(`session${unique}`.slice(0, 30));
  await page.getByLabel('Email address').fill(`session-${unique}@example.test`);
  await page.getByLabel('Create a password').fill(password);
  await page.getByLabel('Confirm your password').fill(password);
  await page.getByRole('button', { name: /create your account/i }).click();

  await expect(page).toHaveURL(/\/dashboard\/profile$/);
  await page.reload();

  await expect(page).toHaveURL(/\/dashboard\/profile$/);
});
