import { Page } from '@playwright/test';

export class LoginPageLocators {
  constructor(private readonly page: Page) {}

  get accountnameInput() {
    return this.page.locator('[data-component-name="tenent"]');
  }

  get usernameInput() {
    return this.page.locator('input[data-component-name="username"]');
  }

  get passwordInput() {
    return this.page.getByTestId('passwordInput');
  }

  get loginButton() {
    return this.page.getByTestId('logInButton');
  }

  get orderscanPage() {
    return this.page.getByText('Scan & Verify').first();
  }

  get sessionLogout() {
    return this.page.getByTestId('logoutEveryone').first();
  }

  async errorMessageIn(errorMessage: string) {
    return this.page
      .getByTestId('message')
      .filter({
        hasText: errorMessage,
      })
      .first();
  }

  get errorMessageEmptyFileds() {
    return this.page
      .getByTestId('accountNameError')
      .filter({
        hasText: 'Field are require to submit',
      })
      .first();
  }

  get resetPasswordLink() {
    return this.page.getByText('Reset Your Password').first();
  }

  get enterResetEmail() {
    return this.page.getByTestId('inputElement').first();
  }

  get resetSubmitBtn() {
    return this.page
      .getByTestId('ButtonContainer')
      .first()
      .getByText('Submit', { exact: true })
      .first();
  }

  get cancelResetBtn() {
    return this.page
      .getByTestId('ButtonContainer')
      .first()
      .getByText('Cancel')
      .first();
  }

  get resetPasswordModal() {
    return this.page.getByTestId('Message').first();
  }

  get errorMessageInvalidUser() {
    return this.page
      .getByTestId('notification')
      .filter({
        has: this.page.getByText('Unable to login. Please check your username'),
      })
      .first();
  }

  get resetEmptyUser() {
    return this.page.getByText('Submit').locator('..');
  }

  get modalCloseIcon() {
    return this.page.getByTestId('CancelIcon').first();
  }

  get modalCloseIcon2() {
    return this.page.getByTestId('CancelIcon').first();
  }
}
