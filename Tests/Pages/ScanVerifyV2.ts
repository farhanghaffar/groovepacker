import { type Page, expect } from '@playwright/test';
import { waitforLocatorVisibility } from '../../Utils/testUtils';
import { ScanVerifyPageV2Locators } from '../Locators/scanVerifyPage2Locators';

export class ScanVerifyV2Page {
  readonly page: Page;
  readonly locators: ScanVerifyPageV2Locators;
  constructor(page: Page) {
    this.page = page;
    this.locators = new ScanVerifyPageV2Locators(page);
  }

  emptyShippingErr = `The tracking number on the shipping label you just scanned
          does not match the tracking number imported with that order. Please verify that you have the correct shipping
          label and try your scan again. If you are aware of the issue and would like to proceed with the next order please
          scan your confirmation code to continue.`;

  async visit() {
    await this.page.goto(`https://postscanningprotectedv2.groovepacker.com`);
  }

  async successfulLogin(userName: string, password: string) {
    await this.enterUsername(userName);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async conditionalLoginAdmin(userName: string, password: string) {
    const usernameInput = this.locators.usernameInput;
    if (await waitforLocatorVisibility(this.page, usernameInput)) {
      await this.enterUsername(userName);
      await this.enterPassword(password);
      await this.clickLoginButton();
    }
  }

  async enterUsername(userName: string) {
    const usernameInput = this.locators.usernameInput;
    await expect(usernameInput).toBeVisible();
    await usernameInput.fill(userName);
  }

  async enterPassword(password: string) {
    const passwordInput = this.locators.passwordInput;
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(password);
  }

  async clickLoginButton() {
    const loginButton = this.locators.loginButton;
    await expect(loginButton).toBeVisible();
    await loginButton.click();
  }

  async openOrderInScanPackOptions(orderName: string) {
    const order = this.page
      .locator('td')
      .filter({
        has: this.page.getByText(orderName, { exact: true }),
      })

      .first();
    await expect(order).toBeVisible();
    await order.click({ button: 'left', modifiers: ['Control'] });
  }

  async observeOrderInScanPackOptions(page: Page) {
    const pageTitle = page.getByRole('heading', { level: 3 }).filter({
      has: page.getByText('Please scan this product next', { exact: true }),
    });
    await expect(pageTitle).toBeVisible();
  }

  async enterProductBarcode(page: Page, barcode: string) {
    const enterBarcodeField = page
      .getByPlaceholder('Ready For Product Scan')
      .first();
    await expect(enterBarcodeField).toBeVisible();
    await enterBarcodeField.fill(barcode);
    await page.keyboard.press('Enter');
  }

  async enterProductSerialNumber(page: Page, serialNum: string) {
    const serialNumPopupTitle = page.getByText('Product Serial Number').first();
    await expect(serialNumPopupTitle).toBeVisible();

    const enterSerialNumber = page
      .locator('div')
      .filter({
        hasText: 'Serial Number',
      })
      .last()
      .locator('input')
      .first();
    await expect(enterSerialNumber).toBeVisible();
    await enterSerialNumber.fill(serialNum);
    await page.keyboard.press('Enter');
  }

  async navigateToNavbar(page: Page, tabName: string) {
    const navigateToOrders = page
      .getByRole('link')
      .filter({
        has: page.getByText(tabName, { exact: true }),
      })
      .first();
    await expect(navigateToOrders).toBeVisible();
    await navigateToOrders.dispatchEvent('click');
    await page.waitForTimeout(2000);
  }

  async enterProductTrackingNumber(page: Page, trackingNum: string) {
    const trackingNumPopupTitle = page
      .getByText('Scan Shipping Label for Order')
      .first();
    await expect(trackingNumPopupTitle).toBeVisible();

    const enterTrackingNumber = page
      .getByPlaceholder('Scan...')

      .first();
    await expect(enterTrackingNumber).toBeVisible();
    await enterTrackingNumber.fill(trackingNum);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    await this.navigateToNavbar(page, ' Orders');
    await this.navigateToNavbar(page, ' Orders');
    await page.waitForTimeout(2000);
  }

  async searchAndObserveOrderFromTable(page: Page, order: string) {
    await page.waitForTimeout(5000);
    const searchTenant = page.getByPlaceholder('Search').first();
    await expect(searchTenant).toBeVisible();
    await searchTenant.fill(order);
    await page.keyboard.press('Enter');
  }

  async clickOnSystemSettings(page: Page) {
    const clickOnSystemSettings = page
      .getByRole('link')
      .filter({
        has: page.getByText('System Settings', { exact: true }).first(),
      })
      .first();

    await expect(clickOnSystemSettings).toBeVisible();
    await clickOnSystemSettings.click();
  }

  async clickOnPrintingSettings(page: Page) {
    const clickOnPrintSettings = page
      .getByText('Printing Settings', { exact: true })
      .first();

    await expect(clickOnPrintSettings).toBeVisible();
    await clickOnPrintSettings.click();
  }

  async toggleBtn(page: Page, statusCheck: boolean, title: string) {
    const toggleRadioBtn = page
      .locator('div')
      .filter({
        has: page
          .getByText(title, {
            exact: true,
          })
          .first(),
      })
      .last();
    await expect(toggleRadioBtn).toBeVisible();

    const toggleBtn = toggleRadioBtn
      .getByRole('radio')
      .filter({
        has: page.locator(
          `[class="toggle-switch-animate ${
            statusCheck ? 'switch-off' : 'switch-on'
          }"]`,
        ),
      })
      .first();
    const isToggleBtnOn = await waitforLocatorVisibility(page, toggleBtn);

    if (isToggleBtnOn) {
      await expect(toggleBtn).toBeVisible();
      await toggleBtn.click({ delay: 1200 });
    }
  }

  async toggleFirstBtn(page: Page, statusCheck: boolean, title: string) {
    const toggleRadioBtn = await page
      .getByText(title, {
        exact: true,
      })
      .first()
      .locator(' +div');
    await expect(toggleRadioBtn).toBeVisible();

    const toggleBtn = toggleRadioBtn
      .getByRole('radio')
      .filter({
        has: page.locator(
          `[class="toggle-switch-animate ${
            statusCheck ? 'switch-off' : 'switch-on'
          }"]`,
        ),
      })
      .first();
    const isToggleBtnOn = await waitforLocatorVisibility(page, toggleBtn);

    if (isToggleBtnOn) {
      await expect(toggleBtn).toBeVisible();
      await toggleBtn.click({ delay: 1200 });
    }
  }

  async subfixToggle(page: Page, statusCheck: boolean) {
    const toggleRadioBtn = page
      .locator('[ng-model="scan_pack.settings.first_escape_string_enabled"]')
      .first();
    await expect(toggleRadioBtn).toBeVisible();

    const toggleBtn = toggleRadioBtn
      .getByRole('radio')
      .filter({
        has: page.locator(
          `[class="toggle-switch-animate ${
            statusCheck ? 'switch-off' : 'switch-on'
          }"]`,
        ),
      })
      .first();
    const isToggleBtnOn = await waitforLocatorVisibility(page, toggleBtn);

    if (isToggleBtnOn) {
      await expect(toggleBtn).toBeVisible();
      await toggleBtn.click({ delay: 1200 });
    }
  }

  async storeTrackingToggleBtn(
    page: Page,
    statusCheck: boolean,
    title: string,
  ) {
    const toggleBtn = page
      .locator('[ng-model="stores.single.import_shipped_having_tracking"]')
      .nth(2)
      .filter({
        has: page.locator(
          `[class="toggle-switch-animate ${
            statusCheck ? 'switch-off' : 'switch-on'
          }"]`,
        ),
      })
      .first();
    const isToggleBtnOn = await waitforLocatorVisibility(page, toggleBtn);

    if (isToggleBtnOn) {
      await expect(toggleBtn).toBeVisible();
      await toggleBtn.click({ delay: 1200 });
    }
  }

  async storeAPIToggleBtn(page: Page, statusCheck: boolean, title: string) {
    const toggleBtn = page
      .locator('[ng-model="stores.single.use_api_create_label"]')
      .nth(2)
      .filter({
        has: page.locator(
          `[class="toggle-switch-animate ${
            statusCheck ? 'switch-off' : 'switch-on'
          }"]`,
        ),
      })
      .first();
    const isToggleBtnOn = await waitforLocatorVisibility(page, toggleBtn);

    if (isToggleBtnOn) {
      await expect(toggleBtn).toBeVisible();
      await toggleBtn.click({ delay: 1200 });
    }
  }

  async clickOnScanPackOptions(page: Page) {
    const clickOnScanAndPack = page
      .getByText('Scan & Pack', { exact: true })
      .first();

    await expect(clickOnScanAndPack).toBeVisible();
    await clickOnScanAndPack.click();
    await page.waitForTimeout(1000);
  }

  async postScanningFunctions(
    page: Page,
    functionTitle: string,
    selectOption: string,
  ) {
    const postScanningFunctions1 = page
      .locator('div')
      .filter({
        has: page.getByText(functionTitle).first(),
      })
      .last()
      .getByRole('button')
      .first();
    await page.mouse.click(500, 1500);
    await expect(postScanningFunctions1).toBeVisible();
    await page.mouse.click(500, 1500);
    await page.mouse.move(200, 500);
    await postScanningFunctions1.click({ delay: 500 });
    await page.mouse.move(200, 500);
    const selectPrintOrderBarcode = page
      .locator('[class="dropdown-menu"]')
      .getByRole('listitem')
      .getByText(selectOption)
      .first();
    await expect(selectPrintOrderBarcode).toBeVisible();
    await selectPrintOrderBarcode.click({ delay: 500 });
  }

  async openStoreDetailsScreen(page: Page) {
    const storeName = page
      .getByRole('link')
      .filter({
        hasText: '000-ShipStation GP',
      })
      .first();
    await page.waitForTimeout(4000);
    await expect(storeName).toBeVisible();
    await storeName.click({ delay: 1000 });
  }

  async closeStoreDetailsPage(page: Page) {
    const closeOrderDetails = page.locator('[class="close-btn"]').first();
    await expect(closeOrderDetails).toBeVisible();
    await closeOrderDetails.click({ delay: 1000 });
  }

  async preConditions01AOrder(page: Page) {
    await page.waitForTimeout(5000);
    await this.navigateToNavbar(page, ' Settings');
    await this.clickOnSystemSettings(page);
    await this.clickOnPrintingSettings(page);
    await this.toggleBtn(page, true, 'Post Scanning Order Number Barcode');
    await this.clickOnSystemSettings(page);
    await this.clickOnScanPackOptions(page);
    await this.postScanningFunctions(
      page,
      'Post-Scanning Functions 1',
      'Print Order Barcode',
    );
    await this.postScanningFunctions(
      page,
      'Post-Scanning Functions 2',
      'Record Tracking Number',
    );
    await this.toggleBtn(page, false, 'Tracking Number Validation');
    await this.toggleBtn(page, false, 'Require Serial/Lot Prefix');
    await this.navigateToNavbar(page, ' Settings');
    await this.openStoreDetailsScreen(page);
    await this.storeAPIToggleBtn(
      page,
      false,
      'Use API to Create Shipstation Labels',
    );
    await this.closeStoreDetailsPage(page);
    await page.waitForTimeout(3000);
    await this.navigateToNavbar(page, ' Orders');
    await this.navigateToNavbar(page, ' Orders');
  }

  async preConditions0BOrder(page: Page) {
    await page.waitForTimeout(5000);
    await this.navigateToNavbar(page, ' Settings');
    await this.clickOnSystemSettings(page);
    await this.clickOnPrintingSettings(page);
    await this.toggleBtn(page, true, 'Post Scanning Order Number Barcode');
    await this.clickOnSystemSettings(page);
    await this.clickOnScanPackOptions(page);
    await this.postScanningFunctions(
      page,
      'Post-Scanning Functions 1',
      'Print Order Barcode',
    );
    await this.postScanningFunctions(
      page,
      'Post-Scanning Functions 2',
      'Record Tracking Number',
    );
    await this.navigateToNavbar(page, ' Settings');
    await this.openStoreDetailsScreen(page);
    await this.storeAPIToggleBtn(
      page,
      false,
      'Use API to Create Shipstation Labels',
    );
    await this.closeStoreDetailsPage(page);
    await page.waitForTimeout(3000);
    await this.navigateToNavbar(page, ' Orders');
    await this.navigateToNavbar(page, ' Orders');
  }

  async preConditions02aOrder(page: Page) {
    await page.waitForTimeout(5000);
    await this.navigateToNavbar(page, ' Settings');
    await this.clickOnSystemSettings(page);
    await this.clickOnScanPackOptions(page);
    await this.postScanningFunctions(page, 'Post-Scanning Functions 1', 'None');
    await this.postScanningFunctions(page, 'Post-Scanning Functions 2', 'None');
    await this.toggleBtn(page, true, 'Click Scanning');

    await this.clickOnPrintingSettings(page);
    await this.toggleBtn(page, true, 'Post Scanning Order Number Barcode');
    await this.navigateToNavbar(page, ' Settings');
    await this.openStoreDetailsScreen(page);
    await this.storeAPIToggleBtn(
      page,
      true,
      'Use API to Create Shipstation Labels',
    );
    await this.closeStoreDetailsPage(page);
    await page.waitForTimeout(3000);
    await this.navigateToNavbar(page, ' Orders');
    await this.navigateToNavbar(page, ' Orders');
  }

  async preConditions02bOrder(page: Page) {
    await page.waitForTimeout(5000);
    await this.navigateToNavbar(page, ' Settings');
    await this.clickOnSystemSettings(page);
    await this.clickOnScanPackOptions(page);
    await this.postScanningFunctions(page, 'Post-Scanning Functions 1', 'None');
    await this.postScanningFunctions(page, 'Post-Scanning Functions 2', 'None');
    await this.toggleBtn(page, true, 'Click Scanning');

    await this.clickOnPrintingSettings(page);
    await this.toggleBtn(page, false, 'Post Scanning Order Number Barcode');
    await this.navigateToNavbar(page, ' Settings');
    await this.openStoreDetailsScreen(page);
    await this.storeAPIToggleBtn(
      page,
      true,
      'Use API to Create Shipstation Labels',
    );
    await this.closeStoreDetailsPage(page);
    await page.waitForTimeout(3000);
    await this.navigateToNavbar(page, ' Orders');
    await this.navigateToNavbar(page, ' Orders');
  }

  async clickOnOrderToScanOnce(page: Page, orderName: string) {
    const itemScan = page
      .getByRole('heading', { level: 5 })
      .filter({
        has: page.getByText(orderName).first(),
      })
      .first();
    await expect(itemScan).toBeVisible();

    const firstProductScan = itemScan.getByText(orderName).first();
    await expect(firstProductScan).toBeVisible();
    await firstProductScan.click({ delay: 500 });
  }

  async enterNumberOfProductsToScan(page: Page) {
    const enterBarcodeField = page
      .getByPlaceholder('Ready For Product Scan')
      .first();
    await expect(enterBarcodeField).toBeVisible();
    await page.waitForTimeout(2000);
    await enterBarcodeField.fill('*');
    await page.waitForTimeout(3000);
    await page.keyboard.press('Enter');
  }

  async productsCountPopup(page: Page, order: string) {
    const popupTitle = page
      .getByText(`Please enter the total of ${order} packed in this order`)
      .first();
    await expect(popupTitle).toBeVisible();

    const addProductCount = page
      .locator('div')
      .filter({ hasText: 'Count' })
      .last()
      .locator('input')
      .first();
    await expect(addProductCount).toBeVisible();
    await addProductCount.fill('10');
    await page.keyboard.press('Enter');
  }

  async enterTrackingNumber(page: Page, trackingNum: string) {
    const trackingNumPopupTitle = page
      .getByText('Scan Tracking Number for Order')
      .first();
    await expect(trackingNumPopupTitle).toBeVisible();

    const enterTrackingNumber = page
      .getByPlaceholder('Scan...')

      .first();
    await expect(enterTrackingNumber).toBeVisible();
    await enterTrackingNumber.fill(trackingNum);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(4000);
    await this.navigateToNavbar(page, ' Orders');
    await this.navigateToNavbar(page, ' Orders');
  }

  async preConditions04Order(page: Page) {
    await page.waitForTimeout(5000);
    await this.navigateToNavbar(page, ' Settings');
    await this.clickOnSystemSettings(page);
    await this.clickOnScanPackOptions(page);
    await this.postScanningFunctions(
      page,
      'Post-Scanning Functions 1',
      'Print Packing Slip',
    );
    await this.postScanningFunctions(
      page,
      'Post-Scanning Functions 2',
      'Record Tracking Number',
    );
    await this.clickOnPrintingSettings(page);

    await this.toggleBtn(page, false, 'Packing Slips');
    await this.toggleBtn(
      page,
      false,
      'Shipping Labels via ShipStation Integration',
    );
    await this.navigateToNavbar(page, ' Settings');
    await this.openStoreDetailsScreen(page);
    await this.storeAPIToggleBtn(
      page,
      false,
      'Use API to Create Shipstation Labels',
    );
    await this.closeStoreDetailsPage(page);

    await page.waitForTimeout(3000);
    await this.navigateToNavbar(page, ' Orders');
    await this.navigateToNavbar(page, ' Orders');
  }

  async clickOnOrdersAndNavigateBackToOrder(page: Page, orderName: string) {
    await page.waitForTimeout(3000);
    await this.navigateToNavbar(page, ' Orders');
    await this.navigateToNavbar(page, ' Orders');
    await this.searchAndObserveOrderFromTable(page, orderName);
    await this.openOrderInScanPackOptions(orderName);
  }

  async preConditions05aOrder(page: Page) {
    await page.waitForTimeout(5000);
    await this.navigateToNavbar(page, ' Settings');
    await this.clickOnSystemSettings(page);
    await this.clickOnScanPackOptions(page);
    await this.postScanningFunctions(
      page,
      'Post-Scanning Functions 1',
      'Shipping Label Verification',
    );
    await this.postScanningFunctions(page, 'Post-Scanning Functions 2', 'None');
    await this.navigateToNavbar(page, ' Settings');
    await this.openStoreDetailsScreen(page);
    await this.storeAPIToggleBtn(
      page,
      false,
      'Use API to Create Shipstation Labels',
    );
    await this.closeStoreDetailsPage(page);

    await page.waitForTimeout(3000);
    await this.navigateToNavbar(page, ' Orders');
    await this.navigateToNavbar(page, ' Orders');
  }

  async preConditions05bOrder(page: Page) {
    await page.waitForTimeout(5000);
    await this.navigateToNavbar(page, ' Settings');
    await this.clickOnSystemSettings(page);
    await this.clickOnScanPackOptions(page);
    await this.postScanningFunctions(
      page,
      'Post-Scanning Functions 1',
      'Shipping Label Verification',
    );
    await this.postScanningFunctions(page, 'Post-Scanning Functions 2', 'None');
    // await this.toggleBtn(page, false, 'Tracking Number Validation');
    const generalSettings = page.getByText('General', { exact: true }).first();

    await expect(generalSettings).toBeVisible();
    await generalSettings.click({ delay: 1000 });

    await this.toggleBtn(page, false, 'Strict Confirmation Codes?');
    await this.navigateToNavbar(page, ' Settings');
    await this.openStoreDetailsScreen(page);
    await this.storeAPIToggleBtn(
      page,
      false,
      'Use API to Create Shipstation Labels',
    );
    await this.closeStoreDetailsPage(page);

    await page.waitForTimeout(3000);
    await this.navigateToNavbar(page, ' Orders');
    await this.navigateToNavbar(page, ' Orders');
  }

  async enterShippingLabel5B(page: Page) {
    const trackingNumPopupTitle = page
      .getByText('Scan Shipping Label for Order')
      .first();
    await expect(trackingNumPopupTitle).toBeVisible();

    const enterTrackingNumber = page
      .getByPlaceholder('Scan...')

      .first();
    await expect(enterTrackingNumber).toBeVisible();
    await page.keyboard.press('Enter');

    const errMessage = page
      .getByRole('heading', { level: 3 })
      .filter({
        has: page.getByText(this.emptyShippingErr, { exact: true }).last(),
      })
      .first();
    await expect(errMessage).toBeVisible();

    await page.keyboard.press('Enter');
    await this.navigateToNavbar(page, ' Orders');
    await this.navigateToNavbar(page, ' Orders');
  }

  async preConditions06Order(page: Page) {
    await page.waitForTimeout(5000);
    await this.navigateToNavbar(page, ' Settings');
    await this.clickOnSystemSettings(page);
    await this.clickOnScanPackOptions(page);
    await this.postScanningFunctions(
      page,
      'Post-Scanning Functions 1',
      'Record Tracking Number',
    );
    await page.mouse.click(500, 500);
    await this.postScanningFunctions(page, 'Post-Scanning Functions 2', 'None');

    await this.toggleBtn(page, true, 'Tracking Number Validation');

    await this.navigateToNavbar(page, ' Settings');
    await this.openStoreDetailsScreen(page);
    await this.storeTrackingToggleBtn(page, true, 'Require Tracking Number');
    await this.storeAPIToggleBtn(
      page,
      false,
      'Use API to Create Shipstation Labels',
    );
    await this.closeStoreDetailsPage(page);
    await page.waitForTimeout(3000);
    await this.navigateToNavbar(page, 'Orders');
    await this.navigateToNavbar(page, 'Orders');
  }

  async printOrderPage(page: Page) {
    const closeOrderDetails = page
      .locator('[class="close-btn"]')

      .first();
    await expect(closeOrderDetails).toBeVisible();
    await closeOrderDetails.click({ delay: 1000 });
  }
}
