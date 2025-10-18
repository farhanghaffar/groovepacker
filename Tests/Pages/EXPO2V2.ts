import { type Page, expect } from '@playwright/test';
import { ScanVerifyPageV2Locators } from '../Locators/scanVerifyPage2Locators';
import { ScanVerifyV2Page } from './ScanVerifyV2';
import { ScanVerifyPageLocators } from '../Locators/scanVerifyPageLocators';
import { ScanVerifyPage } from './ScanVerify';
import { ScanVerifyV3Page } from './ScanVerifyV3';
import { LoginPage } from './Login';
import { waitforLocatorVisibility } from '../../Utils/testUtils';

export class Expo2V2Functions {
  readonly page: Page;
  readonly locators: ScanVerifyPageV2Locators;
  readonly scanVerifyPage: ScanVerifyPageLocators;
  readonly scanVerifyV2Page: ScanVerifyV2Page;
  readonly scanVerifyPageFunctions: ScanVerifyPage;
  readonly scanVerifyV3PageFunctions: ScanVerifyV3Page;
  readonly loginPageFunctions: LoginPage;

  constructor(page: Page) {
    this.page = page;
    this.locators = new ScanVerifyPageV2Locators(page);
    this.scanVerifyPage = new ScanVerifyPageLocators(page);
    this.scanVerifyV2Page = new ScanVerifyV2Page(page);
    this.scanVerifyPageFunctions = new ScanVerifyPage(page);
    this.scanVerifyV3PageFunctions = new ScanVerifyV3Page(page);
    this.loginPageFunctions = new LoginPage(page);
  }

  async expo2V2PreConditionsPartA(page: Page) {
    await page.waitForTimeout(2000);
    await this.scanVerifyV2Page.navigateToNavbar(page, ' Settings');
    await page.waitForTimeout(2000);
    await this.scanVerifyV2Page.clickOnSystemSettings(page);
    await page.waitForTimeout(2000);
    await this.scanVerifyV2Page.clickOnScanPackOptions(page);
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 1',
      'Record Tracking Number',
    );
    await page.mouse.move(100, 299);

    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 2',
      'None',
    );
    await page.mouse.click(100, 299);
    await this.scanVerifyV2Page.toggleBtn(
      page,
      false,
      'Tracking Number Validation',
    );
    await this.scanVerifyV2Page.toggleBtn(
      page,
      false,
      'Require Serial/Lot Prefix',
    );
    await page.waitForTimeout(3000);
  }

  async preConditionsPartB(page: Page) {
    await page.waitForTimeout(2000);
    await this.scanVerifyV2Page.navigateToNavbar(page, ' Settings');
    await this.scanVerifyV2Page.clickOnSystemSettings(page);

    await this.scanVerifyV2Page.clickOnScanPackOptions(page);
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 1',
      'Record Tracking Number',
    );
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Cue orders for Scan and Pack using',
      'Shipping Label',
    );
    await page.mouse.move(500, 2500);
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 2',
      'None',
    );
    await page.mouse.move(500, 2500);
    await this.scanVerifyV2Page.toggleBtn(
      page,
      true,
      'Tracking Number Validation',
    );
    await page.mouse.move(500, 2500);
    const addPrefix = page
      .locator(
        'xpath=//div[@ng-show="scan_pack.settings.tracking_number_validation_enabled"]//input',
      )
      .first();

    await expect(addPrefix).toBeVisible();
    await addPrefix.fill('VALID');
    await page.waitForTimeout(1000);
  }

  async preConditionsPartC(page: Page) {
    await page.waitForTimeout(2000);
    await this.scanVerifyV2Page.navigateToNavbar(page, ' Settings');
    await this.scanVerifyV2Page.clickOnSystemSettings(page);
    await this.scanVerifyV2Page.clickOnScanPackOptions(page);

    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 1',
      'None',
    );
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 2',
      'None',
    );
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Cue orders for Scan and Pack using',
      'Packing Slip',
    );
    await this.scanVerifyV2Page.toggleBtn(
      page,
      true,
      'Require Serial/Lot Prefix',
    );
    const addPrefix = page
      .locator('[ng-model="scan_pack.settings.valid_prefixes"]')
      .first();

    await expect(addPrefix).toBeVisible();
    await addPrefix.click();
    await addPrefix.fill('PREFIX');
    await page.waitForTimeout(1000);
    await this.scanVerifyV2Page.toggleBtn(page, true, 'Barcode suffix removal');
    const setSubfix1 = page
      .locator('[ng-model="scan_pack.settings.escape_string"]')
      .first();
    await expect(setSubfix1).toBeVisible();
    await setSubfix1.click();
    await setSubfix1.fill(' - ');
    await this.scanVerifyV2Page.subfixToggle(page, true);
    const setSubfix2 = page
      .locator('[ng-model="scan_pack.settings.second_escape_string"]')
      .first();
    await expect(setSubfix2).toBeVisible();
    await setSubfix2.click();
    await setSubfix2.clear();
    await page.waitForTimeout(1000);
    await setSubfix2.pressSequentially('-');
    await page.waitForTimeout(3000);
    await this.scanVerifyV2Page.toggleFirstBtn(page, true, 'Record Suffix');
    await this.scanVerifyV2Page.toggleBtn(page, true, 'Record Suffix');
    await this.scanVerifyV2Page.toggleBtn(page, true, 'Restart current Order');
  }

  async preConditionsPartD(page: Page) {
    await page.waitForTimeout(2000);
    await this.scanVerifyV2Page.navigateToNavbar(page, ' Settings');
    await this.scanVerifyV2Page.clickOnSystemSettings(page);
    await this.scanVerifyV2Page.clickOnScanPackOptions(page);
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 1',
      'Shipping Label Verification',
    );
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 2',
      'None',
    );
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Cue orders for Scan and Pack using',
      'Packing Slip',
    );
  }

  async preConditionsPartE(page: Page) {
    await page.waitForTimeout(2000);
    await this.scanVerifyV2Page.navigateToNavbar(page, ' Settings');
    await this.scanVerifyV2Page.clickOnSystemSettings(page);
    await this.scanVerifyV2Page.clickOnScanPackOptions(page);
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 1',
      'None',
    );
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 2',
      'None',
    );
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Cue orders for Scan and Pack using',
      'Packing Slip or Shipping Label',
    );
    await this.scanVerifyV2Page.toggleBtn(
      page,
      true,
      'Remove the currently suggested item from the order.',
    );
  }

  async preConditionsPartH(page: Page) {
    await page.waitForTimeout(2000);
    await this.scanVerifyV2Page.navigateToNavbar(page, ' Settings');
    await this.scanVerifyV2Page.clickOnSystemSettings(page);
    await this.scanVerifyV2Page.clickOnScanPackOptions(page);
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 1',
      'None',
    );
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 2',
      'None',
    );
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Cue orders for Scan and Pack using',
      'Packing Slip or Shipping Label',
    );
    await this.scanVerifyV2Page.toggleBtn(page, true, 'Barcode string removal');
    await this.scanVerifyV2Page.toggleBtn(
      page,
      true,
      'Remove the currently suggested item from the order.',
    );
    await page
      .locator('[ng-model="scan_pack.settings.string_removal"]')
      .fill('-REM');
    await page
      .locator('[ng-model="scan_pack.settings.remove_barcode"]')
      .click();
    await page
      .locator('[ng-model="scan_pack.settings.remove_barcode"]')
      .fill('Remove Skipped items');
  }

  async preConditionsPartJ(page: Page) {
    await page.waitForTimeout(2000);
    await this.scanVerifyV2Page.navigateToNavbar(page, ' Settings');
    await this.scanVerifyV2Page.clickOnSystemSettings(page);
    await this.scanVerifyV2Page.clickOnScanPackOptions(page);
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 1',
      'None',
    );
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 2',
      'None',
    );
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Cue orders for Scan and Pack using',
      'Packing Slip or Shipping Label',
    );
    await this.scanVerifyV2Page.toggleBtn(page, false, 'Show Customer Notes');
    await this.scanVerifyV2Page.toggleBtn(page, true, 'Show Internal Notes');
  }

  async preConditionsPartI(page: Page) {
    await page.waitForTimeout(2000);
    await this.scanVerifyV2Page.navigateToNavbar(page, ' Settings');
    await this.scanVerifyV2Page.clickOnSystemSettings(page);
    await this.scanVerifyV2Page.clickOnScanPackOptions(page);
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 1',
      'None',
    );
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Post-Scanning Functions 2',
      'None',
    );
    await this.scanVerifyV2Page.postScanningFunctions(
      page,
      'Cue orders for Scan and Pack using',
      'Packing Slip or Shipping Label',
    );
    await this.scanVerifyV2Page.toggleBtn(page, true, 'Barcode string removal');
    await this.scanVerifyV2Page.toggleBtn(
      page,
      false,
      'Remove the currently suggested item from the order.',
    );
  }

  async expo2v2PartA(page: Page) {
    const updateQty = page.getByTestId('updateQty').first();
    await expect(updateQty).toBeVisible();
    await page.waitForTimeout(1000);
    await updateQty.click();
    await updateQty.fill('2');

    const addItemToOrder = page.getByTestId('addItemToOrder').first();
    await expect(addItemToOrder).toBeVisible();
    await addItemToOrder.click();

    const searchOrder = page.getByPlaceholder('Type order to search').first();
    await expect(searchOrder).toBeVisible();
    await searchOrder.fill('ORANG');
    await page.keyboard.press('Enter');

    await searchOrder.fill('ORANGE-J');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);
    const selectOrderFromList = page.getByTestId('selectItem').first();
    await expect(selectOrderFromList).toBeVisible();
    await selectOrderFromList.click();

    await page.waitForTimeout(1000);
    await searchOrder.click();
    await searchOrder.clear();
    await page.keyboard.press('Enter');

    await searchOrder.fill('APPLE-KIT-2');
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');
    await searchOrder.click();
    await page.waitForTimeout(1000);
    await page.keyboard.press('Enter');

    await page.waitForTimeout(2000);
    await expect(
      page.getByTestId('selectItem').getByText('APPLE-KIT-2').first(),
    ).toBeVisible();
    await expect(selectOrderFromList).toBeVisible();
    await selectOrderFromList.click();
    await page.waitForTimeout(4000);

    const clickOnSaveBtn = page.getByTestId('saveButton').first();
    await expect(clickOnSaveBtn).toBeVisible();
    await clickOnSaveBtn.click();

    await page.waitForTimeout(2000);
    await expect(clickOnSaveBtn).toBeVisible();
    await clickOnSaveBtn.click();

    const shuffleItem = page.getByTestId('shuffleItem').last().locator('img');
    await expect(shuffleItem).toBeVisible();
    await shuffleItem.click();
  }

  async verifyOrderName(orderName: string) {
    const orderNumber = this.scanVerifyPage.orderNumber;
    const orderNumberTxt = await orderNumber.innerText();
    expect(orderNumberTxt).toEqual('Order ' + orderName);
  }

  async observeSku(sku: string) {
    const productUPC = this.scanVerifyPage.productUPC;
    expect(productUPC).toBeVisible();
    const productUpcId = await productUPC.innerText();
    const skuCode = productUpcId.split(':');
    let skuTxt = skuCode[1];
    expect(sku).toEqual(skuTxt);
  }

  async clickOnOrderName(orderName: string) {
    await this.page.waitForTimeout(2000);
    const loaderIssue = await this.page.getByRole('progressbar').first();
    if (await waitforLocatorVisibility(this.page, loaderIssue)) {
      await this.page.reload();
      const scanVerifyPage = new ScanVerifyPage(this.page);
      await scanVerifyPage.scanOrderId(orderName);
      await scanVerifyPage.pressEnterButton();
    }
    const orderNumber = this.scanVerifyPage.orderNumber;
    await expect(orderNumber).toBeVisible();
    await orderNumber.click();
  }

  async enterProductBatchNumber(page: Page, serialNum: string) {
    const serialNumPopupTitle = page
      .getByText('Scan or Enter Serial, Lot or Batch Number')
      .first();
    await expect(serialNumPopupTitle).toBeVisible();

    const enterSerialNumber = page.getByTestId('inputElement').first();
    await expect(enterSerialNumber).toBeVisible();
    await enterSerialNumber.fill(serialNum);
    await page.keyboard.press('Enter');
  }

  async enterProductUPCManually(value: string) {
    const orderInput = this.scanVerifyPage.orderInput;
    const isVisibleOrderReadyToScan = await orderInput.isVisible();
    if (isVisibleOrderReadyToScan) {
      const orderInput = this.scanVerifyPage.orderInput;
      await expect(orderInput).toBeVisible();
      await orderInput.click();
    }

    const orderReadyToScan = this.scanVerifyPage.orderReadyToScan;
    await expect(orderReadyToScan).toBeVisible();
    await this.page.waitForTimeout(2000);
    await expect(orderReadyToScan).toBeFocused();
    await orderReadyToScan.fill(value);
  }

  async textValueVisibilityCheck(value: string) {
    const textViewLocator = this.page.getByText(value).first();
    await expect(textViewLocator).toBeVisible();
  }

  async observeProductInventory(productName: string, value: string) {
    const clickOnProductName = this.page
      .getByTestId('redirectToProductDetail')
      .getByText(productName)
      .first();
    await expect(clickOnProductName).toBeVisible();
    await clickOnProductName.click();

    const observeProductQOH = this.page
      .locator('div')
      .filter({ hasText: 'QOH' })
      .filter({ has: this.page.locator('input') })
      .last();
    await expect(observeProductQOH).toBeVisible();
    expect(await observeProductQOH.locator('input').inputValue()).toEqual(
      value,
    );
  }

  async restartOrder() {
    const confirmBtn = this.scanVerifyPage.confirmBtn;
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.dispatchEvent('click');
    const restartPrompt = this.scanVerifyPage.restartPrompt;
    await expect(restartPrompt).not.toBeVisible();
  }

  async expo2V2PartCStep1(scanId: string, orderName: string) {
    await this.scanVerifyPageFunctions.scanOrderId('^#^2B5F2D93^');
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.verifyOrderName(orderName);
    await this.scanVerifyPageFunctions.enterProductUPC();
    await this.scanVerifyPageFunctions.pressEnterButton();
  }

  async expo2V2PartCStep2(orderName: string) {
    await this.scanVerifyPageFunctions.scanOrderId(orderName);
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.enterProductUPCManually('PASS');
    await this.scanVerifyPageFunctions.pressEnterButton();

    await this.scanVerifyPageFunctions.clickOnRestartBtn();
    await this.restartOrder();
    await this.page.waitForTimeout(2000);
    await this.scanVerifyPageFunctions.scanOrderId('#727657875');
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.enterProductUPCManually('NOTE');
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.page.waitForTimeout(2000);
    const closeModal = this.page.locator('[class="icon-cancel"]').last();
    await expect(closeModal).toBeVisible();
    await closeModal.click();
    await this.page.waitForTimeout(1200);
    await this.scanVerifyPageFunctions.clickOnAddNoteBtn();
    const enterNoteField = this.scanVerifyPageFunctions.locators.enterNoteField;
    const saveBtn = this.scanVerifyPageFunctions.locators.saveBtn;
    await expect(saveBtn).toBeVisible();
    await enterNoteField.fill('This is a test note');
    await saveBtn.click();
    await this.enterProductUPCManually('MAGIC-ABC');
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.page.waitForTimeout(2000);
    await this.enterProductUPCManually('REDAPPLE - 123');
    await this.page.waitForTimeout(2000);
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.enterProductBatchNumber(this.page, 'WHODAT');
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.page.waitForTimeout(2000);
    await this.enterProductBatchNumber(this.page, 'PREFIX-WHODAT');
    await this.scanVerifyPageFunctions.pressEnterButton();
    const scanAllBtn = this.page.getByTestId('scanAllButton').first();
    await this.page.waitForTimeout(1000); 
    await expect(scanAllBtn).toBeVisible();
    await scanAllBtn.click();
    await this.page.waitForTimeout(5000);
    await this.enterProductBatchNumber(this.page, 'PREFIX-WHODAT');
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.page.waitForTimeout(2000);
    await this.page.waitForTimeout(3000);
    await this.loginPageFunctions.verifyScanAndPassPage();
  }

  async expo2V2PartCStep3(orderName: string) {
    await this.scanVerifyPageFunctions.observeSearchOrderPage(orderName);
    const locateElement = this.scanVerifyPageFunctions.page
      .getByTestId('ProductName')
      .last();
    await expect(locateElement).toBeVisible();
    const coupon = await locateElement.innerText();
    expect(coupon).toEqual('GP Coupon');
    const notesTab = this.scanVerifyPageFunctions.page
      .getByTestId('showNotes')
      .first();
    await expect(notesTab).toBeVisible();
    await notesTab.click();

    const internalNotes = this.page.getByText('This is a test note').first();
    expect(internalNotes).toBeVisible();
  }

  async expo2V2PartDStep1(orderName1: string, orderName2: string) {
    await this.loginPageFunctions.verifyScanAndPassPage();

    await this.scanVerifyPageFunctions.scanOrderId(orderName1);
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.verifyOrderName(orderName1);
    await this.scanVerifyPageFunctions.enterProductUPC();
    await this.scanVerifyPageFunctions.pressEnterButton();
    const shippingLbl = this.page
      .getByText('Please scan the shipping label barcode to continue.')
      .first();
    await expect(shippingLbl).toBeVisible();
    const enterShippingLbl = this.page.getByPlaceholder('Scan').last();
    await expect(enterShippingLbl).toBeVisible();
    await enterShippingLbl.fill('411NOTCORRECT411');
    await this.page.keyboard.press('Enter');

    await expect(enterShippingLbl).toBeVisible();
    await enterShippingLbl.fill('411ASPECIFICVALUE411');
    await this.page.keyboard.press('Enter');
    await this.loginPageFunctions.verifyScanAndPassPage();

    await this.scanVerifyPageFunctions.scanOrderId(orderName2);
    await this.scanVerifyPageFunctions.pressEnterButton();
  }

  async expo2V2PartDStep2(orderName2: string) {
    const shippingLbl = this.page
      .getByText('Please scan the shipping label barcode to continue.')
      .first();
    const enterShippingLbl = this.page.getByPlaceholder('Scan').last();

    await this.scanVerifyPageFunctions.enterProductUPC();
    await this.scanVerifyPageFunctions.pressEnterButton();
    await expect(shippingLbl).toBeVisible();
    await expect(enterShippingLbl).toBeVisible();
    await enterShippingLbl.fill('PREFIX411ANOTHERSPECIFICVALUE');
    await this.page.keyboard.press('Enter');

    await expect(enterShippingLbl).toBeVisible();
    await enterShippingLbl.fill('PREFIX411ANOTHERSPECIFICVALUE411');
    await this.page.keyboard.press('Enter');
    await this.loginPageFunctions.verifyScanAndPassPage();
    await this.scanVerifyPageFunctions.observeSearchOrderPage(orderName2);
    await this.page.waitForTimeout(3000);
    const orderStatus = this.page.getByTestId('orderStatusBtn').first();
    const orderStatusText = await orderStatus.innerText();
    console.log(orderStatusText);
    expect(orderStatusText).toEqual('Scanned');
    await this.page.waitForTimeout(1000);
  }

  async expo2V2PartEStep1(orderName: string) {
    await this.scanVerifyPageFunctions.scanOrderId(orderName);
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.page.waitForTimeout(2000);
    await this.verifyOrderName('EX-KIT-SC02');
    await this.scanVerifyPageFunctions.enterProductUPC();
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.page.waitForTimeout(2000);
    await this.scanVerifyPageFunctions.enterProductUPC();
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.page.waitForTimeout(2000);
    await this.scanVerifyPageFunctions.enterProductUPC();
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.page.waitForTimeout(2000);
    await this.scanVerifyPageFunctions.enterProductUPC();
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.page.waitForTimeout(2000);

    await this.enterProductUPCManually('REMOVE');
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.page.waitForTimeout(2000);
  }

  async expo2V2PartEVerifyOrderLegacyApp() {
    const clickOnOrderName = this.page
      .getByRole('table')
      .getByText('EX-KIT-SC02')
      .first();
    await expect(clickOnOrderName).toBeVisible();
    await clickOnOrderName.click({ delay: 1000 });

    const selectOrderInformationTab = this.page
      .getByRole('listitem')
      .getByText('Activities & Exceptions')
      .first();
    await expect(selectOrderInformationTab).toBeVisible();
    await selectOrderInformationTab.click({ delay: 1000 });

    await this.textValueVisibilityCheck(
      'QTY 4 of SKU PART2-APPLE was removed using the REMOVE barcode - by: gpadmin on GPX',
    );
    await this.textValueVisibilityCheck(
      'Item with sku APPLE-KIT-2 QTY decreased by 1 - by: gpadmin on GPX',
    );
    await this.textValueVisibilityCheck(
      'Item with sku APPLE-KIT-2 QTY decreased by 1 - by: gpadmin on GPX',
    );
    await this.textValueVisibilityCheck(
      'QTY 2 of item with SKU: APPLE-KIT-2 Added - by: CSV Import',
    );
  }

  async expo2V2PartFScanning(orderName: string) {
    await this.scanVerifyPageFunctions.scanOrderId(orderName);
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.page.waitForTimeout(2000);
    await this.verifyOrderName(orderName);
    await this.scanVerifyPageFunctions.enterProductUPC();
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.page.waitForTimeout(2000);

    await this.enterProductUPCManually('REMOVE');
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.page.waitForTimeout(2000);
    await this.loginPageFunctions.verifyScanAndPassPage();
  }

  async expo2V2PartGScanning(orderName: string) {
    await this.scanVerifyPageFunctions.scanOrderId(orderName);
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.verifyOrderName(orderName);
    await this.page.waitForTimeout(2000);
    await this.scanVerifyPageFunctions.clickOnRestartBtn();

    const confirmBtn = this.scanVerifyPageFunctions.locators.confirmBtn;
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click({ delay: 2000 });
    const restartPrompt = this.scanVerifyPageFunctions.locators.restartPrompt;
    await expect(restartPrompt).not.toBeVisible();
    await this.page.waitForTimeout(2000);
    await this.scanVerifyPageFunctions.scanOrderId(orderName);
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.enterProductUPCManually('PART1-APPLE');
    await this.scanVerifyPageFunctions.pressEnterButton();

    await this.scanVerifyPageFunctions.enterProductUPC();
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.scanVerifyPageFunctions.enterProductUPC();
    await this.scanVerifyPageFunctions.pressEnterButton();
    const scanAllBtn = this.scanVerifyPageFunctions.locators.scanAllButton;
    await expect(scanAllBtn).toBeVisible();
    await scanAllBtn.click();
    await this.page.waitForTimeout(3000);
    await this.page.reload();
    await this.loginPageFunctions.verifyScanAndPassPage();
  }

  async InventoryProductsVerify() {
    await this.scanVerifyPageFunctions.observeSearchProductPage('APPLE');
    const part2Apple = await this.page
      .getByTestId('redirectToProductDetail')
      .filter({ hasText: 'PART2-APPLE' })
      .locator("[dir='auto']")
      .nth(3);
    await expect(part2Apple).toBeVisible();
    const part2AppleCount = await part2Apple.innerText();
    const part1Apple = await this.page
      .getByTestId('redirectToProductDetail')
      .filter({ hasText: 'PART1-APPLE' })
      .locator("[dir='auto']")
      .nth(3);
    await expect(part2Apple).toBeVisible();
    const part1AppleCount = await part1Apple.innerText();
    await this.observeProductInventory('PART2-APPLE', part2AppleCount);
    const cancelBtn = this.scanVerifyV3PageFunctions.locators.cancelBtn;
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();
    await this.scanVerifyPageFunctions.observeSearchProductPage('APPLE');
    await this.observeProductInventory('PART1-APPLE', part1AppleCount);
  }

  async expo2V2ScanOrderH(orderName: string) {
    await this.scanVerifyPageFunctions.scanOrderId(orderName);
    await this.scanVerifyPageFunctions.pressEnterButton();
    await await this.verifyOrderName(orderName);
    await this.scanVerifyPageFunctions.clickOnRestartBtn();

    const confirmBtn = this.scanVerifyPageFunctions.locators.confirmBtn;
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click({ delay: 2000 });

    const restartPrompt = this.scanVerifyPageFunctions.locators.restartPrompt;
    await expect(restartPrompt).not.toBeVisible();
    await this.scanVerifyPageFunctions.scanOrderId(orderName);
    await this.scanVerifyPageFunctions.pressEnterButton();
    // Steps
    await this.enterProductUPCManually('SKIP');
    await this.scanVerifyPageFunctions.pressEnterButton();

    await this.scanVerifyPageFunctions.clickOnRestartBtn();
    await confirmBtn.click({ delay: 2000 });
    await expect(restartPrompt).not.toBeVisible();
    await this.enterProductUPCManually('ORANGE-1-REM');
    await this.scanVerifyPageFunctions.pressEnterButton();

    await this.loginPageFunctions.verifyScanAndPassPage();

    await this.scanVerifyPageFunctions.scanOrderId(orderName);
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.scanVerifyV3PageFunctions.closeAlreadyScannedModal();
    await this.page.waitForTimeout(2000);
  }

  async expo2V2VerifyLogsOrderH(orderName: string) {
    const clickOnOrderName = this.page
      .getByRole('table')
      .getByText(orderName)
      .first();
    await expect(clickOnOrderName).toBeVisible();
    await clickOnOrderName.click({ delay: 1000 });

    const selectOrderInformationTab = this.page
      .getByRole('listitem')
      .getByText('Activities & Exceptions')
      .first();
    await expect(selectOrderInformationTab).toBeVisible();
    await selectOrderInformationTab.click({ delay: 1000 });

    await this.textValueVisibilityCheck(
      'QTY 1 of SKU BANANA-1 was skipped using the SKIP barcode - by: gpadmin',
    );
  }

  async expo2V2NotesVerify(orderName: string) {
    await this.scanVerifyPageFunctions.scanOrderId(orderName);
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.verifyOrderName(orderName);
    await this.scanVerifyPageFunctions.clickOnRestartBtn();

    const confirmBtn = this.scanVerifyPageFunctions.locators.confirmBtn;
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click({ delay: 2000 });
    const restartPrompt = this.scanVerifyPageFunctions.locators.restartPrompt;
    await expect(restartPrompt).not.toBeVisible();
    await this.scanVerifyPageFunctions.scanOrderId(orderName);
    await this.scanVerifyPageFunctions.pressEnterButton();

    const showInternalNotes = this.page.getByText('De Customer says..').first();
    await expect(showInternalNotes).toBeVisible();

    const tapInternalNotes = this.page.getByText('Got it.').first();
    await expect(tapInternalNotes).toBeVisible();
    await tapInternalNotes.click();
    await expect(showInternalNotes).not.toBeVisible();
    await this.clickOnOrderName(orderName);

    const orderInfoTab = this.page.getByTestId('showNotes').last();
    await expect(orderInfoTab).toBeVisible();
    await orderInfoTab.click();

    const addCustomerNotes = this.page.getByTestId('openTextField2').last();
    await expect(addCustomerNotes).toBeVisible();
    await addCustomerNotes.click();

    const enterPackerNotes = this.page.getByTestId('notesToPackerInput').last();
    await expect(enterPackerNotes).toBeVisible();
    await enterPackerNotes.fill(
      'Some of the items needed to build the Hoobastank are fragile, please check each one for cracks and replace any that are non-functional.',
    );

    const showCustomerNotes = this.page
      .getByText(
        'Some of the items needed to build the Hoobastank are fragile, please check each one for cracks and replace any that are non-functional.',
      )
      .first();
    const clickOnSaveBtn = this.page.getByTestId('saveButton').first();
    await expect(clickOnSaveBtn).toBeVisible();
    await clickOnSaveBtn.click();

    await expect(showInternalNotes).toBeVisible();
    await expect(showCustomerNotes).toBeVisible();
    await tapInternalNotes.click();
    await this.scanVerifyPageFunctions.enterProductUPC();
    await this.scanVerifyPageFunctions.pressEnterButton();
    await this.loginPageFunctions.verifyScanAndPassPage();
  }
}
