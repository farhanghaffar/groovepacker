import { expect, test } from '@playwright/test';
import { ScanVerifyV3Page } from '../../Pages/ScanVerifyV3';
import { LoginPage } from '../../Pages/Login';
import { ScanVerifyPage } from '../../Pages/ScanVerify';
import { updateOrderList } from '../../../Utils/updateApi';
import {
  expo1ProtectedToken,
  generateUniqueID,
} from '../../../Utils/testUtils';

test.describe(`Page - EXPO1 - V3`, () => {
  test('First Test of Scanning Basics - expo1v3-01', async ({
    page,
    request,
  }) => {
    const order = 'abc';
    const orderId = 1188;
    const orderMsg = 'The order has already been scanned.';
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${process.env.VALID_USER_ACCOUNT_3}`;
    const duplicateTenantName = `expo1${generateUniqueID(
      4,
    ).toLowerCase()}_playwright`;
    /**
     * Pre Conditions
     **/
    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await scanVerifyV3Page.successfulLogin(
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });
    await test.step('Search Tenant from Table and Duplicate', async () => {
      await scanVerifyV3Page.searchTenantFromTable(tenantName);
      await scanVerifyV3Page.selectTenantToDuplicate(tenantName);
      await scanVerifyV3Page.duplicateTenantAndObserve(duplicateTenantName);
    });

    await test.step('Observe Tenant is Duplicated', async () => {
      await scanVerifyV3Page.validateFilteredTableData(
        duplicateTenantName,
        'Tenant',
      );
    });

    await test.step('Click on duplicated Tenant URL -> login and Observe Logged In Screen', async () => {
      await scanVerifyV3Page.selectFilteredTableData('URL');
      await scanVerifyV3Page.successfulLogin(
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    /**
     * Actual Test Case on Scanning Application
     **/

    await test.step('Enter Valid Credentials and Click on Login Button', async () => {
      await scanVerifyV3Page.visitAppUrl();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${expo1ProtectedToken}`,
      orderId,
      duplicateTenantName,
    );

    expect(response.status()).toBe(200);

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(order);
    });

    await test.step('Press Enter Button and Navigate to Ready to Scan Page', async () => {
      await scanVerifyPage.pressEnterButton();
    });

    await test.step('Observe Ready to Scan Page', async () => {
      await scanVerifyPage.observeReadyToScanPage();
      await scanVerifyPage.clickOnRestartBtn();
      await scanVerifyPage.observeRestartPrompt();
      await page.waitForTimeout(3000);
      await scanVerifyPage.scanOrderId(order);
      await scanVerifyPage.pressEnterButton();
    });

    await test.step('Observe Ready to Scan Page', async () => {
      await scanVerifyPage.observeReadyToScanPage();
    });

    await test.step('Scan and Observe First Item with Sku: "E"', async () => {
      await scanVerifyV3Page.observeFirstItemSku();
    });

    await test.step('Scan and Observe Second Item with Sku: "A"', async () => {
      await scanVerifyV3Page.observeSecondItemSku();
    });

    await test.step('Scan and Observe Third Item with Sku: "G"', async () => {
      await scanVerifyV3Page.observeThirdItemSku();
      await scanVerifyV3Page.observeLogsContainer();
    });

    await test.step('Scan and Observe Fourth Item with Sku: "RT"', async () => {
      await scanVerifyV3Page.unscannedItemsLocationOrder();
      await scanVerifyV3Page.observeFourthItemSkuRT();
    });

    await test.step('Scan and Observe Last Item with Sku: "X"', async () => {
      await scanVerifyV3Page.observeLastItemSkuX();
    });

    await test.step('Verify Scan and Pass Page again after all Items Scanned and Re - Enter the Same Order for Scanning', async () => {
      await loginPage.verifyScanAndPassPage();
      await scanVerifyPage.scanOrderId(order);
      await scanVerifyPage.pressEnterButton();
      await scanVerifyPage.observeInvalidId(orderMsg);
      await scanVerifyV3Page.closeAlreadyScannedModal();
    });

    await test.step('Navigate to Standard Application and verify Order is Scanned Successfuly', async () => {
      await scanVerifyV3Page.navigateToStandarGPX(
        `https://${duplicateTenantName}.groovepacker.com`,
        order,
        'Status',
        'Scanned',
      );
    });

    await test.step('Login Using to Admin Tools Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await scanVerifyV3Page.conditionalLoginAdmin(
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
      await scanVerifyV3Page.searchTenantFromTable(`${duplicateTenantName}`);
      await scanVerifyV3Page.deleteDuplicateTenantAfterTestCase(
        `${duplicateTenantName}`,
      );
    });
  });
});
