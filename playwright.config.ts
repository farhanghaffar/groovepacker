import devices, { defineConfig } from '@playwright/test';
import 'dotenv/config';
import { generateCustomLayoutSimpleMeta } from './Utils/slackCustomLayout';
function getDisabledTestPatterns(): string[] {
  const disabledTests: string[] = [];

  // Check for individual test disabling (DISABLE_LOGIN_1=true format)
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith('DISABLE_') && process.env[key] === 'true') {
      // Convert DISABLE_LOGIN_1 to login_1 pattern
      const testPattern = key.replace('DISABLE_', '').toLowerCase();
      disabledTests.push(testPattern);
    }
  });

  // Check for multiple test disabling with a comma-separated list
  if (process.env.DISABLED_TEST_CASES) {
    const testCases = process.env.DISABLED_TEST_CASES.split(',');
    testCases.forEach((testCase) => {
      disabledTests.push(testCase.trim());
    });
  }

  return disabledTests;
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './Tests',
  timeout: 5 * 60 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 50 * 1 * 1000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Retry on CI only */
  retries: process.env.CI ? 3 : 3,
  /* Opt out of parallel tests on CI. */
  workers: 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter:
    process.env.SEND_REPORT_SLACK === 'true'
      ? [
          [
            './node_modules/playwright-slack-report/dist/src/SlackReporter.js',
            {
              channels: [process.env.CHANNEL_NAME], // provide one or more Slack channels
              sendResults: 'always', // "always" , "on-failure", "off"
              showInThread: true,
              layoutAsync: generateCustomLayoutSimpleMeta,
              meta: [
                {
                  key: 'User Account Name',
                  value: process.env.VALID_USER_ACCOUNT_2,
                },
                {
                  key: 'BASE URL',
                  value: process.env.BASE_URL, // depending on your CI environment, this can be the branch name, build id, etc
                },
              ],
            },
          ],
          ['html', { open: 'never' }],
          ['./customReport.ts'],
          // ['playwright-qase-reporter', require('./Utils/qase.config')],
        ]
      : [['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    headless: false,
    // baseURL: process.env.BASE_URL,
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    screenshot: 'on',
    video: 'on',
  },
  grepInvert:
    getDisabledTestPatterns().length > 0
      ? new RegExp(getDisabledTestPatterns().join('|'))
      : undefined,
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Google Chrome',

      use: {
        channel: 'chrome',
        deviceScaleFactor: undefined,
        viewport: null,
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     channel: 'chrome',
    //     viewport: { width: 1500, height: 800 },
    //   },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
