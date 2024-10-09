import { test, expect, Page } from '@playwright/test';
import stringSimilarity from 'string-similarity';
import { testFileData } from './data/testData';

const TEST_USERNAME = 'jojo+test@cambioml.com';
const TEST_PASSWORD = 'Test1234!';
const AUTH0_BASE_URL = 'https://dev-5m1dgbqjz2jua7l2.us.auth0.com';
const SIMILARITY_THRESHOLD = 0.95;
const TAKE_SCREENSHOTS = false;

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

const testTimestamp = new Date().toISOString().replace(/[:.]/g, '-');

async function takeScreenshot(testName: string) {
  if (!TAKE_SCREENSHOTS) {
    return;
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ path: `test-results/screenshots/${testTimestamp}/${testName}-${timestamp}.png` });
}

test('should log in successfully', async () => {
  await takeScreenshot('Login Page'); // Take a screenshot before login
  await page.goto('/sandbox');
  await page.click('text=Login');
  await page.waitForURL(`${AUTH0_BASE_URL}/**`, { timeout: 5000 });
  await page.fill('input[name="username"]', TEST_USERNAME);
  await page.fill('input[name="password"]', TEST_PASSWORD);
  await page.click('button[type="submit"]');

  try {
    await page.waitForURL('**/sandbox', { timeout: 5000 });
  } catch (e) {
    console.error('Login failed: Redirect to /sandbox did not happen.');

    const loginErrorVisible = await page.isVisible('text="invalid credentials"');
    expect(loginErrorVisible).toBeTruthy();
    console.log('Login error message confirmed.');

    throw new Error('Login failed due to invalid credentials.');
  }
});

// Loop through the file uploads as separate tests
for (const file of testFileData) {
  const testFilename = file.name.split('/').pop()!;

  test.describe(`File Upload and Extraction: ${file.name}`, () => {
    test('should upload the file', async () => {
      await takeScreenshot(`Upload File - ${testFilename}`); // Take a screenshot before uploading
      await page.click('#open-upload-modal-btn');
      await page.waitForSelector('#upload-modal');
      expect(await page.isVisible('#upload-modal')).toBeTruthy();

      const fileInput = await page.$('#upload-file-input');
      if (fileInput) {
        await fileInput.setInputFiles(file.name);
      } else {
        throw new Error('File input not found');
      }

      const fileItems = await page.$$('.file-item-name');
      const uploadedFileItem = fileItems.find(async (item) => {
        const name = await item.textContent();
        return name?.includes(testFilename);
      });

      expect(uploadedFileItem).not.toBeNull();
    });

    test('should extract the file with PII masking', async () => {
      await takeScreenshot(`Extract File with PII - ${testFilename}`); // Take a screenshot before extraction
      const extractFileNameItem = await page.waitForSelector('#extract-file-name', { timeout: 5000 });
      if (extractFileNameItem) {
        const extractFileName = await extractFileNameItem.textContent();
        expect(extractFileName).toEqual(testFilename);
      } else {
        throw new Error('Extract file name item not found');
      }

      await page.click('#extract-plain-text-btn');

      const rawExtractResult = await page.textContent('#raw-extract-result');
      expect(rawExtractResult).not.toBeNull();

      if (!rawExtractResult) {
        throw new Error('Extracted text is null');
      }

      let parsedResult;
      try {
        parsedResult = JSON.parse(rawExtractResult);
      } catch (error) {
        console.error('Failed to parse raw extract result:', rawExtractResult);
        console.error('Error details:', error);
        throw new Error('Parsing failed for raw extract result.');
      }

      expect(parsedResult).toHaveLength(file.maskPIIOutput.length);

      const extractedText = parsedResult.join('\n\n');
      const similarity = stringSimilarity.compareTwoStrings(file.maskPIIOutput.join('\n\n'), extractedText);
      try {
        expect(similarity).toBeGreaterThanOrEqual(SIMILARITY_THRESHOLD);
        console.log(`MaskPII Result Similarity: ${similarity}`);
      } catch (e) {
        console.error(`MaskPII Result Similarity: ${similarity}`);
        console.error('Extracted text:');
        console.error(extractedText);
        throw e;
      }
    });

    test('should extract the file without PII masking', async () => {
      await takeScreenshot(`Extract File without PII - ${testFilename}`); // Take a screenshot before extraction
      await page.click('#retry-extract-btn');
      await page.waitForSelector('#remove-pii-checkbox', { timeout: 5000 });
      await page.click('#remove-pii-checkbox');
      await page.click('#extract-plain-text-btn');
      await page.waitForSelector('#result-container');

      const rawExtractResult = await page.textContent('#raw-extract-result');
      expect(rawExtractResult).not.toBeNull();

      if (!rawExtractResult) {
        throw new Error('Extracted text is null');
      }

      let parsedResult;
      try {
        parsedResult = JSON.parse(rawExtractResult);
      } catch (error) {
        console.error('Failed to parse raw extract result:', rawExtractResult);
        console.error('Error details:', error);
        throw new Error('Parsing failed for raw extract result.');
      }

      expect(parsedResult).toHaveLength(file.noMaskPIIOutput.length);

      const extractedText = parsedResult.join('\n\n');
      const similarity = stringSimilarity.compareTwoStrings(file.noMaskPIIOutput.join('\n\n'), extractedText);
      try {
        expect(similarity).toBeGreaterThanOrEqual(SIMILARITY_THRESHOLD);
        console.log(`NoMaskPII Result Similarity: ${similarity}`);
      } catch (e) {
        console.error(`NoMaskPII Result Similarity: ${similarity}`);
        console.error('Extracted text:');
        console.error(extractedText);
        throw e;
      }
    });
  });
}
