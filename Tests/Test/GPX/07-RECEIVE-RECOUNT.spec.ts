import { test, Page, expect } from '@playwright/test';
import { ScanVerifyV3Page } from '../../Pages/ScanVerifyV3';
import { LoginPage } from '../../Pages/Login';
import { generateUniqueID } from '../../../Utils/testUtils';
import { ReceiveRecountGpxPage } from '../../Pages/ReceiveRecount';
import { ScanVerifyPage } from '../../Pages/ScanVerify';
import data from '../../../Utils/data.json';

test.describe(`Page - GPX -> Receive and Recount`, () => {
  let page: Page;
  const duplicateTenantName = `receive_recount_gpx_${generateUniqueID(
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

  test('PART 1 -Receive inventory - Enter quantity received - receive_recount_gpx_01', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${data.tenant.name}`;

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
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToReceiveInventoryPage();
      await receiveRecountPage.observeReceiveInventoryPage();
    });

    await test.step('Enter Product Barcode to View Products List', async () => {
      await receiveRecountPage.enterProductBarcode('AP');
    });

    await test.step('Click on "Apple" and update quantity to receive by "10"', async () => {
      await receiveRecountPage.clickOnProductSkuToOpenDetailsPage('Apple');
      await receiveRecountPage.enterQtyToReceive('10');
    });

    await test.step('Observe the Receive Inventory Page', async () => {
      await receiveRecountPage.observeReceiveInventoryPage();
    });
  });

  test('PART 2 - Enter quantity received and create new product - receive_recount_gpx_02', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${data.tenant.name}`;

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
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToReceiveInventoryPage();
      await receiveRecountPage.observeReceiveInventoryPage();
    });

    await test.step('Enter Product Barcode to View Products List', async () => {
      await receiveRecountPage.enterProductBarcode('8765678');
    });

    await test.step('Click on Product to Create New Product', async () => {
      await receiveRecountPage.createNewProductPopup();
      await receiveRecountPage.createNewProductData('8765678');
    });

    await test.step('Observe the Receive Inventory Page', async () => {
      await receiveRecountPage.observeReceiveInventoryPage();
    });
  });

  test('PART 3 - Enter location and Observe the Product - receive_recount_gpx_03', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${data.tenant.name}`;

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
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToReceiveInventoryPage();
      await receiveRecountPage.observeReceiveInventoryPage();
      await receiveRecountPage.selectWorkflowDropDownOption('Enter Location');
    });

    await test.step('Enter Product Barcode to Enter Location', async () => {
      await receiveRecountPage.enterProductBarcode('ORANGE');
    });

    await test.step('Enter Product Location and Observe', async () => {
      await receiveRecountPage.enterProductLocation('Crate1');
      await receiveRecountPage.enterProductBarcode('ORANGE');
      await receiveRecountPage.observeProductLocation('Crate1');
    });

    await test.step('Observe the Receive Inventory Page', async () => {
      await receiveRecountPage.observeReceiveInventoryPage();
    });
  });

  test('PART 4 - Update quantity received then enter location - receive_recount_gpx_04', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${data.tenant.name}`;

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
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToReceiveInventoryPage();
      await receiveRecountPage.observeReceiveInventoryPage();
      await receiveRecountPage.selectWorkflowDropDownOption(
        'Enter Quantity Received, Then Enter Location',
      );
    });

    await test.step('Enter Product Barcode to Enter Location', async () => {
      await receiveRecountPage.enterProductBarcode('GREEN');
    });

    await test.step('Enter Product Location and Observe', async () => {
      await receiveRecountPage.enterProductQty('10');
      await receiveRecountPage.enterProductLocation('Crate2');
      await receiveRecountPage.enterProductBarcode('GREEN');
      await receiveRecountPage.observeProductLocation('Crate2');
    });

    await test.step('Observe the Receive Inventory Page', async () => {
      await receiveRecountPage.observeReceiveInventoryPage();
    });
  });

  test('PART 5 - Scan each piece received - receive_recount_gpx_05', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${data.tenant.name}`;

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
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToReceiveInventoryPage();
      await receiveRecountPage.observeReceiveInventoryPage();
      await receiveRecountPage.selectWorkflowDropDownOption(
        'Scan Each Piece Received',
      );
    });

    await test.step('Enter Product Barcode to Enter Location', async () => {
      await receiveRecountPage.enterProductBarcode('BANANA');
      await receiveRecountPage.enterProductSku('BANANA');
      expect(await receiveRecountPage.observeProductQohCount()).toEqual('2');
      await receiveRecountPage.enterProductSku('BANANA');
      expect(await receiveRecountPage.observeProductQohCount()).toEqual('3');
      await receiveRecountPage.clickOnElementByTestId('incrementButton');
      expect(await receiveRecountPage.observeProductQohCount()).toEqual('4');
      await receiveRecountPage.clickOnElementByTestId('incrementButton');
      expect(await receiveRecountPage.observeProductQohCount()).toEqual('5');
      await receiveRecountPage.clickOnElementByTestId('decrementButton');
      expect(await receiveRecountPage.observeProductQohCount()).toEqual('4');
      await receiveRecountPage.clickOnElementByTestId('SaveButton');
      await receiveRecountPage.observeReceiveInventoryPage();
      await receiveRecountPage.enterProductBarcode('BANANA');
      await receiveRecountPage.observeProductQoh('4');
      await page.getByText('Cancel').last().click();
    });

    await test.step('Observe the Receive Inventory Page', async () => {
      await receiveRecountPage.observeReceiveInventoryPage();
    });
  });

  test('PART 6 - Scan each piece received, then enter location - receive_recount_gpx_06', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${data.tenant.name}`;

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
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToReceiveInventoryPage();
      await receiveRecountPage.observeReceiveInventoryPage();
      await receiveRecountPage.selectWorkflowDropDownOption(
        'Scan Each Piece Received, Then Enter Location',
      );
    });

    await test.step('Enter Product Barcode, Increase the product Qoh and observe the Qoh quantity', async () => {
      await receiveRecountPage.part6ScanningQohSteps();
    });

    await test.step('Observe the Receive Inventory Page', async () => {
      await receiveRecountPage.observeReceiveInventoryPage();
    });
  });

  test('PART 7 - Quantity to receive with negative value - receive_recount_gpx_07', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);
    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${data.tenant.name}`;

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
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToReceiveInventoryPage();
      await receiveRecountPage.observeReceiveInventoryPage();
      await receiveRecountPage.selectWorkflowDropDownOption(
        'Enter Quantity Received',
      );
    });

    await test.step('Enter Product Barcode to View Products List', async () => {
      await receiveRecountPage.enterProductBarcode('MAGIC');
    });

    await test.step('Update Product Qoh and Click on Save Button', async () => {
      await receiveRecountPage.enterQtyToReceive('-5');
    });

    await test.step('Observe the Receive Inventory Page', async () => {
      await receiveRecountPage.observeReceiveInventoryPage();
    });
  });

  test('PART 8 - Edit product fields - receive_recount_gpx_08', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${data.tenant.name}`;
    const scanVerifyPage = new ScanVerifyPage(page);
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
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToReceiveInventoryPage();
      await receiveRecountPage.observeReceiveInventoryPage();
      await receiveRecountPage.selectWorkflowDropDownOption(
        'Enter Quantity Received',
      );
    });

    await test.step('Enter Product Barcode to View Products List', async () => {
      await receiveRecountPage.enterProductBarcode('MAGIC');
    });

    await test.step('Update the Product Qoh', async () => {
      await receiveRecountPage.enterQtyToReceive('-5');
    });

    await test.step('Navigate to Receive Inventory Page', async () => {
      await receiveRecountPage.observeReceiveInventoryPage();
    });

    await test.step('Click on Edit Fields Button and Observe the Product Details Page', async () => {
      await receiveRecountPage.enterProductBarcode('MAGIC');
      await page.getByText('Edit all product fields').first().click();
      await scanVerifyPage.observeProductDetailsPage();
    });
  });

  test('PART 9 - Recount with new quantity on hand - receive_recount_gpx_09', async ({
    page,
  }) => {
    const receiveRecountPage = new ReceiveRecountGpxPage(page);
    const loginPage = new LoginPage(page);

    const scanVerifyV3Page = new ScanVerifyV3Page(page);
    const tenantName = `${data.tenant.name}`;
    const scanVerifyPage = new ScanVerifyPage(page);
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
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
      await scanVerifyV3Page.loginToDuplicatedUser();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${duplicateTenantName}`,
        `${data.tenant.userName}`,
        `${data.tenant.password}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Navigate to Receive Inventory Page and Verify', async () => {
      await receiveRecountPage.navigateToRecountInventoryPage();
      await receiveRecountPage.observeRecountInventoryPage();
    });

    await test.step('Enter Product Barcode to View Products List', async () => {
      await receiveRecountPage.enterProductBarcode('B-PART-1');
    });

    await test.step('Update the Product Qoh', async () => {
      await receiveRecountPage.enterQtyToReceive('5');
    });

    await test.step('Navigate and Observe to Recount Inventory Page', async () => {
      await receiveRecountPage.observeRecountInventoryPage();
    });

    await test.step('Enter the Product "New QOH" on Recount Inventory Page', async () => {
      await receiveRecountPage.enterProductBarcode('B-PART-1');
      await receiveRecountPage.observeProductCount('5');
    });

    await test.step('Enter the Barcode again and verify the Added QOH inside "Previous QOH" Field', async () => {
      await receiveRecountPage.enterProductBarcode('MAGIC');
      await page.getByText('Edit all product fields').first().click();
      await scanVerifyPage.observeProductDetailsPage();
    });
  });
});
