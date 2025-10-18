import { expect, test } from '@playwright/test';
import { ScanVerifyV3Page } from '../../Pages/ScanVerifyV3';
import { LoginPage } from '../../Pages/Login';
import { ScanVerifyPage } from '../../Pages/ScanVerify';
import { updateOrderList } from '../../../Utils/updateApi';
import { expo1ProtectedToken } from '../../../Utils/testUtils';

test.describe(`Page - EXPO1 - U1`, () => {
  test('Verifying Scanned Items Order - expo1u1_01', async ({
    page,
    request,
  }) => {
    const order = 'xyz';
    const orderId = 2;
    const scanVerifyPage = new ScanVerifyPage(page);
    const loginPage = new LoginPage(page);
    const scanVerifyV3Page = new ScanVerifyV3Page(page);

    await test.step('Enter Valid Credentials and Click on Login Button', async () => {
      await scanVerifyV3Page.visitAppUrl();
      await loginPage.successfulLogin(
        `expo1uvt`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    // Api to update product status
    const response = await updateOrderList(
      request,
      `${expo1ProtectedToken}`,
      orderId,
      'expo1uvt',
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

    await test.step('Observe Ready to Scan Page and Restart Order', async () => {
      await scanVerifyPage.observeReadyToScanPage();
      await scanVerifyPage.clickOnRestartBtn();
      await scanVerifyPage.observeRestartPrompt();
      await page.waitForTimeout(3000);
      await scanVerifyPage.scanOrderId(order);
      await scanVerifyPage.pressEnterButton();
      await scanVerifyPage.observeReadyToScanPage();
    });

    await test.step('Add Scanning Process and Observe the Order', async () => {
      await scanVerifyV3Page.scanExpo1u1Order();
    });
  });
});
