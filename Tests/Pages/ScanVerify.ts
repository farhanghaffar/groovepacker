import { type Page, expect } from '@playwright/test';
import { ScanVerifyPageLocators } from '../Locators/scanVerifyPageLocators';
import { waitforLocatorVisibility } from '../../Utils/testUtils';

export class ScanVerifyPage {
  readonly page: Page;
  readonly locators: ScanVerifyPageLocators;
  constructor(page: Page) {
    this.page = page;
    this.locators = new ScanVerifyPageLocators(page);
  }

  async visit() {
    await this.page.goto('/');
  }

  async scanOrderId(orderId: string) {
    const scanInput = this.locators.scanInput;
    await expect(scanInput).toBeVisible();
    await scanInput.fill(orderId);
  }

  async pressEnterButton() {
    await this.page.keyboard.press('Enter');
    const progressbar = this.locators.progressbar;
    await expect(progressbar).not.toBeVisible();
  }

  async observeReadyToScanPage() {
    // Order Number
    const orderNumber = this.locators.orderNumber;
    const orderNumberTxt = await orderNumber.innerText();
    expect(orderNumberTxt.length).toBeGreaterThan(0);

    //Restart Order
    const restartOrder = this.locators.restartOrder;
    await expect(restartOrder).toBeVisible();

    //Reload Order
    const reloadOrder = this.locators.reloadOrder;
    await expect(reloadOrder).toBeVisible();

    //addNote
    const addNote = this.locators.addNote;
    await expect(addNote).toBeVisible();
    const orderReadyToScan = this.page.getByPlaceholder(
      'READY FOR PRODUCT SCAN',
    );
    const isVisibleOrderReadyToScan = await orderReadyToScan.isVisible();
    if (!isVisibleOrderReadyToScan) {
      const orderInput = this.locators.orderInput;
      await expect(orderInput).toBeVisible();
      await orderInput.click();
    }
    await expect(orderReadyToScan).toBeVisible();
    await this.page.waitForTimeout(2000);
    await expect(orderReadyToScan).toBeFocused();

    // Pass Button
    const passBtn = this.locators.passBtn;
    await expect(passBtn).toBeVisible();

    // Product Details Section
    const prodcutScan = this.locators.prodcutScan;
    await expect(prodcutScan).toBeVisible();

    // Product Name and Image
    const productName = this.locators.productName;
    await expect(productName).toBeVisible();

    const productImage = this.locators.productImage;
    await expect(productImage).toBeVisible();

    //Total Number of Scanned Prodcuts
    const scannedProducts = this.locators.scannedProducts;
    await expect(scannedProducts).toBeVisible();

    // Product SKU Number
    const productSKU = this.locators.productSKU;
    const productSkuNum = await productSKU.innerText();
    expect(productSkuNum.length).toBeGreaterThan(0);

    // Product UPC Container
    const productUPC = this.locators.productUPC;
    await expect(productUPC).toBeVisible();
  }

  async enterProductUPC() {
    const productUPC = this.locators.productUPC;
    expect(productUPC).toBeVisible();
    const productUpcId = await productUPC.innerText();
    const skuCode = productUpcId.split(':');
    let skuTxt = skuCode[1];

    const orderInput = this.locators.orderInput;
    const isVisibleOrderReadyToScan = await orderInput.isVisible();
    if (isVisibleOrderReadyToScan) {
      const orderInput = this.locators.orderInput;
      await expect(orderInput).toBeVisible();
      await orderInput.click();
    }

    const orderReadyToScan = this.locators.orderReadyToScan;
    // await expect(orderReadyToScan).toBeVisible();
    await this.page.waitForTimeout(2000);
    // await expect(orderReadyToScan).toBeFocused();
    await orderReadyToScan.fill(skuTxt);
  }

  async enterProductCount() {
    const orderReadyToScan = this.locators.orderReadyToScan;
    // await expect(orderReadyToScan).toBeVisible();
    await this.page.waitForTimeout(2000);
    // await expect(orderReadyToScan).toBeFocused();
    await orderReadyToScan.fill('*');
  }

  async clickOnAddNoteBtn() {
    const addNoteBtn = this.locators.addNote;
    await expect(addNoteBtn).toBeVisible();
    await addNoteBtn.click();
  }

  async observeAddNoteModal() {
    const addNoteText = this.locators.addNoteText;
    await expect(addNoteText).toBeVisible();
    const enterNoteField = this.locators.enterNoteField;
    await expect(enterNoteField).toBeVisible();

    // Click on close icon
    const closeIcon = this.locators.closeIcon;
    await expect(closeIcon).toBeVisible();
    await closeIcon.click();

    // Click on cancel button
    await this.clickOnAddNoteBtn();
    const cancelBtn = this.locators.cancelBtn;
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();

    // Click on save button by adding meaningful text
    await this.clickOnAddNoteBtn();
    const saveBtn = this.locators.saveBtn;
    await expect(saveBtn).toBeVisible();
    await enterNoteField.fill('product notes added by groove packer + testing');
    await saveBtn.click();
  }

  async observePassedItem() {
    await this.page.waitForTimeout(5000);
    const passItem = await this.locators.passedItemCount;
    expect(passItem).toBeGreaterThan(0);
  }

  async clickOnRestartBtn() {
    const restartOrder = this.locators.restartOrder;
    await expect(restartOrder).toBeVisible();
    await restartOrder.click();
  }

  async observeRestartPrompt() {
    const restartPrompt = this.locators.restartPrompt;
    await expect(restartPrompt).toBeVisible();

    // Click on close icon
    const closeIcon = this.locators.closeIcon;
    await closeIcon.click();
    await expect(restartPrompt).not.toBeVisible();

    // Click on cancel button
    await this.clickOnRestartBtn();
    const cancelBtn = this.locators.cancelBtn;
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();
    await expect(restartPrompt).not.toBeVisible();

    // Click on confirm button
    await this.clickOnRestartBtn();
    const confirmBtn = this.locators.confirmBtn;
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click({ delay: 2000 });
    await expect(restartPrompt).not.toBeVisible();
  }

  async clickOnReloadOrder() {
    const reloadOrder = this.locators.reloadOrder;
    await expect(reloadOrder).toBeVisible();
    await reloadOrder.click();

    const progressbar = this.locators.progressbar;
    await expect(progressbar).not.toBeVisible();
  }

  async observeInvalidId(orderMessage: string) {
    const alert = this.locators.invalidIdAlert(orderMessage);
    await alert.isVisible();
  }

  async verifyInputField(fieldLabel: string) {
    const productField = this.locators.inputFieldByLabel(fieldLabel);
    await expect(productField).toBeVisible();
  }

  async clickOnSpecificProduct() {
    const productScan = this.locators.prodcutScan;
    await expect(productScan).toBeVisible();
    await productScan.click();
  }

  async observeProductDetailsPage() {
    const progressbar = this.locators.progressbar;
    await expect(progressbar).toBeVisible();
    await expect(progressbar).not.toBeVisible();

    const productInfo = this.locators.productInfo;
    await expect(productInfo).toBeVisible();

    const scanPackOption = this.locators.scanPackOption;
    await expect(scanPackOption).toBeVisible();

    const productStatus = this.locators.orderStatusBtn;
    await expect(productStatus).toBeVisible();

    const productAlias = this.locators.aliasOfAnother;
    await expect(productAlias).toBeVisible();

    const alistCurrentProduct = this.locators.aliasOfProduct;
    await expect(alistCurrentProduct).toBeVisible();

    const productToKit = this.locators.changeToKit;
    await expect(productToKit).toBeVisible();

    const addImageIcon = this.locators.addImageIcon;
    await expect(addImageIcon).toBeVisible();

    const saveClose = this.locators.saveAndCloseButton;
    await expect(saveClose).toBeVisible();

    const cancelBtn = this.locators.cancelProductBtn;
    await expect(cancelBtn).toBeVisible();

    await this.verifyInputField('QOH');
    await this.verifyInputField('Location 1');
    await this.verifyInputField('SKUs');
    await this.verifyInputField('Barcodes');
    await this.verifyInputField('Scan Qty');

    const moreoptions = this.locators.moreOptions;
    await expect(moreoptions).toBeVisible();

    const printbyQz = this.locators.printbyQz;
    await expect(printbyQz).toBeVisible();

    const showMoreIcon = this.locators.moreSku;
    await expect(showMoreIcon).toBeVisible();
  }

  async moreLocationsProductDetailsPage() {
    const moreOptions = this.locators.moreOptions;
    await expect(moreOptions).toBeVisible();
    await moreOptions.click();

    await this.verifyInputField('Location 2');
    await this.verifyInputField('Location 3');
    await this.verifyInputField('Location 1 Qty');
    await this.verifyInputField('Location 2 Qty');
    await this.verifyInputField('Location 3 Qty');
    await this.verifyInputField('Inventory Alert Level');
    await this.verifyInputField('Inventory Target Level');
  }

  async moreSkusProductDetailsPage() {
    const moreSku = this.locators.moreSku;
    await expect(moreSku).toBeVisible();
    await moreSku.click();

    await this.verifyInputField('Categories');
    await this.verifyInputField('FNSKU');
    await this.verifyInputField('ASIN');
    await this.verifyInputField('ISBN');
    await this.verifyInputField('EAN');
    await this.verifyInputField('Supplier SKU');
    await this.verifyInputField('AVG Cost');
    await this.verifyInputField('Count Group');
    await this.verifyInputField('Product Weight');
  }

  async observeAddMoreSkuModal() {
    const skuHeading = this.locators.scanUniqueSKU;
    await expect(skuHeading).toBeVisible();

    const cancelIcon = this.locators.cancelIcon;
    await expect(cancelIcon).toBeVisible();

    const enterSkuField = this.locators.enterNoteField;
    await expect(enterSkuField).toBeVisible();

    const EnterButton = this.locators.enterButton;
    await expect(EnterButton).toBeVisible();

    const cancelButton = this.locators.cancelButton;
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
  }

  async observeAddMoreBarcodesModal() {
    const barcodeModalTitle = this.page
      .getByText('Scan or Enter a unique Barcode')
      .first();
    await expect(barcodeModalTitle).toBeVisible();

    const cancelIcon = this.locators.cancelIcon;
    await expect(cancelIcon).toBeVisible();

    const enterBarcodeField = this.locators.enterNoteField;
    await expect(enterBarcodeField).toBeVisible();

    const EnterButton = this.locators.enterButton;
    await expect(EnterButton).toBeVisible();

    const cancelButton = this.locators.cancelButton;
    await expect(cancelButton).toBeVisible();
    await cancelButton.click();
  }

  async clickOnScanPackOptionsTab() {
    const scanPackOption = this.locators.scanPackOption;
    await expect(scanPackOption).toBeVisible();
    await scanPackOption.click();
  }

  async observeScanPackOptionsTab() {
    const scanOptions = this.locators.scanOptions;
    await expect(scanOptions).toBeVisible();

    const clickScanDropDown = this.locators.clickScanDropDown;
    await expect(clickScanDropDown).toBeVisible();
    await clickScanDropDown.click();

    const scanDropDownOptions =
      await this.locators.getScanDropDownOptionsCount.count();
    expect(scanDropDownOptions).toEqual(3);
    const typeInDropDown = this.locators.typeInDropDown;
    await expect(typeInDropDown).toBeVisible();
    await typeInDropDown.click();

    const typeInCountOption = await this.page
      .getByTestId('typeInCountOption')
      .count();
    expect(typeInCountOption).toEqual(3);

    const serialRecordDropDown = this.locators.serialRecordDropDown;
    await expect(serialRecordDropDown).toBeVisible();
    await serialRecordDropDown.click();

    const serialRecordOption = await this.page
      .getByTestId('serialRecordOption')
      .count();
    expect(serialRecordOption).toEqual(3);
    await this.verifyInputField('Intangible Item');
    await this.verifyInputField('Optional Item / skippable');
    await this.verifyInputField('Packing Instruction');
    await this.verifyInputField('Require Confirmation');
    await this.verifyInputField('Display');
    await this.verifyInputField('Custom Product 1');
    await this.verifyInputField('Custom Product 2');
    await this.verifyInputField('Custom Product 3');
    const productField = this.locators.productField;
    await expect(productField).toBeVisible();
  }

  async updateProductName(productName: string) {
    const enterProductName = this.locators.enterProductName;
    await expect(enterProductName).toBeVisible();
    await enterProductName.fill(productName);

    const saveClose = this.locators.saveAndCloseButton;
    await expect(saveClose).toBeVisible();
    await saveClose.click();

    const progressbar = this.locators.progressbar;
    await expect(progressbar).toBeVisible();
    await expect(progressbar).not.toBeVisible();
  }

  async observeUpdatedProductName(productName1: string) {
    const productName = this.locators.prodcutScan;
    await expect(productName).toBeVisible();
    const updatedName = await productName.innerText();
    expect(productName1).toEqual(updatedName);
  }

  async clickOnSkuAndObservePopup(newSku: string) {
    const addNewSku = this.locators.addNewSku;
    await addNewSku.dispatchEvent('click');

    const newSkuPopupTxt = this.locators.scanUniqueSKU;
    await expect(newSkuPopupTxt).toBeVisible();

    const clickOnCancelIcon = this.locators.cancelIcon.locator('i').first();
    await expect(clickOnCancelIcon).toBeVisible();

    const clickOnCancelBtn = this.locators.cancelButton;
    await expect(clickOnCancelBtn).toBeVisible();

    const clickOnConfirmBtn = this.locators.enterButton;
    await expect(clickOnConfirmBtn).toBeVisible();

    const enterSku = this.locators.enterNoteField;
    await expect(enterSku).toBeVisible();
    await enterSku.fill(newSku);

    await clickOnConfirmBtn.click();

    const skuInput = this.locators.skuInput;
    await expect(skuInput).toBeVisible();
    const addedSku = await skuInput.inputValue();
    expect(addedSku).toEqual(newSku);
  }

  async editCreatedSku(updatedSkuValue: string) {
    const editSku = this.locators.skuInput;
    await expect(editSku).toBeVisible();
    await editSku.fill(updatedSkuValue);
    await this.page.keyboard.press('Enter');

    const addedBarcodeName = this.page.getByText(updatedSkuValue);
    await waitforLocatorVisibility(this.page, addedBarcodeName);

    const skuInput = this.locators.skuInput;
    await expect(skuInput).toBeVisible();
    const addedSku = await skuInput.inputValue();
    expect(addedSku).toEqual(updatedSkuValue);
  }

  async observeDuplicateSku() {
    const isProgressbar = await waitforLocatorVisibility(
      this.page,
      this.locators.alreadyExistsSkuMsg,
    );
    if (isProgressbar) {
      await expect(this.locators.alreadyExistsSkuMsg).toBeVisible();
      await expect(this.locators.alreadyExistsSkuMsg).not.toBeVisible();
    }
  }

  async observeDuplicateBarcode() {
    const isProgressbar = await waitforLocatorVisibility(
      this.page,
      this.locators.alreadyExistsBarcodeMsg,
    );
    if (isProgressbar) {
      await expect(this.locators.alreadyExistsBarcodeMsg).toBeVisible();
      await expect(this.locators.alreadyExistsBarcodeMsg).not.toBeVisible();
    }
  }

  async observeSameBarcodeForDifferentProduct() {
    const duplicatedBarcodePopup = this.locators.scrollBar;
    await this.page.waitForTimeout(3000);
    const isDuplicatedBarcodePopup = await duplicatedBarcodePopup.isVisible();
    if (isDuplicatedBarcodePopup) {
      const verifyDifferentItemButton = this.locators.verifyDifferentItemButton;
      await expect(verifyDifferentItemButton).toBeVisible();
      await verifyDifferentItemButton.click();

      // Verify separate items to have the same barcode
      const permitDifferentItemButton = this.locators.permitDifferentItemButton;
      await expect(permitDifferentItemButton).toBeVisible();
      await permitDifferentItemButton.click();
    }
  }

  async removeAddedSku() {
    const removeLastSku = this.locators.lastAddedSKu;
    await expect(removeLastSku).toBeVisible();
    await removeLastSku.click();

    const progressbar = this.locators.progressbar;
    await expect(progressbar).not.toBeVisible();
  }

  async removeAddedBarcode() {
    const removeLastBarcode = this.locators.lastAddedBarcode;
    await expect(removeLastBarcode).toBeVisible();
    await removeLastBarcode.click();

    const progressbar = this.locators.progressbar;
    await expect(progressbar).toBeVisible();
    await expect(progressbar).not.toBeVisible();
  }

  async clickOnBarcodeAndObservePopup(newBarcode: string) {
    const addNewBarcode = this.locators.addNewBarcode;
    await addNewBarcode.dispatchEvent('click');

    const newBarcodePopupTxt = this.locators.barcodeModalTitle.first();
    await expect(newBarcodePopupTxt).toBeVisible();

    const clickOnCancelIcon = this.locators.cancelIcon.locator('i').first();
    await expect(clickOnCancelIcon).toBeVisible();
    const clickOnCancelBtn = this.locators.cancelButton;
    await expect(clickOnCancelBtn).toBeVisible();

    const enterBarcode = this.locators.enterNoteField;
    await expect(enterBarcode).toBeVisible();
    await enterBarcode.fill(newBarcode);

    const clickOnConfirmBtn = this.locators.enterButton;
    await waitforLocatorVisibility(this.page, clickOnConfirmBtn);
    await clickOnConfirmBtn.dispatchEvent('click');
  }

  async observeAddedBarcode(newBarcode: string) {
    await this.page.waitForTimeout(3000);
    const barcodeInput = this.locators.barcodeInput;
    await expect(barcodeInput).toBeVisible();
    const addedBarcode = await barcodeInput.inputValue();
    expect(addedBarcode).toEqual(newBarcode);
  }

  async editCreatedBarcode(updatedBarcodeValue: string) {
    const lastAddedBarcode = this.locators.barcodeInput;
    const progressbar = this.locators.progressbar;
    await expect(lastAddedBarcode).toBeVisible();
    await lastAddedBarcode.click();
    await lastAddedBarcode.fill(updatedBarcodeValue);
    await this.page.keyboard.press('Enter');

    const addedBarcodeName = this.page.getByText(updatedBarcodeValue, {
      exact: true,
    });

    if (await waitforLocatorVisibility(this.page, addedBarcodeName)) {
      await this.page.waitForTimeout(3000);
      await expect(progressbar).toBeVisible();
      await expect(progressbar).not.toBeVisible();
      const addedBarcode = await lastAddedBarcode.inputValue();
      expect(addedBarcode).toEqual(updatedBarcodeValue);
    }
  }

  async verifyMultiPackOrderBarCode(printLabel?: Boolean) {
    let unscannedItems = this.locators.unscannedCount;
    await expect(unscannedItems).toBeVisible();
    let unscannedItemsCount = await unscannedItems.innerText();
    const passBtn = this.locators.passBtn;
    const scanAllBtn = this.locators.scanAllButton;
    let digits = unscannedItemsCount.match(/\d+/g);

    while (digits && Number(digits[0]) > 1) {
      const unscannedItemsVisibility = await waitforLocatorVisibility(
        this.page,
        unscannedItems,
      );
      if (!unscannedItemsVisibility) {
        break;
      }
      unscannedItemsCount = await unscannedItems.innerText();
      digits = unscannedItemsCount.match(/\d+/g);
      await this.enterProductUPC();
      const ispassBtnVisible = await waitforLocatorVisibility(
        this.page,
        passBtn,
      );

      const [resp] = await Promise.all([
        this.page.waitForResponse(
          (response) =>
            response.url().includes('/scan_pack') && response.status() === 200,
        ),
        ispassBtnVisible && (await this.page.keyboard.press('Enter')),
      ]);

      const response = await resp.json();
      console.log(response);
      if (printLabel) break;
    }
  }

  async printShipingLabel() {
    const progressbar = this.locators.progressbar;
    await expect(progressbar).not.toBeVisible();

    const shipingBtn = this.page.getByTestId('printSlip').first();
    await expect(shipingBtn).toBeVisible();
    await shipingBtn.click();
  }

  async locateElementByTestId(testId: string) {
    const locateElement = this.page.getByTestId(testId).first();
    await expect(locateElement).toBeVisible();
  }

  async locateElementByText(text: string) {
    const locateElement = this.page.getByText(text).first();
    await expect(locateElement).toBeVisible();
  }

  async clickOnElementByTestId(testId: string) {
    const locateElement = this.page.getByTestId(testId).first();
    await expect(locateElement).toBeVisible();
    await locateElement.click();
  }

  async observeSearchOrderPage(order: string) {
    await this.clickOnElementByTestId('menuIcon');
    await this.clickOnElementByTestId('redirectToOrderSearch');
    await this.locateElementByTestId('Title');

    const scanTxt = this.page.getByText('Scan', { exact: true }).first();
    await expect(scanTxt).toBeVisible();

    const inputOrderTxtField = scanTxt.locator(' +input').first();
    await expect(inputOrderTxtField).toBeVisible();

    await inputOrderTxtField.fill(order);
    await this.page.keyboard.press('Enter');
  }

  async observeSearchProductPage(product: string) {
    await this.clickOnElementByTestId('menuIcon');
    await this.clickOnElementByTestId('redirectToProductSearch');

    const enterProductName = this.page.locator('input').first();
    await expect(enterProductName).toBeVisible();

    await enterProductName.fill(product);
    await this.page.keyboard.press('Enter');
  }

  async observeOrderDetailPage() {
    await this.locateElementByTestId('removeItem');
    await this.locateElementByTestId('ProductName');
    await this.locateElementByTestId('updateQty');

    const skuTxt = this.page.getByText('SKU', { exact: true }).first();
    await expect(skuTxt).toBeVisible();

    const statusTxt = this.page.getByText('Status', { exact: true }).first();
    await expect(statusTxt).toBeVisible();

    const barcodeTxt = this.page.getByText('Barcode', { exact: true }).first();
    await expect(barcodeTxt).toBeVisible();

    const qtyOrderedTxt = this.page
      .getByText('QTY Ordered', { exact: true })
      .first();
    await expect(qtyOrderedTxt).toBeVisible();

    const locationTxt = this.page
      .getByText('Location l', { exact: true })
      .first();
    await expect(locationTxt).toBeVisible();

    const qohTxt = this.page.getByText('QOH', { exact: true }).first();
    await expect(qohTxt).toBeVisible();
  }

  async clickOnCreateShippingLabelBtn() {
    const createShipingLbl = this.page
      .locator('[data-component-name="shippingLabelActiveBtn"]')
      .filter({
        hasText: 'Create Shipping Label',
      })
      .first();

    await expect(createShipingLbl).toBeVisible();
    await createShipingLbl.click();
  }

  async getByPlaceholderLocator(placeholder: string) {
    const inputPlaceholder = this.page.getByPlaceholder(placeholder).first();
    await expect(inputPlaceholder).toBeVisible();
  }

  async observeCreateShippingLabelPage(order: string) {
    // Locators for common elements
    const orderByIdLocator = this.page
      .locator('div', { hasText: `Order ${order}` })
      .last();
    const shipDateFieldLocator = this.page
      .locator('div', { hasText: 'Ship Date' })
      .filter({ has: this.page.locator('[name="datetime"]').first() })
      .last();
    const weightTextLocator = this.page
      .getByText('Weight', { exact: true })
      .first();
    const lbsLocator = this.page
      .locator('div', { has: this.page.getByPlaceholder('Weight').first() })
      .filter({ hasText: 'LBS' })
      .last();
    const ozLocator = this.page
      .locator('div', {
        has: this.page.getByPlaceholder('WeightOunces').first(),
      })
      .filter({ hasText: 'OZ' })
      .last();
    const unitsLocator = this.page
      .locator('div', { has: this.page.locator('[id="weight"]').first() })
      .filter({ hasText: 'Units' })
      .last();
    const dimensionTextLocator = this.page
      .getByText('Dimension', { exact: true })
      .first();
    await this.getByPlaceholderLocator('Preset Name');
    this.locateElementByTestId('saveItem');

    const shippingAddressTextLocator = this.page
      .getByText('Shipping Address', { exact: true })
      .first();
    const confirmationAddressLocator = this.page
      .locator('div', {
        has: this.page.getByText('Confirmation', { exact: true }).first(),
      })
      .filter({ has: this.page.getByTestId('toolTip').first() })
      .last();
    const confirmationDropdown = this.page.locator('[id="test"]').first();
    const addressTypeCheckbox = this.page
      .locator('[id="residentialId"]')
      .first();

    // Verify Order Details
    await expect(orderByIdLocator).toBeVisible();
    await expect(shipDateFieldLocator).toBeVisible();
    await expect(weightTextLocator).toBeVisible();
    await expect(lbsLocator).toBeVisible();
    await expect(ozLocator).toBeVisible();
    await expect(unitsLocator).toBeVisible();

    // Verify Dimension Fields
    await expect(dimensionTextLocator).toBeVisible();
    await this.getByPlaceholderLocator('Width');
    await this.getByPlaceholderLocator('Length');
    await this.getByPlaceholderLocator('Height');

    // Verify Shipping Address
    await expect(shippingAddressTextLocator).toBeVisible();
    await this.getByPlaceholderLocator('Name');
    await this.getByPlaceholderLocator('Address 1');
    await this.getByPlaceholderLocator('Address 2');
    await this.getByPlaceholderLocator('City');
    await this.getByPlaceholderLocator('State');
    await this.getByPlaceholderLocator('Postal Code');

    // Verify Confirmation Address
    await expect(confirmationAddressLocator).toBeVisible();
    await expect(confirmationDropdown).toBeVisible();
    await expect(addressTypeCheckbox).toBeVisible();
  }
}
