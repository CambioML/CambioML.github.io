// existingUserTests.spec.ts
import { test, Page } from '@playwright/test';
import { login, uploadFile, extractFileWithPII, extractFileWithoutPii } from './coreTests';
import { testFileData } from './data/testData';

const TEST_USERNAME = 'jojo+test@cambioml.com'; // Existing user credentials
const TEST_PASSWORD = 'Test1234!';

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test('should log in successfully', async () => {
  await login(page, TEST_USERNAME, TEST_PASSWORD);
});

// Loop through the file uploads as separate tests
for (const file of testFileData) {
  const testFilename = file.name.split('/').pop()!;

  test.describe(`File Upload and Extraction: ${file.name}`, () => {
    test('should upload the file', async () => {
      await uploadFile(page, file, testFilename);
    });

    test('should extract the file with PII masking', async () => {
      await extractFileWithPII(page, file, testFilename);
    });

    test('should extract the file without PII masking', async () => {
      await extractFileWithoutPii(page, file);
    });
  });
}
