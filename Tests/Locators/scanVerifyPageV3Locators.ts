import { Page } from '@playwright/test';

export class ScanVerifyPageV3Locators {
  constructor(private readonly page: Page) {}
  get usernameInput() {
    return this.page.locator('[id="username"]').first();
  }

  get passwordInput() {
    return this.page.locator('[id="password"]').first();
  }

  get loginButton() {
    return this.page.locator('[id="login_button"]');
  }

  get verifyLoggedIn() {
    return this.page
      .getByAltText('GroovePacker', {
        exact: true,
      })
      .first();
  }

  async listInnerTxt(text: string) {
    return this.page.getByRole('listitem').getByText(text).first();
  }

  async tableBodyElements(page: Page, columnIndex: any) {
    return page
      .locator('tbody >> tr')
      .locator(`td:nth-child(${columnIndex + 1})`)
      .first();
  }
  get searchTenant() {
    return this.page.getByPlaceholder('Search').first();
  }

  get sessionLogout() {
    return this.page.getByRole('button', {
      name: 'Yes, Sign Out all other sessions',
    });
  }

  get selectDuplicate() {
    return this.page
      .locator('[class="dropdown-toggle"]')
      .filter({ has: this.page.getByText('Duplicate').last() });
  }

  get reloadOrder() {
    return this.page.getByTestId('getOrderData').first();
  }

  get selectDelete() {
    return this.page
      .locator('li')
      .filter({
        has: this.page.locator('.badge').first(),
      })
      .filter({
        has: this.page.getByText('Delete '),
      })
      .first()
      .getByText('Delete');
  }

  get enterDuplicateName() {
    return this.page.locator('[id="name"]').first();
  }

  get clickOnConfirmBtn() {
    return this.page.getByRole('button', { name: 'Create' }).first();
  }

  get productUPC() {
    return this.page.getByTestId('copyUPC').first();
  }

  get modelCloseIcon() {
    return this.page.getByTestId('model-close').first();
  }

  get orderReadyToScan() {
    return this.page.getByPlaceholder('Ready For Product Scan');
  }

  get orderInput() {
    return this.page.getByPlaceholder('Click Here Before Scanning');
  }

  get passBtn() {
    return this.page
      .getByTestId('passButton')
      .filter({ has: this.page.getByText('Pass') });
  }

  get productSku() {
    return this.page.getByTestId('copySKU').first();
  }

  get disabledPass() {
    return this.page
      .getByTestId('message')
      .filter({
        has: this.page.getByText('The pass function is disabled'),
      })
      .first();
  }

  get unscannedItemsLocation() {
    return this.page
      .locator('[data-component-name="singleProductParent"]')
      .all();
  }

  get errorMsgEmptyEsterik() {
    return this.page
      .getByTestId('message')
      .filter({
        has: this.page.getByText(
          'Please scan the item once before triggering a type-in count.',
          { exact: true },
        ),
      })
      .first();
  }

  get unscannedItemsLocationFirst() {
    return this.page
      .locator('[data-component-name="singleProductParent"]')
      .first();
  }

  get typeScanAlertContainer() {
    return this.page.getByTestId('typeScanAlertContainer').first();
  }

  get clickOnEnterButton() {
    return this.page
      .getByTestId('enterButton')
      .filter({
        has: this.page.getByText('Enter', { exact: true }),
      })
      .first();
  }

  get inputElement() {
    return this.page.getByTestId('inputElement').first();
  }

  get errorMsgEmptyEsterik2() {
    return this.page
      .getByTestId('message')
      .filter({
        has: this.page.getByText(
          'The quantity entered exceeds the remaining number of pieces in the order. Please try again',
          { exact: true },
        ),
      })
      .first();
  }

  get regularLogElements() {
    return this.page.getByTestId('regularLog').all();
  }

  get clickScanLog() {
    return this.page.getByTestId('clickScanLog').first();
  }

  get regularLogElementsTypeIn() {
    return this.page.getByTestId('logsContainer').getByText('Type-In').first();
  }

  get itemName() {
    return this.page
      .getByTestId('redirectToItem')
      .filter({
        has: this.page.getByTestId('itemName').first(),
      })
      .first();
  }

  get scanPackOption() {
    return this.page.getByTestId('ScanPackOption').first();
  }

  get cancelBtn() {
    return this.page.getByTestId('cancelBtn').first();
  }

  get verifyLocation() {
    return this.page.getByText('L1 :', { exact: true }).first();
  }

  get itemOrder() {
    return this.page
      .locator('div')
      .filter({
        has: this.page.getByText('Scanning Sequence Override', { exact: true }),
      })
      .filter({
        has: this.page.getByTestId('tooltip7'),
      })
      .last();
  }

  get duplicateModalHeading() {
    return this.page
      .getByText('Insert a name for the duplicate tenant', { exact: true })
      .first();
  }

  get selectDuplicateFromDropdown() {
    return this.page
      .getByRole('button')
      .filter({
        has: this.page.getByText('Edit', { exact: true }),
      })
      .first();
  }
}
