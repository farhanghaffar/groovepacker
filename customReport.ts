import {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from '@playwright/test/reporter';

import { zipDirectory } from './Utils/testUtils';
import { uploadFile } from './Utils/slackCustomLayout';

class MyReporter implements Reporter {
  constructor() {
    console.log('My Custom Repoter is Running to Collect Logs');
  }

  async onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
  }

  async onTestBegin(test: TestCase) {
    console.log(`Starting test ${test.title}`);
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    console.log(`Finished test ${test.title}: ${result.status}`);
  }

  async onEnd(result: FullResult) {
    await zipDirectory('playwright-report', 'playwright-report.zip');
    await uploadFile('playwright-report.zip');
  }
}
export default MyReporter;
