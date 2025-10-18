import { type Page, expect } from '@playwright/test';
import { ReceiveRecountPageLocators } from '../Locators/ReceiveRecountLocators';
import { ScanVerifyPageLocators } from '../Locators/scanVerifyPageLocators';

export class ReceiveRecountGpxPage {
  readonly page: Page;
  readonly locators: ReceiveRecountPageLocators;
  readonly scanVerifyPageLocators: ScanVerifyPageLocators;
  constructor(page: Page) {
    this.page = page;
    this.locators = new ReceiveRecountPageLocators(page);
    this.scanVerifyPageLocators = new ScanVerifyPageLocators(page);
  }

  async visit() {
    await this.page.goto('/');
  }

  async clickOnElementByTestId(testId: string) {
    const locateElement = this.page.getByTestId(testId).first();
    await expect(locateElement).toBeVisible();
    await locateElement.click();
  }

  async navigateToReceiveInventoryPage() {
    await this.page.waitForTimeout(3000);
    await this.clickOnElementByTestId('menuIcon');
    await this.page.getByText("Receive").last().click()

    await this.page.getByPlaceholder('Receiving Record').fill("1234")
    await this.page.getByText("Start Receiving").click()
    await this.page.waitForTimeout(3000)
  }

  async navigateToRecountInventoryPage() {
    await this.page.waitForTimeout(3000);
    await this.clickOnElementByTestId('menuIcon');
    await this.page.getByText("Recount").last().click()
    await this.page.getByPlaceholder('Recounting Record').fill("1234")
    await this.page.getByText("Start Recounting").click()
    await this.page.waitForTimeout(3000)
  }

  async observeReceiveInventoryPage() {
    const receiveInventoryTitle = this.page
      .getByText('Receive Inventory')
      .first();
    await expect(receiveInventoryTitle).toBeVisible();

    const productScan = this.page
      .getByText('Scan a product to continue')
      .first();
    await expect(productScan).toBeVisible();

    const productScanInputFeild = this.page
      .getByPlaceholder('Ready for Product Scan')
      .first();
    await expect(productScanInputFeild).toBeVisible();
    await expect(productScanInputFeild).toBeFocused();

    const workFlowDropDown = this.page.getByTestId('workFlowContainer').first();
    await expect(workFlowDropDown).toBeVisible();
    await this.page.waitForTimeout(3000);
    await workFlowDropDown.dispatchEvent('click');

    const workFlowDropDownOption = this.page
      .getByTestId('workflowOption')
      .getByText('Enter Quantity Received')
      .first();
    await expect(workFlowDropDownOption).toBeVisible();
    await workFlowDropDownOption.click({ delay: 1200 });
  }

  async observeRecountInventoryPage() {
   
    const receiveInventoryTitle = this.page
      .getByText('Recount Inventory')
      .first();
    await expect(receiveInventoryTitle).toBeVisible();

    const productScan = this.page
      .getByText('Scan a product to continue')
      .first();
    await expect(productScan).toBeVisible();

    const productScanInputFeild = this.page
      .getByPlaceholder('Ready for Product Scan')
      .first();
    await expect(productScanInputFeild).toBeVisible();
    await expect(productScanInputFeild).toBeFocused();

    const workFlowDropDown = this.page.getByTestId('workFlowContainer').first();
    await expect(workFlowDropDown).toBeVisible();
    await workFlowDropDown.click({ delay: 1200 });
    await this.page.waitForTimeout(3000);
    const workFlowDropDownOption = this.page
      .getByTestId('workflowOption')
      .getByText('Enter New Quantity on Hand')
      .first();
    await expect(workFlowDropDownOption).toBeVisible();
    await workFlowDropDownOption.click({ delay: 1200 });
  }

  async selectWorkflowDropDownOption(optionSelect: string) {
    const workFlowDropDown = this.page.getByTestId('workFlowContainer').first();
    await expect(workFlowDropDown).toBeVisible();
    await this.page.waitForTimeout(2000);
    await workFlowDropDown.dispatchEvent('click');
    const workFlowDropDownOption = this.page
      .getByTestId('workflowOption')
      .getByText(optionSelect)
      .first();
    await expect(workFlowDropDownOption).toBeVisible();
    await workFlowDropDownOption.click({ delay: 1200 });
  }

  async enterProductBarcode(productBarcode: string) {
    const productScanInputFeild = this.page
      .getByPlaceholder('Ready for Product Scan')
      .first();
    await expect(productScanInputFeild).toBeVisible();
    await expect(productScanInputFeild).toBeFocused();
    await productScanInputFeild.fill(productBarcode);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1500);
  }

  async clickOnProductSkuToOpenDetailsPage(product: string) {
    const clickOnProduct = this.page
      .getByText(product, { exact: true })
      .first();
    await expect(clickOnProduct).toBeVisible();
    await clickOnProduct.click({ delay: 2000 });

    const qtyToReceive = this.page.getByTestId('quantityInput').first();
    await expect(qtyToReceive).toBeVisible();
  }

  async enterQtyToReceive(qty: string) {
    const qtyToReceive = this.page.getByTestId('quantityInput').first();
    await expect(qtyToReceive).toBeVisible();
    await qtyToReceive.fill(qty);
    await this.page.getByText('Save & Close').first().click();
  }

  async enterProductInformation(product: string, value: string) {
    const productInformation = this.page
      .locator('div')
      .filter({ has: this.page.locator('input') })
      .filter({ has: this.page.getByText(product) })
      .last()
      .locator('input')
      .first();
    await expect(productInformation).toBeVisible();
    await productInformation.fill(value);
  }

  async createNewProductPopup() {
    const newProductPopup = this.page
      .getByText('Click or tap here to create a new product with barcode')
      .first();
    await expect(newProductPopup).toBeVisible();
    await newProductPopup.click();
    await this.page.waitForTimeout(1200);
  }

  async expectProductInputValue(product: string, value: any) {
    const productInformation = this.page
      .locator('div')
      .filter({ has: this.page.locator('input') })
      .filter({ has: this.page.getByText(product) })
      .last()
      .locator('input')
      .first();
    await expect(productInformation).toBeVisible();
    await expect(await productInformation.inputValue()).toBe(value);
  }

  async createNewProductData(barcode: string) {
    const productBarcode = this.page.getByTestId('barcodeInput').first();
    await expect(productBarcode).toBeVisible();
    await expect(await productBarcode.inputValue()).toBe(barcode);
    await this.expectProductInputValue('QOH', '0');
    await this.expectProductInputValue('Product Name', 'New Product');
    await this.expectProductInputValue('Location 1', '');

    await this.enterProductInformation('QOH', '10');
    await this.enterProductInformation('Product Name', 'Kiwi');
    await this.page.getByTestId('saveAndCloseButton').first().click();
    await expect(this.page.getByRole('progressbar')).not.toBeVisible();
  }

  async enterProductQty(qty: string) {
    const enterLocation = this.page.getByTestId('quantityInput').first();
    await expect(enterLocation).toBeVisible();
    await enterLocation.fill(qty);
  }

  async enterProductLocation(location: string) {
    const enterLocation = this.page.getByTestId('LocationInput').first();
    await expect(enterLocation).toBeVisible();
    await enterLocation.fill(location);

    await this.page.getByText('Save & Close').first().click();
  }

  async observeProductLocation(location: string) {
    const enterLocation = this.page.getByTestId('LocationInput').first();
    await expect(enterLocation).toBeVisible();
    expect(await enterLocation.inputValue()).toBe(location);
    await this.page.getByText('Save & Close').first().click();
  }

  async observeProductQohCount() {
    await this.page.waitForTimeout(2000);
    const newQohCount = this.page.getByText('New QOH: ').first();
    await expect(newQohCount).toBeVisible();
    const productCount = await newQohCount.innerText();
    expect(productCount).toBeTruthy();

    const qohQty = productCount.replace(/\D/g, '');
    console.log(qohQty, productCount);
    return qohQty;
  }

  async enterProductSku(barcode: string) {
    const enterProductSku = this.page
      .getByTestId('ReadyForProductScan')
      .first();
    await expect(enterProductSku).toBeVisible();
    await enterProductSku.click();
    await enterProductSku.fill(barcode);
    await this.page.keyboard.press('Enter');
  }

  async observeProductQoh(count: string) {
    const productInformation = this.page
      .locator('div')
      .filter({ has: this.page.locator('input') })
      .filter({ has: this.page.getByText('Current QOH') })
      .last()
      .locator('input')
      .first();
    await expect(productInformation).toBeVisible();
    expect(await productInformation.inputValue()).toBe(count);
  }

  async observeProductCount(count: string) {
    const productInformation = this.page
      .locator('div')
      .filter({ has: this.page.locator('input') })
      .filter({ has: this.page.getByText('Previous QOH') })
      .last()
      .locator('input')
      .first();
    await expect(productInformation).toBeVisible();
    expect(await productInformation.inputValue()).toBe(count);
    await this.page.getByText('Save & Close').first().click();
  }

  async part6ScanningQohSteps() {
    await this.enterProductBarcode('REDAPPLE');

    await this.clickOnElementByTestId('incrementButton');
    await this.clickOnElementByTestId('incrementButton');
    await this.clickOnElementByTestId('SaveButton');
    await expect(this.page.getByTestId('LocationInput')).toBeVisible();
    await this.page.keyboard.press('Enter');
  }
}
