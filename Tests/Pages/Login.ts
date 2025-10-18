import { type Page, expect } from '@playwright/test';
import { LoginPageLocators } from '../Locators/loginPageLocators';
export class LoginPage {
  readonly page: Page;
  readonly locators: LoginPageLocators;
  constructor(page: Page) {
    this.page = page;
    this.locators = new LoginPageLocators(page);
  }

  async visit() {
    await this.page.goto(`${process.env.BASE_URL}`);
  }

  async successfulLogin(
    accountName: string,
    userName: string,
    password: string,
  ) {
    await this.enterAccountName(accountName);
    await this.enterUsername(userName);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async enterAccountName(accountName: string) {
    const accountNameInput = this.locators.accountnameInput;
    await expect(accountNameInput).toBeVisible();
    await accountNameInput.fill(accountName);
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

  async verifyScanAndPassPage() {
    await this.page.waitForTimeout(3000);
    const sessionLogout = this.locators.sessionLogout;
    const isSessionLogout = await sessionLogout.isVisible();
    if (isSessionLogout) {
      await expect(sessionLogout).toBeVisible();
      await sessionLogout.click();
    }
    const orderScanPage = this.locators.orderscanPage;
    await expect(orderScanPage).toBeVisible();
    await orderScanPage.click();
  }

  async verifyInvalidCredentials(errorMessage: string) {
    const invalidCredentialsMessage = await this.locators.errorMessageIn(
      errorMessage,
    );
    await expect(invalidCredentialsMessage).toBeVisible();
    await invalidCredentialsMessage.click();
  }

  async verifyEmptyCredentials() {
    const emptyCredentialsMessage = this.locators.errorMessageEmptyFileds;
    await expect(emptyCredentialsMessage).toBeVisible();
    await emptyCredentialsMessage.click();
  }

  async clickOnForgetPassword() {
    const resetPasswordLink = this.locators.resetPasswordLink;
    await expect(resetPasswordLink).toBeVisible();
    await resetPasswordLink.click();
  }

  async observeResetPasswordModal() {
    const resetPasswordHeading = this.locators.resetPasswordModal;
    await expect(resetPasswordHeading).toBeVisible();
  }

  async enterResetEmail(newEmail: string) {
    const resetEmail = this.locators.enterResetEmail;
    await expect(resetEmail).toBeVisible();
    await resetEmail.click();
    await resetEmail.fill(newEmail);

    const submitBtn = this.locators.resetSubmitBtn;
    await submitBtn.dispatchEvent('click');
  }

  async observeInvalidResetUser() {
    const invalidUserNotification = this.locators.errorMessageInvalidUser;
    await expect(invalidUserNotification).toBeVisible();
    await expect(invalidUserNotification).not.toBeVisible();
  }

  async observeEmptyResetUser() {
    const submitBtn = this.locators.resetEmptyUser;
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toHaveAttribute('aria-disabled', 'true');
  }

  async closeResetPasswordModal() {
    const cancelIcon = this.locators.modalCloseIcon;
    await expect(cancelIcon).toBeVisible();
    await cancelIcon.click();

    const resetPasswordHeading = this.locators.resetPasswordModal;
    await expect(resetPasswordHeading).not.toBeVisible();
  }

  async cancelResetModal() {
    const cancelBtn = this.locators.cancelResetBtn;
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();
  }
}
