import { test, expect } from '@playwright/test';
import { ScanVerifyPage } from '../../Pages/ScanVerify';
import { LoginPage } from '../../Pages/Login';
import { getOrderApi, updateOrderList } from '../../../Utils/updateApi';
import { generateUniqueID } from '../../../Utils/testUtils';

test.describe(`Page - Scan and Verify`, () => {
  test.only('Test: 1:- Verify that user is not able to "Scan a packing slip" of a invalid order on "Scan & Verify" screen - scan-verify-1', async ({
    page,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderId = 'Invalid 1122';
    const orderMsg = 'Order with number Invalid 1122 cannot be found';
    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });
    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderId);
    });

    await test.step('Press Enter Button and Navigate to Ready to Scan Page', async () => {
      await scanVerifyPage.pressEnterButton();
      await scanVerifyPage.observeInvalidId(orderMsg);
    });
  });

  test('Test: 2:- Verify the validation message when order ID is blank on "Scan & Verify" screen - scan-verify-2', async ({
    page,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderId = '';

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });
    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderId);
    });

    await test.step('Press Enter Button and Navigate to Ready to Scan Page', async () => {
      await scanVerifyPage.pressEnterButton();
    });
  });

  test('Test: 3:- Verify the validation message while user try to scan already scanned order ID on "Scan & Verify" screen - scan-verify-3', async ({
    page,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderId = '1727';
    const orderMsg = 'The order has already been scanned.';
    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });
    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });

    await test.step('Enter Order ID in "Ready for Order Scan" field', async () => {
      await scanVerifyPage.scanOrderId(orderId);
    });

    await test.step('Press Enter Button and Navigate to Ready to Scan Page', async () => {
      await scanVerifyPage.pressEnterButton();
      await scanVerifyPage.observeInvalidId(orderMsg);
    });
  });

  test('Test: 4:- Verify that user is able to "Restart Order" - scan-verify-4', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderId = 1;
    const order = 'abc';

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');
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
      await scanVerifyPage.scanOrderId(order);
      await scanVerifyPage.pressEnterButton();
    });

    await test.step('Enter valid "UPC" in "Ready For Product Scan" field and Press Enter', async () => {
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
    });
    await test.step('Observe Restart button Functionality', async () => {
      await scanVerifyPage.clickOnRestartBtn();
      await scanVerifyPage.observeRestartPrompt();
    });
  });

  test('Test: 5:- Verify that user is able to "Reload Order" - scan-verify-5', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderId = 4;
    const order = 'abc2';

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
      await scanVerifyPage.scanOrderId(order);
      await scanVerifyPage.pressEnterButton();
    });

    await test.step('Enter valid "UPC" in "Ready For Product Scan" field and Press Enter', async () => {
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
    });

    await test.step('Observe Reload button Functionality', async () => {
      await scanVerifyPage.clickOnReloadOrder();
    });
  });

  test('Test: 6:- Verify that user is able to "Add Note" while scanning products for order - scan-verify-6', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderId = 4;
    const order = 'abc2';
    // Api to update product status

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    });
    await test.step('Click on "add Note" button', async () => {
      await scanVerifyPage.clickOnAddNoteBtn();
    });
    await test.step('Observe add note functionality', async () => {
      await scanVerifyPage.observeAddNoteModal();
    });
  });

  test('Test: 7:- Verify that user is able to view "Product Info" under "Product Detail" while scanning products - scan-verify-7', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderId = 4;
    const order = 'abc2';
    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    });

    await test.step('Click on product name and observe the product details page', async () => {
      await scanVerifyPage.clickOnSpecificProduct();
      await scanVerifyPage.observeProductDetailsPage();
    });

    await test.step('Click on "More" with downward icon under location section', async () => {
      await scanVerifyPage.moreLocationsProductDetailsPage();
    });

    await test.step('Click on "More" with downward icon under barcodes section', async () => {
      await scanVerifyPage.moreSkusProductDetailsPage();
    });
  });

  test('Test: 8:- Verify that user is able to view "Scan & Pack Options" under "Product Detail" while scanning products - scan-verify-8', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderId = 4;
    const order = 'abc2';

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    });

    await test.step('Click on product name and observe the product details page', async () => {
      await scanVerifyPage.clickOnSpecificProduct();
      await scanVerifyPage.observeProductDetailsPage();
    });

    await test.step('Click on "Scan & Pack Options" tab', async () => {
      await scanVerifyPage.clickOnScanPackOptionsTab();
      await scanVerifyPage.observeScanPackOptionsTab();
    });
  });

  test('Test: 9:- Verify that user is able to update "Product Detail" while scanning products - scan-verify-9', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderId = 4;
    const order = 'abc2';

    const updatedProductName = 'Demo Product 2';
    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    });
    await test.step('Click on product name and observe the product details page', async () => {
      await scanVerifyPage.clickOnSpecificProduct();
      await scanVerifyPage.observeProductDetailsPage();
    });

    await test.step('Update product name and observe the change', async () => {
      await scanVerifyPage.updateProductName(updatedProductName);
      await scanVerifyPage.observeUpdatedProductName(updatedProductName);
    });
  });

  test('Test: 10:- Verify that user is able to "Add SKU" from product detail screen - scan-verify-10', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const newSku = generateUniqueID(6) + '-Sample-Qa-Sku';
    const orderId = 4;
    const order = 'abc2';

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    });

    await test.step('Click on product name and observe the product details page', async () => {
      await scanVerifyPage.clickOnSpecificProduct();
      await scanVerifyPage.observeProductDetailsPage();
    });

    await test.step('Click on "+" icon of SKU and Enter SKU', async () => {
      await scanVerifyPage.clickOnSkuAndObservePopup(newSku);
    });

    await test.step('Delete the Created SKU', async () => {
      await scanVerifyPage.removeAddedSku();
    });
  });

  test('Test: 11:- Verify that user is able to "Edit SKUs" from product detail screen - scan-verify-11', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderId = 4;
    const order = 'abc2';

    const newSku = generateUniqueID(6) + '-Sample-Qa-Sku';
    const updatedSku = newSku + '-edited';
    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    });

    await test.step('Click on product name and observe the product details page', async () => {
      await scanVerifyPage.clickOnSpecificProduct();
      await scanVerifyPage.observeProductDetailsPage();
    });

    await test.step('Click on "+" icon of SKU and Enter SKU', async () => {
      await scanVerifyPage.clickOnSkuAndObservePopup(newSku);
    });

    await test.step('Edit Created Sku', async () => {
      await scanVerifyPage.editCreatedSku(updatedSku);
    });

    await test.step('Delete the Created SKU', async () => {
      await scanVerifyPage.removeAddedSku();
    });
  });

  test('Test: 12:- Verify that SKU can not be duplicate in the product detail screen - scan-verify-12', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const newSku = generateUniqueID(6) + '-Sample-Qa-Sku';
    const orderId = 4;
    const order = 'abc2';

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    });

    await test.step('Click on product name and observe the product details page', async () => {
      await scanVerifyPage.clickOnSpecificProduct();
      await scanVerifyPage.observeProductDetailsPage();
    });

    await test.step('Click on "+" icon of SKU and Enter SKU', async () => {
      await scanVerifyPage.clickOnSkuAndObservePopup(newSku);
    });

    await test.step('Click on "+" icon of SKU and Enter SKU', async () => {
      await scanVerifyPage.clickOnSkuAndObservePopup(newSku);
    });

    await test.step('Observe Duplicate Sku Error Message', async () => {
      await scanVerifyPage.observeDuplicateSku();
    });

    await test.step('Delete the Created SKU', async () => {
      await scanVerifyPage.removeAddedSku();
    });
  });

  test('Test: 13:- Verify that user is able to Delete SKU from "Product Detail" screen - scan-verify-13', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const newSku = generateUniqueID(6) + '-Sample-Qa-Sku';
    const orderId = 4;
    const order = 'abc2';

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    });

    await test.step('Click on product name and observe the product details page', async () => {
      await scanVerifyPage.clickOnSpecificProduct();
      await scanVerifyPage.observeProductDetailsPage();
    });

    await test.step('Click on "+" icon of SKU and Enter SKU', async () => {
      await scanVerifyPage.clickOnSkuAndObservePopup(newSku);
    });

    await test.step('Delete the Created SKU', async () => {
      await scanVerifyPage.removeAddedSku();
    });
  });

  test('Test: 14:- Verify that user is able to "Add Barcodes" from product detail screen - scan-verify-14', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const newBarcode = generateUniqueID(6) + '-Sample-Qa-Barcode';
    const orderId = 4;
    const order = 'abc2';
    // Api to update product status

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    });

    await test.step('Click on product name and observe the product details page', async () => {
      await scanVerifyPage.clickOnSpecificProduct();
      await scanVerifyPage.observeProductDetailsPage();
    });

    await test.step('Click on "+" icon of Barcode and Enter Unique Barcode', async () => {
      await scanVerifyPage.clickOnBarcodeAndObservePopup(newBarcode);
    });

    await test.step('Delete the Created Barcode', async () => {
      await scanVerifyPage.removeAddedBarcode();
    });
  });

  test('Test: 15:- Verify that user is able to Edit "Barcodes" from product detail screen - scan-verify-15', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const newBarcode = generateUniqueID(6) + '-Sample-Qa-Barcode';
    const updatedBarcode = newBarcode + '-edited';
    const orderId = 4;
    const order = 'abc2';

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    });

    await test.step('Click on product name and observe the product details page', async () => {
      await scanVerifyPage.clickOnSpecificProduct();
      await scanVerifyPage.observeProductDetailsPage();
    });

    await test.step('Click on "+" icon of Barcode and Enter Unique Barcode', async () => {
      await scanVerifyPage.clickOnBarcodeAndObservePopup(newBarcode);
    });

    await test.step('Edit Created Barcode', async () => {
      await scanVerifyPage.editCreatedBarcode(updatedBarcode);
    });

    await test.step('Delete the Created Barcode', async () => {
      await scanVerifyPage.removeAddedBarcode();
    });
  });

  test('Test: 16:- Verify that Barcodes can not be duplicate in the product detail screen - scan-verify-16', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const newBarcode = generateUniqueID(6) + '-Sample-Qa-Barcode';
    const orderId = 4;
    const order = 'abc2';

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    });
    await test.step('Click on product name and observe the product details page', async () => {
      await scanVerifyPage.clickOnSpecificProduct();
      await scanVerifyPage.observeProductDetailsPage();
    });
    await test.step('Click on "+" icon of Barcode and Enter Unique Barcode', async () => {
      await scanVerifyPage.clickOnBarcodeAndObservePopup(newBarcode);
    });
    await test.step('Observe Added Barcode', async () => {
      await scanVerifyPage.observeAddedBarcode(newBarcode);
    });
    await test.step('Click on "+" icon of Barcode and Enter Unique Barcode', async () => {
      await scanVerifyPage.clickOnBarcodeAndObservePopup(newBarcode);
    });
    await test.step('Observe Duplicate Barcode Error Message', async () => {
      await scanVerifyPage.observeDuplicateBarcode();
    });
    await test.step('Observe Duplicate Barcode Error Message', async () => {
      await scanVerifyPage.observeSameBarcodeForDifferentProduct();
    });
    await test.step('Delete the Created Barcode', async () => {
      await scanVerifyPage.removeAddedBarcode();
    });
  });

  test('Test: 17:- Verify that user is able to "Delete Barcodes" from product detail screen - scan-verify-17', async ({
    page,
    request,
  }) => {
    const orderId = 4;
    const order = 'abc2';

    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const newBarcode = generateUniqueID(6) + '-Sample-Qa-Barcode';

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    });

    await test.step('Click on product name and observe the product details page', async () => {
      await scanVerifyPage.clickOnSpecificProduct();
      await scanVerifyPage.observeProductDetailsPage();
    });

    await test.step('Click on "+" icon of Barcode and Enter Unique Barcode', async () => {
      await scanVerifyPage.clickOnBarcodeAndObservePopup(newBarcode);
    });

    await test.step('Delete the Created Barcode', async () => {
      await scanVerifyPage.removeAddedBarcode();
    });
  });

  test('Test: 18:- Verify that user is able to "Scan a packing slip" of a valid order on "Scan & Verify" screen - scan-verify-18', async ({
    request,
    page,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderId = 4;
    const order = 'abc2';

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
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
    });

    await test.step('Enter valid "UPC" in "Ready For Product Scan" field and Press Enter', async () => {
      await scanVerifyPage.enterProductUPC();
      await page.keyboard.press('Enter');
    });
  });

  test('Test: 19:- Verify that user is able to "Print Shipping Label" of an order - scan-verify-19', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderId = 4;
    const order = 'abc2';
    const printLabel = true;

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    });

    await test.step('Observe Ready to Scan Page', async () => {
      await scanVerifyPage.observeReadyToScanPage();
      await scanVerifyPage.clickOnRestartBtn();
      await scanVerifyPage.observeRestartPrompt();
      await scanVerifyPage.scanOrderId(order);
      await scanVerifyPage.pressEnterButton();
    });

    await test.step('Enter valid "UPC" in "Ready For Product Scan" field and Press Enter', async () => {
      await scanVerifyPage.verifyMultiPackOrderBarCode(printLabel);
    });
  });

  test('Test: 20:- Verify that user is able to "Scan a packing slip" of a valid Kit Id on "Scan & Verify" screen - scan-verify-20', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderId = 4;
    const order = 'abc2';
    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    });

    await test.step('Enter valid "UPC" in "Ready For Product Scan" field and Press Enter', async () => {
      await scanVerifyPage.verifyMultiPackOrderBarCode();
    });
  });

  test('Test: 21:- Verify that user is able to scan a product that contains multiple barcodes - scan-verify-21', async ({
    page,
    request,
  }) => {
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const orderId = 4;
    const order = 'abc2';

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT_2}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
    );
    const apiStatus = await getOrderApi(
      request,
      `${process.env.API_TOKEN}`,
      orderId,
      `${process.env.VALID_USER_ACCOUNT_2}`,
    );
    expect(response.status()).toBe(200);
    expect(apiStatus.status).toBe('awaiting');

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
    });

    await test.step('Enter valid "UPC" in "Ready For Product Scan" field and Press Enter', async () => {
      await scanVerifyPage.verifyMultiPackOrderBarCode();
    });
  });
});
