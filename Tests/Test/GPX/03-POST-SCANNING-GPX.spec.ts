import { expect, test, Page } from '@playwright/test';
import { ScanVerifyV2Page } from '../../Pages/ScanVerifyV2';
import { ScanVerifyV3Page } from '../../Pages/ScanVerifyV3';
import { ScanVerifyPage } from '../../Pages/ScanVerify';
import { LoginPage } from '../../Pages/Login';
import { getOrderApi, updateOrderList } from '../../../Utils/updateApi';
import { generateUniqueID } from '../../../Utils/testUtils';
import data from '../../../Utils/data.json';

test.describe(`Page - GPX Post Scanning V2`, () => {
  let page: Page;
  const duplicateTenantName = `postscanning_gpx_${generateUniqueID(
    4,
  ).toLowerCase()}_playwright`;

  test.afterEach(async ({ page }) => {
    page = page;
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    await test.step('Login to Admin Tools Using Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await scanVerifyV3Page.conditionalLoginAdmin(
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
      await scanVerifyV3Page.searchTenantFromTable(`${duplicateTenantName}`);
      await scanVerifyV3Page.deleteDuplicateTenantAfterTestCase(
        `${duplicateTenantName}`,
      );
      await page.waitForTimeout(4000);
    });
    await page.close();
  });

  test.only('CC V2 - Test Case 01a - Serial Record with Post Scanning & Direct print - gpx-postscanning-01a', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderName = 'GCASE01A';
    const orderId = 348802;
    const orderMsg = 'The order has already been scanned.';

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `postscanningprotected`;

    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
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

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${data.tokens.postscangpx}`,
      orderId,
      `${duplicateTenantName}`,
    );
    const apiStatus = await getOrderApi(
      request,
      `${data.tokens.postscangpx}`,
      orderId,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

    await test.step('Test Case Preconditions for Order GCASE01A', async () => {
      await scanVerifyV2Page.preConditions01AOrder(page);
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });
    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
    });

    await test.step('Press Enter Button and Navigate to Ready to Scan Page', async () => {
      await scanVerifyPage.pressEnterButton();
    });

    await test.step('Observe Ready to Scan Page', async () => {
      await scanVerifyPage.observeReadyToScanPage();
    });

    await test.step('Enter valid "UPC" in "Ready For Product Scan" field and Press Enter', async () => {
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
    });
    const inputElement = page.getByTestId('inputElement').first();
    await expect(inputElement).toBeVisible();
    await inputElement.fill('9999');
    await page.keyboard.press('Enter');

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
      await scanVerifyPage.observeInvalidId(orderMsg);
    });
  });

  test('CC V2 - Test Case 01b - Type-in-count with Post Scanning & Direct print - gpx-postscanning-01b', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderName = 'GCASE01B';
    const orderId = 348803;
    const orderMsg = 'The order has already been scanned.';

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `postscanningprotected`;

    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
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

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${data.tokens.postscangpx}`,
      orderId,
      `${duplicateTenantName}`,
    );

    const apiStatus = await getOrderApi(
      request,
      `${data.tokens.postscangpx}`,
      orderId,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

    await test.step('Test Case Preconditions for Order GCASE01B', async () => {
      await scanVerifyV2Page.preConditions0BOrder(page);
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await page.reload();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });
    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });
    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
    });

    await test.step('Press Enter Button and Navigate to Ready to Scan Page', async () => {
      await scanVerifyPage.pressEnterButton();
    });

    await test.step('Observe Ready to Scan Page', async () => {
      await scanVerifyPage.observeReadyToScanPage();
    });

    await test.step('Enter valid "UPC" in "Ready For Product Scan" field and Press Enter', async () => {
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
      await scanVerifyPage.enterProductCount();
      await page.keyboard.press('Enter');
      const typeScanAlertContainer = page
        .getByTestId('typeScanAlertContainer')
        .first();
      await expect(typeScanAlertContainer).toBeVisible();

      const inputElement = page.getByTestId('inputElement').first();
      await expect(inputElement).toBeVisible();
      await inputElement.fill('22');
      await page.keyboard.press('Enter');
      const errorMsg = page
        .getByTestId('message')
        .filter({
          hasText:
            'The quantity entered exceeds the remaining number of pieces in the order. Please try again',
        })
        .first();
      await expect(errorMsg).toBeVisible();
      await inputElement.fill('9');
      await page.keyboard.press('Enter');
    });

    const shippingLbl = page
      .getByText(
        'Please create the shipping label, adhere it to the package, and scan the tracking number to continue.',
      )
      .first();
    await expect(shippingLbl).toBeVisible();
    const enterShippingLbl = page.getByPlaceholder('Scan').last();
    await expect(enterShippingLbl).toBeVisible();
    await enterShippingLbl.fill('411411');
    await page.keyboard.press('Enter');

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
      await scanVerifyPage.observeInvalidId(orderMsg);
    });

    await test.step('Verify Order is Scanned on order details page', async () => {
      await scanVerifyPage.observeSearchOrderPage(orderName);
      const orderStatus = page.getByTestId('orderStatusBtn').filter({
        hasText: 'Scanned',
      });
      expect(orderStatus).toBeTruthy();
      const orderInfo = page.getByTestId('showInformation').first();
      await expect(orderInfo).toBeVisible();
      await orderInfo.click();

      const verifyTrackingNum = page.getByTestId('trackingNumber').first();
      await expect(verifyTrackingNum).toBeVisible();
      await page.waitForTimeout(2000);
      const trackingNum = await verifyTrackingNum.inputValue();
      await expect(trackingNum).toEqual('411411');
    });
  });

  test('CC V2 - Test Case 02a - Create label Direct Print after ShipStation order - gpx-postscanning-02a', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderName = 'GCASE02A';
    const orderId = 348856;

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `postscanningprotected`;

    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
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

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${data.tokens.postscanprotected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    const apiStatus = await getOrderApi(
      request,
      `${data.tokens.postscanprotected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

    await test.step('Test Case Preconditions for Order GCASE02A', async () => {
      await scanVerifyV2Page.preConditions02aOrder(page);
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await page.reload();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });
    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
    });

    await test.step('Press Enter Button and Navigate to Ready to Scan Page', async () => {
      await scanVerifyPage.pressEnterButton();
    });

    await test.step('Observe Ready to Scan Page', async () => {
      await scanVerifyPage.observeReadyToScanPage();
    });

    await test.step('Enter valid "UPC" in "Ready For Product Scan" field and Press Enter', async () => {
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
    });

    await test.step('Verify Order is Scanned on order details page', async () => {
      await scanVerifyPage.observeSearchOrderPage(orderName);
      const orderStatus = page.getByTestId('orderStatusBtn').filter({
        hasText: 'Scanned',
      });
      expect(orderStatus).toBeTruthy();
    });
  });

  test('CC V2 - Test Case 02b - Create label Browser Print after ShipStation order - gpx-postscanning-02b', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderName = 'GCASE02B';
    const orderId = 348858;

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `postscanningprotected`;

    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
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

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${data.tokens.postscanprotected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    const apiStatus = await getOrderApi(
      request,
      `${data.tokens.postscanprotected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

    await test.step('Test Case Preconditions for Order GCASE02B', async () => {
      await scanVerifyV2Page.preConditions02bOrder(page);
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await page.reload();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
    });

    await test.step('Press Enter Button and Navigate to Ready to Scan Page', async () => {
      await scanVerifyPage.pressEnterButton();
    });

    await test.step('Observe Ready to Scan Page', async () => {
      await scanVerifyPage.observeReadyToScanPage();
    });
    await test.step('Enter valid "UPC" in "Ready For Product Scan" field and Press Enter', async () => {
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
    });

    await test.step('Verify Order is Scanned on order details page', async () => {
      await scanVerifyPage.observeSearchOrderPage(orderName);
      const orderStatus = page.getByTestId('orderStatusBtn').filter({
        hasText: 'Scanned',
      });
      expect(orderStatus).toBeTruthy();
    });
  });

  test('CC V2 - Test case 04 - Print packing slip & record tracking - gpx-postscanning-04', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderName = 'GCASE04';
    const orderId = 348809;
    const trackingNum = orderName + 'Tracking';

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `postscanningprotected`;

    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
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

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${data.tokens.postscangpx}`,
      orderId,
      `${duplicateTenantName}`,
    );

    const apiStatus = await getOrderApi(
      request,
      `${data.tokens.postscangpx}`,
      orderId,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

    await test.step('Test Case Preconditions for Order GCASE04', async () => {
      await scanVerifyV2Page.preConditions04Order(page);
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await page.reload();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });
    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });
    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
    });

    await test.step('Press Enter Button and Navigate to Ready to Scan Page', async () => {
      await scanVerifyPage.pressEnterButton();
    });

    await test.step('Observe Ready to Scan Page', async () => {
      await scanVerifyPage.observeReadyToScanPage();
    });

    await test.step('Enter valid "UPC" in "Ready For Product Scan" field and Press Enter', async () => {
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
    });

    const shippingLbl = page
      .getByText(
        'Please create the shipping label, adhere it to the package, and scan the tracking number to continue.',
      )
      .first();
    await expect(shippingLbl).toBeVisible();
    const enterShippingLbl = page.getByPlaceholder('Scan').last();
    await expect(enterShippingLbl).toBeVisible();
    await enterShippingLbl.fill(trackingNum);
    await page.keyboard.press('Enter');

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
    });

    await test.step('Verify Order is Scanned on order details page', async () => {
      await scanVerifyPage.observeSearchOrderPage(orderName);
      const orderStatus = page.getByTestId('orderStatusBtn').filter({
        hasText: 'Scanned',
      });
      expect(orderStatus).toBeTruthy();
      const orderInfo = page.getByTestId('showInformation').first();
      await expect(orderInfo).toBeVisible();
      await orderInfo.click();

      const verifyTrackingNum = page.getByTestId('trackingNumber').first();
      await expect(verifyTrackingNum).toBeVisible();
      const trackingNum = await verifyTrackingNum.inputValue();
      await expect(trackingNum).toEqual(trackingNum);
    });
  });

  test('CC V2- Test case 05a - Verify shipping label success - gpx-postscanning-05a', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderName = 'GCASE05A';
    const orderId = 348810;
    const trackingNum = 'GCASE5555';

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `postscanningprotected`;

    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
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

    const response = await updateOrderList(
      request,
      `${data.tokens.postscangpx}`,
      orderId,
      `${duplicateTenantName}`,
    );

    const apiStatus = await getOrderApi(
      request,
      `${data.tokens.postscangpx}`,
      orderId,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

    await test.step('Test Case Preconditions for Order GCASE05A', async () => {
      await scanVerifyV2Page.preConditions05aOrder(page);
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await page.reload();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });
    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });
    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
    });
    await test.step('Press Enter Button and Navigate to Ready to Scan Page', async () => {
      await scanVerifyPage.pressEnterButton();
    });
    await test.step('Observe Ready to Scan Page', async () => {
      await scanVerifyPage.observeReadyToScanPage();
    });

    await test.step('Enter valid "UPC" in "Ready For Product Scan" field and Press Enter', async () => {
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
    });

    const shippingLbl = page
      .getByText('Please scan the shipping label barcode to continue.')
      .first();
    await expect(shippingLbl).toBeVisible();
    const enterShippingLbl = page.getByPlaceholder('Scan').last();
    await expect(enterShippingLbl).toBeVisible();
    await enterShippingLbl.fill(trackingNum);
    await page.keyboard.press('Enter');
    await page.reload();
    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
    });

    await test.step('Verify Order is Scanned on order details page', async () => {
      await scanVerifyPage.observeSearchOrderPage(orderName);
      const orderStatus = page.getByTestId('orderStatusBtn').filter({
        hasText: 'Scanned',
      });
      expect(orderStatus).toBeTruthy();
      const orderInfo = page.getByTestId('showInformation').first();
      await expect(orderInfo).toBeVisible();
      await orderInfo.click();

      const verifyTrackingNum = page.getByTestId('trackingNumber').first();
      await expect(verifyTrackingNum).toBeVisible();
      const trackingNum = await verifyTrackingNum.inputValue();
      await expect(trackingNum).toEqual(trackingNum);
    });
  });

  test('CC V2- Test case 05b - Verify shipping label failure - gpx-postscanning-05b', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderName = 'GCASE05B';
    const orderId = 348811;
    const trackingNum = 'GCASE5555B';

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `postscanningprotected`;

    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
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

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${data.tokens.postscanprotected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    const apiStatus = await getOrderApi(
      request,
      `${data.tokens.postscanprotected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

    await test.step('Test Case Preconditions for Order GCASE05B', async () => {
      await scanVerifyV2Page.preConditions05bOrder(page);
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await page.reload();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
    });

    await test.step('Press Enter Button and Navigate to Ready to Scan Page', async () => {
      await scanVerifyPage.pressEnterButton();
    });

    await test.step('Observe Ready to Scan Page', async () => {
      await scanVerifyPage.observeReadyToScanPage();
    });

    await test.step('Enter valid "UPC" in "Ready For Product Scan" field and Press Enter', async () => {
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
    });

    const shippingLbl = page
      .getByText('Please scan the shipping label barcode to continue.')
      .first();
    await expect(shippingLbl).toBeVisible();
    const enterShippingLbl = page.getByPlaceholder('Scan').last();
    await expect(enterShippingLbl).toBeVisible();
    await page.keyboard.press('Enter');

    await enterShippingLbl.fill(trackingNum);
    await page.keyboard.press('Enter');
    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await page.reload();
    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
    });

    await test.step('Verify Order is Scanned on order details page', async () => {
      await scanVerifyPage.observeSearchOrderPage(orderName);
      const orderStatus = page.getByTestId('orderStatusBtn').filter({
        hasText: 'Scanned',
      });
      expect(orderStatus).toBeTruthy();
      const orderInfo = page.getByTestId('showInformation').first();
      await expect(orderInfo).toBeVisible();
      await orderInfo.click();

      const verifyTrackingNum = page.getByTestId('trackingNumber').first();
      await expect(verifyTrackingNum).toBeVisible();
      const trackingNum = await verifyTrackingNum.inputValue();
      await expect(trackingNum).toEqual(trackingNum);
    });
  });

  test('CC V2- Test case 06 - Tracking Recording with Validation - gpx-postscanning-06', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderName = 'GCASE06';
    const orderId = 348812;
    const trackingNum = '123-GCASE06';

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `postscanningprotected`;

    await test.step('Login Using Valid Credentials', async () => {
      await scanVerifyV3Page.visit();
      await page.reload();
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

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${data.tokens.postscanprotected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    const apiStatus = await getOrderApi(
      request,
      `${data.tokens.postscanprotected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

    await test.step('Test Case Preconditions for Order GCASE06', async () => {
      await scanVerifyV2Page.preConditions06Order(page);
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await page.reload();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });
    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });
    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
    });

    await test.step('Press Enter Button and Navigate to Ready to Scan Page', async () => {
      await scanVerifyPage.pressEnterButton();
    });

    await test.step('Observe Ready to Scan Page', async () => {
      await scanVerifyPage.observeReadyToScanPage();
    });

    await test.step('Enter valid "UPC" in "Ready For Product Scan" field and Press Enter', async () => {
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
    });

    const shippingLbl = page
      .getByText(
        'Please create the shipping label, adhere it to the package, and scan the tracking number to continue.',
      )
      .first();
    await expect(shippingLbl).toBeVisible();
    const enterShippingLbl = page.getByPlaceholder('Scan').last();
    await expect(enterShippingLbl).toBeVisible();
    await enterShippingLbl.fill(trackingNum);
    await page.keyboard.press('Enter');

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderName);
    });

    await test.step('Verify Order is Scanned on order details page', async () => {
      await scanVerifyPage.observeSearchOrderPage(orderName);
      const orderStatus = page.getByTestId('orderStatusBtn').filter({
        hasText: 'Scanned',
      });
      expect(orderStatus).toBeTruthy();
    });
  });
});
