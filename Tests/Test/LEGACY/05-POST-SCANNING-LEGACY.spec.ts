import { expect, test, Page } from '@playwright/test';
import { ScanVerifyV2Page } from '../../Pages/ScanVerifyV2';
import { ScanVerifyV3Page } from '../../Pages/ScanVerifyV3';
import { getOrderApi, updateOrderList } from '../../../Utils/updateApi';
import { generateUniqueID } from '../../../Utils/testUtils';
test.describe(`Page - EXPO1 - V2`, () => {
  let page: Page;
  const duplicateTenantName = `postscanning_legacy_${generateUniqueID(
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

  test('V2- Test Case 01a - Serial Record with Post Scanning & Direct print - legacy_01a', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const orderName = 'LCASE01A';
    const orderId = 348778;

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `postscanningprotected`;

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
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );
    const apiStatus = await getOrderApi(
      request,
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

    await test.step('Test Case Preconditions for Order LCASE01A', async () => {
      await scanVerifyV2Page.preConditions01AOrder(page);
    });
    await test.step('Search Order from Table and Click On It', async () => {
      await scanVerifyV3Page.searchTenantFromTable(orderName);
      await scanVerifyV2Page.openOrderInScanPackOptions(orderName);
      await scanVerifyV2Page.observeOrderInScanPackOptions(page);
    });

    await test.step('Enter Product Barcode and Scan the Order', async () => {
      await scanVerifyV2Page.enterProductBarcode(page, orderName);
      await scanVerifyV2Page.enterProductSerialNumber(
        page,
        orderName + 'serial',
      );
    });

    await test.step('Enter Product Tracking Number after Scanning', async () => {
      await page.reload();
      await page.waitForTimeout(3000);
      await scanVerifyV2Page.enterTrackingNumber(page, 'DUHD');
    });

    await test.step('Verify Order is Scanned with valid Tracking ID', async () => {
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV3Page.validateFilteredTableData('Scanned', 'Status');
      await scanVerifyV3Page.validateFilteredTableData('DUHD', 'Tracking Id');
    });
  });

  test('V2- Test Case 01b - Type-in-count with Post Scanning & Direct print - legacy_01b', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const orderName = 'LCASE01B';
    const orderId = 348782;
    const trackingNum = orderName + 'Tracking';
    const tenantName = `postscanningprotected`;

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
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );
    const apiStatus = await getOrderApi(
      request,
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

    await test.step('Test Case Preconditions for Order LCASE01B', async () => {
      await scanVerifyV2Page.preConditions0BOrder(page);
    });

    await test.step('Search Order from Table and Click On It', async () => {
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV2Page.openOrderInScanPackOptions(orderName);
    });

    await test.step('Click On Order to Scan one Product', async () => {
      await scanVerifyV2Page.clickOnOrderToScanOnce(page, orderName);
    });

    await test.step('Verify Order is Scanned with "*" -> 10 counts', async () => {
      await scanVerifyV2Page.enterNumberOfProductsToScan(page);
      await scanVerifyV2Page.productsCountPopup(page, orderName);
    });

    await test.step('Enter Product Tracking Number after Scanning', async () => {
      await page.reload();
      await page.waitForTimeout(3000);
      await scanVerifyV2Page.enterTrackingNumber(page, trackingNum);
    });

    await test.step('Verify Order is Scanned with valid Tracking ID', async () => {
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV3Page.validateFilteredTableData('Scanned', 'Status');
      await scanVerifyV3Page.validateFilteredTableData(
        trackingNum,
        'Tracking Id',
      );
    });
  });

  test('V2- Test Case 02a - Create label Direct Print after ShipStation order - legacy_02a', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const orderName = 'LCASE02A';
    const orderId = 348816;
    const tenantName = `postscanningprotected`;

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
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );
    const apiStatus = await getOrderApi(
      request,
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');
    await test.step('Test Case Preconditions for Order LCASE02A', async () => {
      await scanVerifyV2Page.preConditions02aOrder(page);
    });
    await test.step('Search Order from Table and Click On It', async () => {
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV2Page.openOrderInScanPackOptions(orderName);
    });
    await test.step('Click On Order to Scan Products', async () => {
      await scanVerifyV2Page.clickOnOrderToScanOnce(page, 'LCASE02A.1');
      await scanVerifyV2Page.clickOnOrderToScanOnce(page, 'LCASE02A.2');
    });

    await test.step('Verify Order is Scanned with valid Tracking ID', async () => {
      // await scanVerifyV2Page.printOrderPage(page);
      await page.waitForTimeout(2000);
      await scanVerifyV2Page.navigateToNavbar(page, ' Orders');
      await scanVerifyV2Page.navigateToNavbar(page, ' Orders');
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV3Page.validateFilteredTableData('Scanned', 'Status');
    });
  });

  test('V2- Test Case 02b - Create label Browser Print after ShipStation order - legacy_02b', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const orderName = 'LCASE02B';
    const orderId = 348857;
    const tenantName = `postscanningprotected`;

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
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );
    const apiStatus = await getOrderApi(
      request,
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');
    await test.step('Test Case Preconditions for Order LCASE02B', async () => {
      await scanVerifyV2Page.preConditions02bOrder(page);
    });

    await test.step('Search Order from Table and Click On It', async () => {
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV2Page.openOrderInScanPackOptions(orderName);
    });
    await test.step('Click On Order to Scan Products', async () => {
      await scanVerifyV2Page.clickOnOrderToScanOnce(page, 'LCASE02B');
      await scanVerifyV2Page.clickOnOrderToScanOnce(page, 'LCASE02B.1');
    });

    await test.step('Verify Order is Scanned with valid Tracking ID', async () => {
      // await scanVerifyV2Page.printOrderPage(page);
      await page.waitForTimeout(2000);
      await scanVerifyV2Page.navigateToNavbar(page, ' Orders');
      await scanVerifyV2Page.navigateToNavbar(page, ' Orders');
      await page.waitForTimeout(2000);
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV3Page.validateFilteredTableData('Scanned', 'Status');
    });
  });

  test('V2- Test case 04 - Print packing slip & record tracking - legacy_04', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const orderName = 'LCASE04';
    const orderId = 348777;
    const trackingNum = orderName + 'Tracking';
    const tenantName = `postscanningprotected`;

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
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );
    const apiStatus = await getOrderApi(
      request,
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );

    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');
    await test.step('Test Case Preconditions for Order LCASE04', async () => {
      await scanVerifyV2Page.preConditions04Order(page);
    });

    await test.step('Search Order from Table and Click On It', async () => {
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV2Page.openOrderInScanPackOptions(orderName);
    });

    await test.step('Click On Order to Scan Products', async () => {
      await scanVerifyV2Page.clickOnOrderToScanOnce(page, 'LCASE04.0');
      await scanVerifyV2Page.clickOnOrderToScanOnce(page, 'LCASE04.1');
    });

    await test.step('Navigate to RFO and observe Order again', async () => {
      await scanVerifyV2Page.clickOnOrdersAndNavigateBackToOrder(
        page,
        orderName,
      );
    });

    await test.step('Enter Order Tracking Number after Scanning', async () => {
      await page.reload();
      await page.waitForTimeout(3000);
      await scanVerifyV2Page.enterTrackingNumber(page, trackingNum);
    });

    await test.step('Verify Order is Scanned with valid Tracking ID', async () => {
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV3Page.validateFilteredTableData('Scanned', 'Status');
      await scanVerifyV3Page.validateFilteredTableData(
        trackingNum,
        'Tracking Id',
      );
    });
  });

  test('V2- Test case 05a - Verify shipping label success - legacy_05a', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const orderName = 'LCASE05A';
    const orderId = 348783;
    const trackingNum = 'LCASE5555';
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `postscanningprotected`;

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
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );

    const apiStatus = await getOrderApi(
      request,
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

    await test.step('Test Case Preconditions for Order LCASE05A', async () => {
      await scanVerifyV2Page.preConditions05aOrder(page);
    });

    await test.step('Search Order from Table and Click On It', async () => {
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV2Page.openOrderInScanPackOptions(orderName);
    });

    await test.step('Click On Order to Scan Products', async () => {
      await scanVerifyV2Page.clickOnOrderToScanOnce(page, 'LCASE05A.0');
      await scanVerifyV2Page.clickOnOrderToScanOnce(page, 'LCASE05A.1');
    });

    await test.step('Navigate to RFO and observe Order again', async () => {
      await scanVerifyV2Page.clickOnOrdersAndNavigateBackToOrder(
        page,
        orderName,
      );
    });

    await test.step('Enter Order Tracking Number after Scanning', async () => {
      await page.reload();
      await page.waitForTimeout(3000);
      await scanVerifyV2Page.enterProductTrackingNumber(page, trackingNum);
    });

    await test.step('Verify Order is Scanned with valid Tracking ID', async () => {
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV3Page.validateFilteredTableData('Scanned', 'Status');
      await scanVerifyV3Page.validateFilteredTableData(
        trackingNum,
        'Tracking Id',
      );
    });
  });

  test('V2- Test case 05b - Verify shipping label failure - legacy_05b', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const orderName = 'LCASE05B';
    const orderId = 348793;
    const trackingNum = 'LCASE5555B';
    const tenantName = `postscanningprotected`;

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
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );

    const apiStatus = await getOrderApi(
      request,
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

    await test.step('Test Case Preconditions for Order LCASE05B', async () => {
      await scanVerifyV2Page.preConditions05bOrder(page);
    });

    await test.step('Search Order from Table and Click On It', async () => {
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV2Page.openOrderInScanPackOptions(orderName);
    });

    await test.step('Click On Order to Scan Products', async () => {
      await scanVerifyV2Page.clickOnOrderToScanOnce(page, 'LCASE05B.0');
      await scanVerifyV2Page.clickOnOrderToScanOnce(page, 'LCASE05B.1');
    });

    await test.step('Navigate to RFO and observe Order again', async () => {
      await scanVerifyV2Page.clickOnOrdersAndNavigateBackToOrder(
        page,
        orderName,
      );
    });

    await test.step('Enter Order Tracking Number after Scanning', async () => {
      await page.reload();
      await page.waitForTimeout(3000);
      await scanVerifyV2Page.enterShippingLabel5B(page);
    });

    await test.step('Verify Order is Scanned with valid Tracking ID', async () => {
      await scanVerifyV2Page.navigateToNavbar(page, ' Orders');
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV3Page.validateFilteredTableData('Scanned', 'Status');
      await scanVerifyV3Page.validateFilteredTableData(
        trackingNum,
        'Tracking Id',
      );
    });
  });

  test('V2- Test case 06 - Tracking Recording without Validation - legacy_06', async ({
    page,
    request,
  }) => {
    const scanVerifyV2Page = new ScanVerifyV2Page(page);
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const orderName = 'LCASE06';
    const orderId = 348794;
    const invalidTrackingNum = 'LCASE06';
    const trackingNum = 'PREFIX-LCASE06';
    const tenantName = `postscanningprotected`;

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
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );

    const apiStatus = await getOrderApi(
      request,
      `c3fb6d9d66f0c9ff801ad4a7538702ae85e395b70d15cc7f74e969335d1bd329`,
      orderId,
      `postscanningprotected`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

    await test.step('Test Case Preconditions for Order LCASE06', async () => {
      await scanVerifyV2Page.preConditions06Order(page);
    });
    await test.step('Search Order from Table and Click On It', async () => {
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV2Page.openOrderInScanPackOptions(orderName);
    });

    await test.step('Click On Order to Scan Products', async () => {
      await scanVerifyV2Page.clickOnOrderToScanOnce(page, 'LCASE06.1');
      await scanVerifyV2Page.enterNumberOfProductsToScan(page);
      await scanVerifyV2Page.productsCountPopup(page, 'LCASE06.1');
      await scanVerifyV2Page.clickOnOrderToScanOnce(page, 'LCASE06.0');
    });
    await test.step('Navigate to RFO and observe Order again', async () => {
      await scanVerifyV2Page.clickOnOrdersAndNavigateBackToOrder(
        page,
        orderName,
      );
    });

    await test.step('Enter Order Tracking Number after Scanning', async () => {
      await page.reload();
      await scanVerifyV2Page.enterTrackingNumber(page, invalidTrackingNum);
      await page.waitForTimeout(3000);
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV2Page.openOrderInScanPackOptions(orderName);
      await scanVerifyV2Page.enterTrackingNumber(page, trackingNum);
    });

    await test.step('Verify Order is Scanned with valid Tracking ID', async () => {
      await page.waitForTimeout(3000);
      await scanVerifyV2Page.navigateToNavbar(page, ' Orders');
      await scanVerifyV2Page.navigateToNavbar(page, ' Orders');
      await scanVerifyV2Page.searchAndObserveOrderFromTable(page, orderName);
      await scanVerifyV3Page.validateFilteredTableData('Scanned', 'Status');
      await scanVerifyV3Page.validateFilteredTableData(
        trackingNum,
        'Tracking Id',
      );
    });
  });
});
