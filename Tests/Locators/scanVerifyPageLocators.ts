import { Page } from '@playwright/test';

export class ScanVerifyPageLocators {
  constructor(private readonly page: Page) {}

  get accountnameInput() {
    return this.page.locator('[data-component-name="tenent"]');
  }

  get modalCloseIcon() {
    return this.page.getByTestId('CancelIcon').first();
  }

  get scanInput() {
    return this.page.getByPlaceholder('Ready for Order Scan').first();
  }

  get scanIcon() {
    return this.page.getByTestId('rfoSearchBtn').first();
  }
  get orderNumber() {
    return this.page.getByTestId('orderDetail').first();
  }

  get restartOrder() {
    return this.page.getByTestId('restartOrder').first();
  }

  get reloadOrder() {
    return this.page.getByTestId('getOrderData').first();
  }

  get addNote() {
    return this.page.getByTestId('addNote').first();
  }

  get orderReadyToScan() {
    return this.page.getByPlaceholder('Ready For Product Scan');
  }

  get isVisibleOrderReadyToScan() {
    return this.orderReadyToScan.isVisible();
  }

  get orderInput() {
    return this.page.getByPlaceholder('Click Here Before Scanning');
  }

  get tapOrder() {
    return this.page.getByPlaceholder('Tap Here Before Scanning');
  }

  get passBtn() {
    return this.page
      .getByTestId('passButton')
      .filter({ has: this.page.getByText('Pass') });
  }

  get scanAllButton() {
    return this.page.getByTestId('scanAllButton').getByText('SCAN ALL').first();
  }
  get prodcutScan() {
    return this.page.getByTestId('redirectToItem').first();
  }

  get productName() {
    return this.page
      .locator('[data-component-name="suggestedItemSingle"]')
      .first();
  }

  get productImage() {
    return this.productName
      .locator(' +div')
      .first()
      .filter({ has: this.page.locator('img').first() });
  }

  get scannedProducts() {
    return this.page
      .locator('[data-component-name="nextItemImageCount"]')
      .first();
  }

  get productSKU() {
    return this.page.getByTestId('copySKU').first().locator('..');
  }

  get productUPC() {
    return this.page.getByTestId('copyUPC').first();
  }

  get addNoteText() {
    return this.page.getByTestId('messageText').first();
  }

  get enterNoteField() {
    return this.page.getByTestId('inputElement').first();
  }
  get closeIcon() {
    return this.page.locator('[class="icon-cancel"]').last();
  }

  get cancelBtn() {
    return this.page.getByText('Cancel', { exact: true }).first();
  }

  get saveBtn() {
    return this.page.getByText('Save', { exact: true }).first();
  }

  get passedItemCount() {
    return this.page.getByTestId('boxItemList').count();
  }

  get restartPrompt() {
    return this.page
      .getByTestId('prompt')
      .filter({
        hasText:
          'Are you sure you would like to reset all scanning progress for this order?',
      })
      .first();
  }

  get progressbar() {
    return this.page.getByRole('progressbar').first();
  }

  invalidIdAlert(orderMessage: string) {
    return this.page.getByTestId('message').first().filter({
      hasText: orderMessage,
    });
  }

  inputFieldByLabel(fieldLabel: string) {
    return this.page
      .locator('div')
      .filter({
        hasText: fieldLabel,
      })
      .filter({
        has: this.page.locator('input'),
      })
      .last();
  }

  get moreOptions() {
    return this.page.getByTestId('contentLess').first();
  }

  get moreSku() {
    return this.page.getByTestId('showMoreIcon').first();
  }

  get addNewSku() {
    return this.page.getByTestId('addNewSku').locator('i').first();
  }

  get addNewBarcode() {
    return this.page.getByTestId('addNewBarcode').locator('i').first();
  }

  get cancelIcon() {
    return this.page.getByTestId('iconCancel').first();
  }

  get enterButton() {
    return this.page.getByTestId('EnterButton').first();
  }

  get enterTrackingNumber() {
    return this.page
      .getByTestId('enterButton')
      .filter({
        has: this.page.getByText('Enter', { exact: true }),
      })
      .first();
  }

  get cancelButton() {
    return this.page.getByText('Cancel', { exact: true }).first();
  }

  get confirmBtn() {
    return this.page.getByTestId('okButton').first();
  }

  get barcodeModalTitle() {
    return this.page.getByText('Scan or Enter a unique Barcode');
  }

  get scanPackOption() {
    return this.page.getByTestId('ScanPackOption').first();
  }

  get clickScanDropDown() {
    return this.page.getByTestId('clickScanDropDown').first();
  }

  get getScanDropDownOptionsCount() {
    return this.page.getByTestId('clickScanOption');
  }

  get typeInDropDown() {
    return this.page.getByTestId('typeInDropDown').first();
  }

  get serialRecordDropDown() {
    return this.page.getByTestId('serialRecordDropDown').first();
  }

  get productField() {
    return this.page
      .locator('div')
      .filter({
        hasText: 'Scanning Sequence Override',
      })
      .filter({
        has: this.page.getByTestId('countInc'),
      })
      .filter({
        has: this.page.getByTestId('countDec'),
      })
      .last();
  }

  get productInfo() {
    return this.page.getByTestId('productInfo').first();
  }

  get orderStatusBtn() {
    return this.page.getByTestId('orderStatusBtn').first();
  }

  get aliasOfAnother() {
    return this.page.getByTestId('aliasOfAnother').first();
  }

  get aliasOfProduct() {
    return this.page.getByTestId('aliasesOfThisProduct').first();
  }

  get changeToKit() {
    return this.page.getByTestId('changeToKit').first();
  }

  get saveAndCloseButton() {
    return this.page.getByTestId('saveAndCloseButton').first();
  }

  get cancelProductBtn() {
    return this.page.getByTestId('cancelBtn').first();
  }

  get printbyQz() {
    return this.page.getByTestId('printbyQz').first();
  }

  get addImageIcon() {
    return this.page
      .locator('div')
      .filter({
        hasText: 'Add Image',
      })
      .filter({
        has: this.page.locator('i'),
      })
      .last();
  }

  get enterProductName() {
    return this.page
      .locator('div')
      .filter({
        hasText: 'Product Name',
      })
      .filter({
        has: this.page.locator('input'),
      })
      .last()
      .locator('input')
      .first();
  }

  get scanUniqueSKU() {
    return this.page.getByText('Scan or Enter a unique SKU').first();
  }

  get scanOptions() {
    return this.page.getByText('Pass / click-scan').first();
  }

  get skuInput() {
    return this.page.getByTestId('skuInput').last();
  }

  get alreadyExistsBarcodeMsg() {
    return this.page.getByText('Oh shizzle, that barcode already exists!');
  }

  get alreadyExistsSkuMsg() {
    return this.page.getByText('Oh shizzle, that SKU already exists!');
  }

  get lastAddedBarcode() {
    return this.page.getByTestId('removeBarcode').locator('i').last();
  }

  get barcodeInput() {
    return this.page.getByTestId('barcodeInput').last();
  }

  get lastAddedSKu() {
    return this.page.getByTestId('removeTagSku').locator('i').last();
  }

  get permitDifferentItemButton() {
    return this.page
      .getByTestId('Button1')
      .filter({
        has: this.page.getByText(
          'Yes, I want to permit these separate items to have the same barcode ',
          {
            exact: true,
          },
        ),
      })
      .first();
  }

  get verifyDifferentItemButton() {
    return this.page
      .getByTestId('Button1')
      .filter({
        has: this.page.getByText('No Thanks. These Items are different', {
          exact: true,
        }),
      })
      .first();
  }

  get scrollBar() {
    return this.page.getByTestId('scrollBar').first();
  }

  get postScanningMessage() {
    return this.page.getByTestId('postScanningMessage').first();
  }
  get postScanningMessageTitle() {
    return this.page
      .getByText('Please scan the shipping label barcode to continue.', {
        exact: true,
      })
      .first();
  }
  get unscannedCount() {
    return this.page.locator('[data-component-name="unscannedCount"]').first();
  }
}
