import { test, Page } from '@playwright/test';
import { uploadFile, extractFileWithPII, extractFileWithoutPii, signup } from './coreTests';
import { deleteUser } from '@/tests/helpers/auth0Management'; // Functions to create and delete user
import { testFileData } from './data/testData';

const NEW_USER_EMAIL = 'test-new-user@cambioml.com'; // New user credentials
const NEW_USER_PASSWORD = 'NewUser1234!';
let page: Page;

// Wrapping everything inside a single test.describe block
test.describe('User Flow: File Upload and Extraction', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    // Close the page first
    await page.close();

    // // Step 2: Delete the newly created user after all tests
    await deleteUser(NEW_USER_EMAIL);
    // console.log(`New user with ID: ${newUserId}  deleted.`);
  });

  // Step 3: Run the login test
  test('should sign up in successfully with new user', async () => {
    await signup(page, NEW_USER_EMAIL, NEW_USER_PASSWORD); //login(page, NEW_USER_EMAIL, NEW_USER_PASSWORD);
  });

  //   Loop through the file uploads as separate tests inside the test.describe block
  for (const file of testFileData) {
    const testFilename = file.name.split('/').pop()!;
    test.describe(`File Upload and Extraction: ${file.name}`, () => {
      test(`should upload the file: ${testFilename}`, async () => {
        await uploadFile(page, file, testFilename);
      });

      test(`should extract the file with PII masking: ${testFilename}`, async () => {
        await extractFileWithPII(page, file, testFilename);
      });

      test(`should extract the file without PII masking: ${testFilename}`, async () => {
        await extractFileWithoutPii(page, file);
      });
    });
  }
});
