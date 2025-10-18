import { Page } from '@playwright/test';

export class ScanVerifyPageV2Locators {
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
}
