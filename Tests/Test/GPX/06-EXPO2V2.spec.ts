import { expect, test, Page } from '@playwright/test';
import { ScanVerifyV3Page } from '../../Pages/ScanVerifyV3';
import { ScanVerifyPage } from '../../Pages/ScanVerify';
import { LoginPage } from '../../Pages/Login';
import { getOrderApi, updateOrderList } from '../../../Utils/updateApi';
import { generateUniqueID } from '../../../Utils/testUtils';
import { Expo2V2Functions } from '../../Pages/EXPO2V2';
import { tokens } from '../../../Utils/data.json';

test.describe(`Page - GPX Expo2 V2`, () => {
  const duplicateTenantName = `expo2v2${generateUniqueID(
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
    });
    await page.close();
  });

  test('Part A - Expo2V2 - expo2v2-01', async ({ page, request }) => {
    const orderId = 14;
    const orderName = 'EX2-SH-LABEL';
    const loginPage = new LoginPage(page);
    const scanVerifyPage = new ScanVerifyPage(page);
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const expo2v2Functions = new Expo2V2Functions(page);
    const tenantName = `expo2protected`;

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
    // Api to update product status
    const response = await updateOrderList(
      request,
      `${tokens.expo2Protected}`,
      orderId,
      `${duplicateTenantName}`,
    );
    const apiStatus = await getOrderApi(
      request,
      `${tokens.expo2Protected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');
    const tracking_number = await apiStatus.tracking_num;
    const prefix = '10000001';

    await test.step('Test Case Preconditions for "Expo 2 V2 -> Part A"', async () => {
      await expo2v2Functions.expo2V2PreConditionsPartA(page);
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

    await test.step('001 Cue with tracking number without prefix & RESTART barcode', async () => {
      await scanVerifyPage.scanOrderId(tracking_number);
      await scanVerifyPage.pressEnterButton();
      await expo2v2Functions.verifyOrderName(orderName);
      await expo2v2Functions.observeSku('MAGIC');
      await scanVerifyPage.clickOnRestartBtn();
      await scanVerifyPage.observeRestartPrompt();
      await scanVerifyPage.scanOrderId(prefix + tracking_number);
      await scanVerifyPage.pressEnterButton();
      await expo2v2Functions.clickOnOrderName(orderName);
    });

    await test.step('Observe Ready to Scan Page', async () => {
      await expo2v2Functions.expo2v2PartA(page);
      const clickOnImg = page
        .locator('div')
        .filter({ hasText: 'APPLE MAGIC' })
        .filter({ has: page.locator('img') })
        .last()
        .locator('img');
      await expect(clickOnImg).toBeVisible();
      await page.waitForTimeout(1000);
      await clickOnImg.click();
      await page.waitForTimeout(3000);

      const firstItem = page.getByTestId('itemName').first();
      await expect(firstItem).toBeVisible();
      // expect(await firstItem.innerText()).toEqual('APPLE MAGIC');

      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');

      await page.waitForTimeout(2500);
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);

      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);

      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);

      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2500);
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);
      await expo2v2Functions.enterProductBatchNumber(page, 'random');

      const shippingLbl = page
        .getByText(
          'Please create the shipping label, adhere it to the package, and scan the tracking number to continue.',
        )
        .first();
      await expect(shippingLbl).toBeVisible();
      const enterShippingLbl = page.getByPlaceholder('Scan').last();
      await expect(enterShippingLbl).toBeVisible();
      await enterShippingLbl.fill(tracking_number);
      await page.keyboard.press('Enter');

      await scanVerifyPage.scanOrderId(orderName);
      await page.keyboard.press('Enter');
      const orderMsg = 'The order has already been scanned.';
      await scanVerifyPage.observeInvalidId(orderMsg);
      await page.waitForTimeout(2000);
      const reScanOrder = page.getByTestId('Redirect-to-another').last();
      await expect(reScanOrder).toBeVisible();
      await reScanOrder.click();

      await page.waitForTimeout(2000);
      const previousItemsScan = page.getByTestId('await-btn').last();
      await expect(previousItemsScan).toBeVisible();
      await previousItemsScan.click();

      await page.waitForTimeout(2000);
      await expo2v2Functions.clickOnOrderName(orderName);

      const orderInfoTab = page.getByTestId('showInformation').last();
      await expect(orderInfoTab).toBeVisible();
      await orderInfoTab.click();

      const trackingNumber = page.getByTestId('trackingNumber').first();
      await expect(trackingNumber).toBeVisible();
      expect(await trackingNumber.inputValue()).toEqual(tracking_number);

      const showActivities = page.getByTestId('showActivities').last();
      await expect(showActivities).toBeVisible();
      await showActivities.click();

      const lastActivity = page.getByText('ORANGE-J scanned -by').first();
      await expect(lastActivity).toBeVisible();
    });
  });

  test('Part B - Expo2V2 - expo2v2-02', async ({ page, request }) => {
    const expo2v2Functions = new Expo2V2Functions(page);
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderName = 'EX-REC-VALID';
    const orderId = 17;
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `expo2protected`;
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

    await test.step('Test Case Preconditions for "Part B"', async () => {
      await expo2v2Functions.preConditionsPartB(page);
    });
    // Api to update product status
    const response = await updateOrderList(
      request,
      `${tokens.expo2Protected}`,
      orderId,
      `${duplicateTenantName}`,
    );
    const apiStatus = await getOrderApi(
      request,
      `${tokens.expo2Protected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');
    const tracking_number = await apiStatus.tracking_num;
    const prefix = 'VALID';

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

    await test.step('001 Cue with tracking number without prefix & RESTART barcode', async () => {
      await scanVerifyPage.scanOrderId('I-GET-OVERWRITTEN');
      await scanVerifyPage.pressEnterButton();
      await expo2v2Functions.verifyOrderName(orderName);
      await expo2v2Functions.enterProductUPCManually('SCANNED');
      await scanVerifyPage.pressEnterButton();
    });

    const shippingLbl = page
      .getByText(
        'Please create the shipping label, adhere it to the package, and scan the tracking number to continue.',
      )
      .first();

    await expect(shippingLbl).toBeVisible();
    const enterShippingLbl = page.getByPlaceholder('Scan').last();
    await expect(enterShippingLbl).toBeVisible();
    await enterShippingLbl.fill(tracking_number);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
    const closeModal = page.getByTestId('cancelIcon').first();
    await expect(closeModal).toBeVisible();
    await closeModal.click();
    await page.waitForTimeout(1200);

    await expect(shippingLbl).toBeVisible();
    await expect(enterShippingLbl).toBeVisible();
    await enterShippingLbl.fill(prefix + '-' + tracking_number);
    await page.keyboard.press('Enter');
    await scanVerifyPage.scanOrderId(orderName);
    await page.keyboard.press('Enter');
    const orderMsg = 'The order has already been scanned.';
    await scanVerifyPage.observeInvalidId(orderMsg);

    const reScanOrder = page.getByTestId('Redirect-to-another').last();
    await expect(reScanOrder).toBeVisible();
    await reScanOrder.click();
    await page.waitForTimeout(3000);
    const previousItemsScan = page.getByTestId('await-btn').last();
    await expect(previousItemsScan).toBeVisible();
    await previousItemsScan.click();
    await page.waitForTimeout(3000);

    await expo2v2Functions.clickOnOrderName(orderName);

    const orderInfoTab = page.getByTestId('showInformation').last();
    await expect(orderInfoTab).toBeVisible();
    await orderInfoTab.click();

    const trackingNumber = page.getByTestId('trackingNumber').first();
    await expect(trackingNumber).toBeVisible();
    expect(await trackingNumber.inputValue()).toEqual(
      prefix + '-' + tracking_number,
    );
  });

  test('Part C - Expo2V2 - expo2v2-03', async ({ page, request }) => {
    const expo2v2Functions = new Expo2V2Functions(page);
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderName = '727657875';
    const orderId = 12;
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `expo2protected`;

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

    await test.step('Test Case Preconditions for "Part C"', async () => {
      await expo2v2Functions.preConditionsPartC(page);
    });
    // Api to update product status
    const response = await updateOrderList(
      request,
      `${tokens.expo2Protected}`,
      orderId,
      `${duplicateTenantName}`,
    );
    const apiStatus = await getOrderApi(
      request,
      `${tokens.expo2Protected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
      await scanVerifyPage.scanOrderId(orderName);
      await page.keyboard.press('Enter');
    });

    await test.step('Restart Order and Observe the Screen', async () => {
      await scanVerifyPage.clickOnRestartBtn();
      await expo2v2Functions.restartOrder();
      await page.waitForTimeout(2000);
    });

    await test.step('001 Cue with tracking number without prefix', async () => {
      await expo2v2Functions.expo2V2PartCStep1('^#^2B5F2D93^', orderName);
    });

    await test.step('Scan Part C -> 001 Order', async () => {
      await scanVerifyPage.clickOnRestartBtn();
      await expo2v2Functions.restartOrder();
      await page.waitForTimeout(2000);
    });

    await test.step('Scan Complete Part C -> 002 Order', async () => {
      await expo2v2Functions.expo2V2PartCStep2(orderName);
      await expo2v2Functions.expo2V2PartCStep3(orderName);
    });
  });

  test('Part D - Expo2V2 - expo2v2-04', async ({ page, request }) => {
    const expo2v2Functions = new Expo2V2Functions(page);
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderName1 = 'EX-VERIFY';
    const orderName2 = 'EX-VERIFY2';
    const order1Id = 13;
    const order2Id = 9;
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `expo2protected`;

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

    await test.step('Test Case Preconditions for "Part D"', async () => {
      await expo2v2Functions.preConditionsPartD(page);
    });
    // Api to update product status
    const response = await updateOrderList(
      request,
      `${tokens.expo2Protected}`,
      order1Id,
      `${duplicateTenantName}`,
    );
    const apiStatus = await getOrderApi(
      request,
      `${tokens.expo2Protected}`,
      order1Id,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');
    // Order xverify2
    const order2Response = await updateOrderList(
      request,
      `${tokens.expo2Protected}`,
      order2Id,
      `${duplicateTenantName}`,
    );
    const Order2ApiStatus = await getOrderApi(
      request,
      `${tokens.expo2Protected}`,
      order2Id,
      `${duplicateTenantName}`,
    );

    expect(order2Response.status()).toBe(200);
    expect(Order2ApiStatus.status).toBe('awaiting');

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    await test.step('Scan Order and add shipping label', async () => {
      await expo2v2Functions.expo2V2PartDStep1(orderName1, orderName2);
    });

    await test.step('Click on product name and observe the product details page', async () => {
      await scanVerifyPage.clickOnSpecificProduct();
      await scanVerifyPage.observeProductDetailsPage();
    });

    await test.step('Click on "+" icon of Barcode and Enter Unique Barcode', async () => {
      await scanVerifyPage.clickOnBarcodeAndObservePopup('TADA');
      await scanVerifyPage.observeAddedBarcode('TADA');
      await page.getByTestId('saveAndCloseButton').first().click();
    });
    await test.step('Scan order again after adding new barcode "TADA"', async () => {
      await expo2v2Functions.expo2V2PartDStep2(orderName2);
    });
  });

  test('Part E - Expo2V2 - expo2v2-05', async ({ page, request }) => {
    const expo2v2Functions = new Expo2V2Functions(page);
    const loginPage = new LoginPage(page);
    const orderName = '1SERIOUSAPPLELOVER';
    const orderId = 6;
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `expo2protected`;

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

    await test.step('Test Case Preconditions for "Part E"', async () => {
      await expo2v2Functions.preConditionsPartE(page);
    });
    // Api to update product status
    const response = await updateOrderList(
      request,
      `${tokens.expo2Protected}`,
      orderId,
      `${duplicateTenantName}`,
    );
    const apiStatus = await getOrderApi(
      request,
      `${tokens.expo2Protected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    await test.step('Scan Order "" with Complete Part-E steps', async () => {
      await expo2v2Functions.expo2V2PartEStep1(orderName);
    });
    await test.step('Navigate to Standard Application and verify Order is Scanned Successfuly', async () => {
      await scanVerifyV3Page.navigateToStandarGPX(
        `https://${duplicateTenantName}.groovepacker.com`,
        'EX-KIT-SC02',
        'Status',
        'Scanned',
      );
      await expo2v2Functions.expo2V2PartEVerifyOrderLegacyApp();
    });
  });

  test('Part F - Expo2V2 - expo2v2-06', async ({ page, request }) => {
    const expo2v2Functions = new Expo2V2Functions(page);
    const loginPage = new LoginPage(page);
    const orderName = 'EX-APPLELOVER';
    const orderId = 7;
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `expo2protected`;

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

    await test.step('Test Case Preconditions for "Part E"', async () => {
      await expo2v2Functions.preConditionsPartE(page);
    });
    // Api to update product status
    const response = await updateOrderList(
      request,
      `${tokens.expo2Protected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    const apiStatus = await getOrderApi(
      request,
      `${tokens.expo2Protected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await expo2v2Functions.expo2V2PartFScanning(orderName);
    });

    await test.step('Navigate to Standard Application and verify Order is Scanned Successfuly', async () => {
      await scanVerifyV3Page.navigateToStandarGPX(
        `https://${duplicateTenantName}.groovepacker.com`,
        orderName,
        'Status',
        'Scanned',
      );
    });
  });

  test('Part G-E-F-G - Expo2V2 - expo2v2-07', async ({ page, request }) => {
    const expo2v2Functions = new Expo2V2Functions(page);
    const loginPage = new LoginPage(page);
    const orderName = 'EX-KIT-SC03';
    const orderId = 10;
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `expo2protected`;

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

    await test.step('Test Case Preconditions for "Part E"', async () => {
      await expo2v2Functions.preConditionsPartE(page);
    });
    // Api to update product status
    const response = await updateOrderList(
      request,
      `${tokens.expo2Protected}`,
      orderId,
      `${duplicateTenantName}`,
    );
    const apiStatus = await getOrderApi(
      request,
      `${tokens.expo2Protected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    await test.step('Restart Order and Scan all Products', async () => {
      await expo2v2Functions.expo2V2PartGScanning(orderName);
    });
    await test.step('Observe Inventory Products', async () => {
      await expo2v2Functions.InventoryProductsVerify();
    });

    await test.step('Navigate to Standard Application and verify Order is Scanned Successfuly', async () => {
      await scanVerifyV3Page.navigateToStandarGPX(
        `https://${duplicateTenantName}.groovepacker.com`,
        orderName,
        'Status',
        'Scanned',
      );
    });
  });

  test('Part J - Expo2V2 - expo2v2-08', async ({ page, request }) => {
    const expo2v2Functions = new Expo2V2Functions(page);
    const loginPage = new LoginPage(page);
    const orderName = 'EX-NOTES';
    const orderId = 15;
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `expo2protected`;

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

    await test.step('Test Case Preconditions for "Part J"', async () => {
      await expo2v2Functions.preConditionsPartJ(page);
    });
    // Api to update product status
    const response = await updateOrderList(
      request,
      `${tokens.expo2Protected}`,
      orderId,
      `${duplicateTenantName}`,
    );
    const apiStatus = await getOrderApi(
      request,
      `${tokens.expo2Protected}`,
      orderId,
      `${duplicateTenantName}`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');
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
    await test.step('Verify Notes, Add Notes to Packager Remove Notes and Scan Order', async () => {
      await expo2v2Functions.expo2V2NotesVerify(orderName);
    });
  });
});
