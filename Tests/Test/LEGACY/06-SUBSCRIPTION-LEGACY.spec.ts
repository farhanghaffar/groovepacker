import { expect, test } from '@playwright/test';
import { generateUniqueID } from '../../../Utils/testUtils';
import { SubscriptionCreationPage } from '../../Pages/SubscriptionCreationPage';
import { ScanVerifyV3Page } from '../../Pages/ScanVerifyV3';

test.describe(`Page - SUBSCRIPTION - LEGACY`, () => {
  const createdTenants: string[] = [];

  test.afterEach(async ({ page }) => {
    if (createdTenants.length > 0) {
      const scanVerifyV3Page = new ScanVerifyV3Page(page);

      await test.step('Login to Admin Tools for Tenant Cleanup', async () => {
        await scanVerifyV3Page.visit();
        await scanVerifyV3Page.conditionalLoginAdmin(
          `${process.env.VALID_USERNAME}`,
          `${process.env.VALID_PASSWORD}`,
        );

        for (const tenantName of createdTenants) {
          try {
            await scanVerifyV3Page.searchTenantFromTable(tenantName);
            await scanVerifyV3Page.deleteDuplicateTenantAfterTestCase(
              tenantName,
            );
            console.log(`Deleted tenant: ${tenantName}`);
          } catch (error) {
            console.log(
              `Could not delete tenant ${tenantName}: ${error.message}`,
            );
          }
        }
      });
      createdTenants.length = 0;
    }
    await page.close();
  });

  test('SUBSCRIPTION-01 - Create subscription with CNBANND5 coupon - legacy_sub_01', async ({
    page,
  }) => {
    const subscriptionPage = new SubscriptionCreationPage(page);
    const uniqueId = generateUniqueID(6).toLowerCase();
    const testData = {
      ...subscriptionPage.generateTestData(`sub01${uniqueId}`),
      couponCode: 'CNBANND5',
    };
    createdTenants.push(testData.siteName);

    await test.step('Create subscription with coupon', async () => {
      await subscriptionPage.createSubscription(testData);
    });
  });

  test('SUBSCRIPTION-02 - Create subscription without coupon (full price) - legacy_sub_02', async ({
    page,
  }) => {
    const subscriptionPage = new SubscriptionCreationPage(page);
    const uniqueId = generateUniqueID(6).toLowerCase();
    const testData = subscriptionPage.generateTestData(`sub02${uniqueId}`);
    createdTenants.push(testData.siteName);

    await test.step('Fill form and skip coupon', async () => {
      await subscriptionPage.navigateToSubscriptionPage();
      await subscriptionPage.fillSubscriptionForm(testData);
    });

    await test.step('Direct purchase without coupon', async () => {
      await subscriptionPage.completePayment();
    });
  });

  test('SUBSCRIPTION-03 - Test form validation with playwrite detection - legacy_sub_03', async ({
    page,
  }) => {
    const subscriptionPage = new SubscriptionCreationPage(page);
    const uniqueId = generateUniqueID(6).toLowerCase();
    const testData = subscriptionPage.generateTestData(`validation${uniqueId}`);
    createdTenants.push(testData.siteName);

    await test.step('Test form validation', async () => {
      await subscriptionPage.navigateToSubscriptionPage();
      await subscriptionPage.fillSubscriptionForm(testData);
      await subscriptionPage.verifyFormFields(testData);
      await subscriptionPage.verifyBackendDetectionFields(testData);
    });
  });

  test('SUBSCRIPTION-04 - Test coupon validation with backend test mode - legacy_sub_04', async ({
    page,
  }) => {
    const subscriptionPage = new SubscriptionCreationPage(page);
    const uniqueId = generateUniqueID(6).toLowerCase();
    const testData = {
      ...subscriptionPage.generateTestData(`coupontest${uniqueId}`),
      couponCode: 'CNBANND5',
    };
    createdTenants.push(testData.siteName);

    await test.step('Test coupon validation', async () => {
      await subscriptionPage.navigateToSubscriptionPage();
      await subscriptionPage.fillSubscriptionForm(testData);
      await subscriptionPage.applyCoupon(testData.couponCode);
    });
  });

  test('SUBSCRIPTION-05 - Test direct purchase (no coupon interaction) - legacy_sub_05', async ({
    page,
  }) => {
    const subscriptionPage = new SubscriptionCreationPage(page);
    const uniqueId = generateUniqueID(6).toLowerCase();
    const testData = subscriptionPage.generateTestData(`direct${uniqueId}`);
    createdTenants.push(testData.siteName);

    await test.step('Test direct purchase flow', async () => {
      await subscriptionPage.navigateToSubscriptionPage();
      await subscriptionPage.fillSubscriptionForm(testData);

      // Verify coupon field exists but don't interact with it
      await subscriptionPage.couponField.isVisible();

      // Go directly to purchase
      await subscriptionPage.completePayment();
    });
  });

  test('SUBSCRIPTION-06 - Test payment modal and card input - legacy_sub_06', async ({
    page,
  }) => {
    const subscriptionPage = new SubscriptionCreationPage(page);
    const uniqueId = generateUniqueID(6).toLowerCase();
    const testData = subscriptionPage.generateTestData(`payment${uniqueId}`);
    createdTenants.push(testData.siteName);

    await test.step('Test payment modal', async () => {
      await subscriptionPage.navigateToSubscriptionPage();
      await subscriptionPage.fillSubscriptionForm(testData);
      await subscriptionPage.completePayment();
    });
  });
});
