import { Page, test } from '@playwright/test';
import { LoginPage } from '../../Pages/Login';
import testData from '../../../Utils/testData.json';

test.describe(`Page - Login`, async () => {
  let page: Page;

  test('Test 1:- Verify that user is able to login successfully using valid credentials - login-1', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await test.step('navigate to login page', async () => {
      await loginPage.visit();
    });

    await test.step('enter valid credentials and click on login button', async () => {
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT}`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    await test.step('verify user lands on "Scan & Verify" page.', async () => {
      await loginPage.verifyScanAndPassPage();
    });
  });

  test('Test: 2:- Verify that user is not able to login using invalid credentials - login-2', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await test.step('navigate to login page', async () => {
      await loginPage.visit();
    });

    await test.step('enter invalid credentials', async () => {
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT}`,
        `${testData.invalidUsername}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    await test.step('user unable to login and get error message', async () => {
      await loginPage.verifyInvalidCredentials(
        'Unable to log in. Please check your username and password',
      );
    });
  });

  test('Test: 3:- Verify the validation message once user enter invalid account name - login-3', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await test.step('navigate to login page', async () => {
      await loginPage.visit();
    });

    await test.step('Verify the validation message once user enter invalid account name', async () => {
      await loginPage.visit();
      await loginPage.successfulLogin(
        `${process.env.VALID_USER_ACCOUNT}-invalid`,
        `${process.env.VALID_USERNAME}`,
        `${process.env.VALID_PASSWORD}`,
      );
    });

    await test.step('user unable to login and get error message', async () => {
      await loginPage.verifyInvalidCredentials(
        'Unable to login. Please check your account name',
      );
    });
  });

  test('Test: 4:- Verify the validation messages when all fields are blank - login-4', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await test.step('navigate to login page', async () => {
      await loginPage.visit();
    });

    await test.step('login with empty credentials', async () => {
      await loginPage.successfulLogin('', `${process.env.VALID_USERNAME}`, '');
    });

    await test.step('user unable to login Verify error message', async () => {
      await loginPage.verifyEmptyCredentials();
    });
  });

  test('Test: 5:- Verify that user is able to send the link of reset password of valid user - login-5', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const resetEMail = process.env.RESET_EMAIL;
    const RESET_EMAIL = 'farhanghaffar007@gmail.com';
    await test.step('navigate to login page', async () => {
      await loginPage.visit();
    });
    await test.step('enter account name', async () => {
      await loginPage.enterAccountName(`${process.env.VALID_USER_ACCOUNT}`);
    });

    await test.step('click on forget button and observe the modal', async () => {
      await loginPage.clickOnForgetPassword();
      await loginPage.observeResetPasswordModal();
    });

    await test.step('enter valid reset email', async () => {
      await loginPage.enterResetEmail(resetEMail || RESET_EMAIL);
    });
  });

  test('Test: 6:- Verify that user is not able to send the link of reset password for invalid user - login-6', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const resetEMail = 'farhanghaffar007';
    await test.step('navigate to login page', async () => {
      await loginPage.visit();
    });
    await test.step('enter account name', async () => {
      await loginPage.enterAccountName(`${process.env.VALID_USER_ACCOUNT}`);
    });
    await test.step('click on forget button and observe the modal', async () => {
      await loginPage.clickOnForgetPassword();
      await loginPage.observeResetPasswordModal();
    });
    await test.step('enter invalid reset email and observe the response', async () => {
      await loginPage.enterResetEmail(resetEMail);
      await loginPage.observeInvalidResetUser();
    });
  });

  test('Test: 7:- Verify the validation message when user name field is blank - login-7', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await test.step('navigate to login page', async () => {
      await loginPage.visit();
    });
    await test.step('enter account name', async () => {
      await loginPage.enterAccountName(`${process.env.VALID_USER_ACCOUNT}`);
    });
    await test.step('click on forget button and observe the modal', async () => {
      await loginPage.clickOnForgetPassword();
      await loginPage.observeResetPasswordModal();
    });
    await test.step('click on submit button and observe empty user error message', async () => {
      await loginPage.observeEmptyResetUser();
    });
  });

  test('Test: 8:- Verify that user is able to close the reset password popup - login-8', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    await test.step('navigate to login page', async () => {
      await loginPage.visit();
    });
    await test.step('enter account name', async () => {
      await loginPage.enterAccountName(`${process.env.VALID_USER_ACCOUNT}`);
    });
    await test.step('click on forget button and observe the modal', async () => {
      await loginPage.clickOnForgetPassword();
      await loginPage.observeResetPasswordModal();
    });
    await test.step('click on cancel button and observe modal is closed', async () => {
      await loginPage.cancelResetModal();
    });

    // Again go to forget password, and close by closeIcon
    await test.step('click on forget button and observe the modal', async () => {
      await loginPage.clickOnForgetPassword();
      await loginPage.observeResetPasswordModal();
    });
    await test.step('click on close icon and observe modal is closed', async () => {
      await loginPage.closeResetPasswordModal();
    });
  });
});
