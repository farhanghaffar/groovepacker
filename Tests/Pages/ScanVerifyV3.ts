import { type Page, expect } from '@playwright/test';
import { ScanVerifyPageV3Locators } from '../Locators/scanVerifyPageV3Locators';
import { waitforLocatorVisibility } from '../../Utils/testUtils';
import { ScanVerifyPage } from './ScanVerify';

export class ScanVerifyV3Page {
  readonly page: Page;
  readonly locators: ScanVerifyPageV3Locators;
  readonly scanVerifyPage: ScanVerifyPage;
  constructor(page: Page) {
    this.page = page;
    this.locators = new ScanVerifyPageV3Locators(page);
    this.scanVerifyPage = new ScanVerifyPage(page);
  }

  async visit() {
    await this.page.goto(`${process.env.TENANT_URL}`, {
      waitUntil: 'domcontentloaded',
    });
  }

  async visitAppUrl() {
    await this.page.goto(`https://app.groovepacker.com`);
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

  async getColumnIndex(column: string) {
    const columnIndex = await this.page.$eval(
      'thead >> tr',
      (thead, searchText) => {
        const ths = Array.from(thead.querySelectorAll('th'));
        return ths.findIndex(
          (th) => th.textContent && th.textContent.trim() === searchText,
        );
      },
      column,
    );
    return columnIndex;
  }

  async validateFilteredTableData(tenant: string, column: string) {
    const columnIndex = await this.getColumnIndex(column);
    console.log(columnIndex);
    await this.page.waitForTimeout(3000);
    const duplicatedTenant = await this.locators.tableBodyElements(
      this.page,
      columnIndex,
    );

    await expect(duplicatedTenant).toBeVisible();

    await this.page.waitForTimeout(8000);
    const duplicatedTenantTxt = await duplicatedTenant.innerText();
    expect(tenant).toEqual(duplicatedTenantTxt);
  }

  async selectFilteredTableData(column: string) {
    const columnIndex = await this.getColumnIndex(column);

    const tableBodyElements = await this.locators.tableBodyElements(
      this.page,
      columnIndex,
    );
    await expect(tableBodyElements).toBeVisible();
    const accountUrl = await tableBodyElements.innerText();
    await this.page.goto(`https://${accountUrl}`);
    return `https://${accountUrl}`;
  }

  async searchTenantFromTable(tenantToBeDublicated: string) {
    await this.page.waitForTimeout(3000);
    const sessionLogout = this.locators.sessionLogout;
    const isSessionLogout = await waitforLocatorVisibility(
      this.page,
      sessionLogout,
    );
    if (isSessionLogout) {
      await expect(sessionLogout).toBeVisible();
      await sessionLogout.click();
    }

    await this.page.waitForTimeout(3000);
    const searchTenant = this.locators.searchTenant;
    await expect(searchTenant).toBeVisible();
    await searchTenant.fill(tenantToBeDublicated);
    await this.page.keyboard.press('Enter');
  }

  async loginToDuplicatedUser() {
    const sessionLogout = this.locators.sessionLogout;
    const isSessionLogout = await waitforLocatorVisibility(
      this.page,
      sessionLogout,
    );
    if (isSessionLogout) {
      await expect(sessionLogout).toBeVisible();
      await sessionLogout.click();
    }

    const verifyLoggedIn = this.locators.verifyLoggedIn;
    await expect(verifyLoggedIn).toBeVisible();

    const ordersTxt = await this.locators.listInnerTxt('Orders');
    await expect(ordersTxt).toBeVisible();

    const productsTxt = await this.locators.listInnerTxt('Products');
    await expect(productsTxt).toBeVisible();
  }

  async selectTenantToDuplicate(tenantToBeDublicated: string) {
    const tenant = this.page
      .getByRole('row')
      .filter({
        has: this.page.getByText(tenantToBeDublicated, { exact: true }),
      })
      .locator('td')
      .first();
    await expect(tenant).toBeVisible();
    await tenant.click();

    const selectDuplicateFromDropdown =
      this.locators.selectDuplicateFromDropdown;
    await expect(selectDuplicateFromDropdown).toBeVisible();
    await selectDuplicateFromDropdown.click();

    const selectDuplicate = this.locators.selectDuplicate;
    await expect(selectDuplicate).toBeVisible();
    await selectDuplicate.click();
  }

  async duplicateTenantAndObserve(duplicatedTenant: string) {
    await this.page.waitForTimeout(2000);
    const searchTenant = this.locators.searchTenant;
    await expect(searchTenant).toBeVisible();
    const duplicateModalHeading = this.locators.duplicateModalHeading;
    await expect(duplicateModalHeading).toBeVisible();
    await this.page.waitForTimeout(2000);
    const enterDuplicateName = this.locators.enterDuplicateName;
    await expect(enterDuplicateName).toBeVisible();
    await enterDuplicateName.pressSequentially(duplicatedTenant);
    const clickOnConfirmBtn = this.locators.clickOnConfirmBtn;
    await expect(clickOnConfirmBtn).toBeVisible();
    await clickOnConfirmBtn.click();
    await expect(searchTenant).toBeVisible();
    await searchTenant.clear();
    await searchTenant.pressSequentially(duplicatedTenant);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(6000);
  }

  async getBarcode() {
    const productUPC = this.locators.productUPC;
    expect(productUPC).toBeVisible();
    const productUpcId = await productUPC.innerText();
    const barcode = productUpcId.split(':');
    let barcodeTxt = barcode[1];
    return barcodeTxt;
  }

  async clickOnReloadOrder() {
    const reloadOrder = this.locators.reloadOrder;
    await expect(reloadOrder).toBeVisible();
    await reloadOrder.click();
  }

  async fillOrder(barcodeTxt: string) {
    const orderReadyToScan = this.locators.orderReadyToScan;
    const isVisibleOrderReadyToScan = await waitforLocatorVisibility(
      this.page,
      orderReadyToScan,
    );
    if (!isVisibleOrderReadyToScan) {
      const orderInput = this.locators.orderInput;
      await expect(orderInput).toBeVisible();
      await orderInput.click();
    }
    await expect(orderReadyToScan).toBeVisible();
    await this.page.waitForTimeout(2000);
    await expect(orderReadyToScan).toBeFocused();
    await orderReadyToScan.fill(barcodeTxt);
  }

  async observeFirstItemSku() {
    const productSku = this.locators.productSku;
    expect(productSku).toBeVisible();
    const productSkuId = await productSku.innerText();
    const skuCode = productSkuId.split(':');
    let skuTxt = skuCode[1];
    expect(skuTxt).toBe('E');

    await this.verifyInternalNotes();
    const itemName = this.locators.itemName;
    expect(itemName).toBeVisible();
    await itemName.click();
    const scanPackOption = this.locators.scanPackOption;
    const isScanPackVisible = await waitforLocatorVisibility(
      this.page,
      scanPackOption,
    );
    if (isScanPackVisible) {
      expect(scanPackOption).toBeVisible();
      await scanPackOption.click();
      const itemOrder = this.locators.itemOrder;
      await expect(itemOrder).toBeVisible();
      const itemCount = await this.page
        .getByTestId('scanning_sequence')
        .inputValue();
      expect(itemCount).toBe('30');
      const cancelBtn = this.locators.cancelBtn;
      await expect(cancelBtn).toBeVisible();
      await cancelBtn.click();
    }

    const verifyLocation = this.locators.verifyLocation;
    await expect(verifyLocation).toBeVisible();
    const locationTxt = verifyLocation.locator(' +div').first();
    expect(await locationTxt.innerText()).toEqual('NYNY');

    const barcodeTxt = await this.getBarcode();
    await this.fillOrder(barcodeTxt);
    await this.page.keyboard.press('Enter');

    await this.fillOrder(barcodeTxt.toLowerCase());
    await this.page.keyboard.press('Enter');
  }

  async observeElementByTxt(findTxt: string) {
    const elementTxt = this.page.getByText(findTxt).first();
    await expect(elementTxt).toBeVisible();
  }

  async observeSecondItemSku() {
    const productSku = this.locators.productSku;
    expect(productSku).toBeVisible();
    const productSkuId = await productSku.innerText();
    const skuCode = productSkuId.split(':');
    let skuTxt = skuCode[1];
    expect(skuTxt).toBe('A');

    await this.observeElementByTxt('This is a paragraph.');
    await this.observeElementByTxt('(you are reading product instructions)');
    await this.observeElementByTxt('This product can be a kit.');

    const barcodeTxt = await this.getBarcode();
    await this.fillOrder(barcodeTxt);
    await this.page.keyboard.press('Enter');

    await this.fillOrder(barcodeTxt);
    await this.page.keyboard.press('Enter');

    await this.fillOrder(barcodeTxt.toLowerCase());
    await this.page.keyboard.press('Enter');
  }

  async observeThirdItemSku() {
    const productSku = this.locators.productSku;
    expect(productSku).toBeVisible();
    const productSkuId = await productSku.innerText();
    const skuCode = productSkuId.split(':');
    let skuTxt = skuCode[1];
    expect(skuTxt).toBe('g');

    const barcodeTxt = await this.getBarcode();
    await this.fillOrder(barcodeTxt);
    await this.page.keyboard.press('Enter');

    await this.fillOrder(barcodeTxt + barcodeTxt);
    await this.page.keyboard.press('Enter');
  }

  async observeLogsContainer() {
    const barcodesScanned = ['gg', 'g', 'a', 'A', 'A', 'e', 'E'];

    const regularLogElements = await this.locators.regularLogElements;

    let barcodeInLogs: any = [];

    for (const element of regularLogElements) {
      const inputString = await element.innerText();
      const barcode = inputString.match(/barcode: (\w+)/);

      const extractedBarcode = barcode && barcode[1];
      barcodeInLogs.push(extractedBarcode);
    }

    for (let i = 0; i < barcodesScanned.length; i++) {
      const value = barcodesScanned[i];
      const value2 = barcodeInLogs[i];
      expect(value2).toEqual(value);
    }
  }

  async verifyOrder(arr: any[]) {
    const arrayAsString = arr.join('');
    const pattern = /^[^0-9]*[0-9]*[a-zA-Z]*$/;
    return pattern.test(arrayAsString);
  }

  async unscannedItemsLocationOrder() {
    const unscannedItemsLocation = await this.locators.unscannedItemsLocation;
    const barcodeArr: any = [];
    for (let element of unscannedItemsLocation) {
      const itemLocation = element.locator(':text("L1 :") + div');
      barcodeArr.push(await itemLocation.innerText());
    }
    const isSorted = this.verifyOrder(barcodeArr);
    expect(isSorted).toBeTruthy();
  }

  async observeFourthItemSkuRT() {
    const unscannedItemsLocation = this.locators.unscannedItemsLocationFirst;
    await expect(unscannedItemsLocation).toBeVisible();
    const productSku = this.locators.productSku;
    await expect(productSku).toBeVisible();
    const productSkuId = await productSku.innerText();
    const skuCode = productSkuId.split(':');
    let skuTxt = skuCode[1];
    expect(skuTxt).toBe('rt');

    const itemProductData =
      unscannedItemsLocation.locator(':text("C1:") + div');
    const productDataTxt = await itemProductData.innerText();
    expect(productDataTxt).toEqual('Large');

    await this.fillOrder('*');
    await this.page.keyboard.press('Enter');
    const errorMsgEmptyEsterik = this.locators.errorMsgEmptyEsterik;
    await expect(errorMsgEmptyEsterik).toBeVisible();

    const barcodeTxt = await this.getBarcode();
    await this.fillOrder(barcodeTxt);
    await this.page.keyboard.press('Enter');

    await this.fillOrder('*');
    await this.page.keyboard.press('Enter');

    const typeScanAlertContainer = this.locators.typeScanAlertContainer;
    await expect(typeScanAlertContainer).toBeVisible();

    const inputElement = this.locators.inputElement;
    await expect(inputElement).toBeVisible();
    await inputElement.fill('3');

    const clickOnEnterButton = this.locators.clickOnEnterButton;
    await expect(clickOnEnterButton).toBeVisible();
    await clickOnEnterButton.click();

    await this.fillOrder('*');
    await this.page.keyboard.press('Enter');
    await expect(inputElement).toBeVisible();
    await inputElement.fill('10');
    await this.page.keyboard.press('Enter');

    const errorMsgEmptyEsterik2 = this.locators.errorMsgEmptyEsterik2;
    await expect(errorMsgEmptyEsterik2).toBeVisible();

    await expect(typeScanAlertContainer).toBeVisible();
    await expect(inputElement).toBeVisible();
    await inputElement.fill('3');
    await clickOnEnterButton.click();

    await this.page.waitForTimeout(5000);
    const regularLogElements = this.locators.regularLogElementsTypeIn;
    const logsTxt = await regularLogElements.innerText();
    expect(logsTxt).toContain('Type-In count of 3 entered for product rt');

    await this.fillOrder(barcodeTxt);
    await this.page.keyboard.press('Enter'); 
    // await this.fillOrder(barcodeTxt);
    // await this.page.keyboard.press('Enter');
    // const clickScanLog = this.locators.clickScanLog;
    // await expect(clickScanLog).toBeVisible();
    // expect(await clickScanLog.innerText()).toContain(
    //   ` Qty 1 of SKU: rt was passed with the Pass option in  - by: ${process.env.VALID_USERNAME} on GPX `,
    // );
  }

  async observeLastItemSkuX() {
    const unscannedItemsLocation = this.locators.unscannedItemsLocationFirst;
    await expect(unscannedItemsLocation).toBeVisible();
    const productSku = this.locators.productSku;
    await expect(productSku).toBeVisible();
    const productSkuId = await productSku.innerText();
    const skuCode = productSkuId.split(':');
    let skuTxt = skuCode[1];
    expect(skuTxt).toBe('X');

    const barcodeTxt = await this.getBarcode();
    await this.fillOrder(barcodeTxt + barcodeTxt);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(2000);
    await this.fillOrder(barcodeTxt);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(2000);
    await this.fillOrder('PASS');
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(2000);
    const disabledPass = this.locators.disabledPass;
    await expect(disabledPass).toBeVisible();

    await expect(productSku).toBeVisible();

    await this.clickOnReloadOrder();
    await this.fillOrder(barcodeTxt);
    await this.page.keyboard.press('Enter');
  }

  async closeScannedMessageModal() {
    const modelCloseIcon = this.locators.modelCloseIcon;
    await expect(modelCloseIcon).toBeVisible();
    await modelCloseIcon.click();
  }

  async navigateToStandarGPX(
    url: string,
    order: string,
    column: string,
    value: string,
  ) {
    await this.page.goto(url, {
      waitUntil: 'domcontentloaded',
    });
    const usernameInput = this.locators.usernameInput;

    if (await waitforLocatorVisibility(this.page, usernameInput)) {
      await this.successfulLogin(
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    }

    await this.observeOrderScanned(order, column, value);
  }

  async observeOrderScanned(order: string, column: string, value: string) {
    console.log(value);
    await this.searchTenantFromTable(order);
    await this.validateFilteredTableData(value, column);
  }

  async verifyInternalNotes() {
    const notesTxt = this.page
      .getByText('Psst: You are reading Internal Notes', { exact: true })
      .first();
    await expect(notesTxt).toBeVisible();
    const customerComments = this.page
      .getByText('Customer Comments', { exact: true })
      .first();
    await expect(customerComments).toBeVisible();
    const confirmNotes = this.page
      .getByText('Got it.', { exact: true })
      .first();
    await expect(confirmNotes).toBeVisible();
    await confirmNotes.click();
  }

  async closeAlreadyScannedModal() {
    const closeIcon = this.locators.modelCloseIcon;
    await expect(closeIcon).toBeVisible();
    await closeIcon.click();
  }

  async deleteDuplicateTenantAfterTestCase(tenantToBeDublicated: string) {
    const tenant = this.page
      .getByRole('row')
      .filter({
        has: this.page.getByText(tenantToBeDublicated, { exact: true }),
      })
      .locator('td')
      .first();
    await expect(tenant).toBeVisible();
    await tenant.click();

    const selectDuplicateFromDropdown =
      this.locators.selectDuplicateFromDropdown;
    await expect(selectDuplicateFromDropdown).toBeVisible();
    await selectDuplicateFromDropdown.click();

    const selectDelete = this.locators.selectDelete;
    await expect(selectDelete).toBeVisible();
    await this.page.waitForTimeout(4000);

    await selectDelete.click();

    this.page.on('dialog', async (dialog) => {
      dialog && (await dialog.accept(tenantToBeDublicated));
    });

    await selectDuplicateFromDropdown.click();
    await selectDelete.click();
    await this.page.waitForTimeout(4000);
  }

  async scanExpo1u1Order() {
    const productSku = this.locators.productSku;
    expect(productSku).toBeVisible();
    const productSkuId = await productSku.innerText();
    const skuCode = productSkuId.split(':');
    let skuTxt = skuCode[1];
    expect(skuTxt).toBe('E');

    await this.scanVerifyPage.enterProductUPC();
    await this.page.keyboard.press('Enter');

    const clickOnLastItemToDisplayOnTop = this.page
      .locator('div')
      .filter({
        hasText: 'X',
      })
      .filter({
        has: this.page.getByTestId('shuffleItem'),
      })
      .last()
      .locator('img')
      .last();

    await clickOnLastItemToDisplayOnTop.click();

    await this.scanVerifyPage.enterProductUPC();
    await this.page.keyboard.press('Enter');

    await this.scanVerifyPage.enterProductUPC();
    await this.page.keyboard.press('Enter');

    const scannedItems = this.page
      .locator('div')
      .filter({
        has: this.page
          .locator('[data-component-name="scannedQtyCount"]')
          .first(),
      })
      .last();
    await expect(scannedItems).toBeVisible();
    const firstScannedItem = await scannedItems
      .getByTestId('copySKU')
      .first()
      .innerText();
    const firstScannedItemSku = firstScannedItem.split(':');
    let firstScannedItemSkuTxt = firstScannedItemSku[1];
    expect(firstScannedItemSkuTxt).toBe('E');

    const lastScannedItem = await scannedItems
      .getByTestId('copySKU')
      .last()
      .innerText();
    const lastScannedItemSku = lastScannedItem.split(':');
    let lastScannedItemSkuTxt = lastScannedItemSku[1];
    expect(lastScannedItemSkuTxt).toBe('X');
  }
}
