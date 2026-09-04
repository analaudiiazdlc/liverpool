import { test, expect } from '@playwright/test';
import { locators } from './locators.js';

test.beforeEach(async ({ page }) => {
  await page.goto("https://www.liverpool.com.mx");
  await page.locator(locators.SEARCH_BUTTON).isVisible();
});

test('Buscar productos', async ({ page }) => {
  await searchProduct(page, "playstation 5");
  await page.locator(locators.CHECKBOX_WHITE).click();
  await page.locator(locators.SORTING_BUTTON).click();
  await page.locator(locators.SORTING_OPTION_LOWER).click();
  await page.waitForTimeout(3000);

  for (let i = 0; i < 5; i++) {
    var productInfo = await getProductInfo(page, i + 1);
    console.log(`Elemento ${i + 1}: ${productInfo.elemento} - Costo: ${productInfo.costo}`);
  }
});

async function searchProduct(page, productName) {
  await page.locator(locators.SEARCH_BUTTON).fill(productName);
  await page.press(locators.SEARCH_BUTTON, "Enter");
}

async function getProductInfo(page, index) {
  const elemento = await page.locator(`(//a[@role='link']//h3)[${index}]`).textContent();
  const costo = await page.locator(`(//a[@role='link']//span[@class='text-body-xl font-semibold text-price-primary font-bold'])[${index}]`).textContent();
  return { elemento, costo };
}