// coreTests.ts
import { Page, expect } from '@playwright/test';
import { TestFile } from './data/testData';
import { calculateSimilarity } from './helpers/similarity';
import dotenv from 'dotenv';
dotenv.config({ path: './tests/.env' });

const SIMILARITY_THRESHOLD = 85;

async function login(page: Page, username: string, password: string) {
  await page.goto('/sandbox');
  await page.click('text=Login');
  await page.waitForURL(`https://${process.env.AUTH0_DOMAIN}/**`, { timeout: 5000 });
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForURL('**/sandbox', { timeout: 5000 });
}

async function signup(page: Page, username: string, password: string) {
  await page.goto('/sandbox');
  await page.click('text=Login');

  await page.waitForURL(`https://${process.env.AUTH0_DOMAIN}/**`, { timeout: 5000 });

  await page.click('a[href*="/u/signup"]');

  // Fill out the email and password
  await page.fill('input[name="email"]', username);
  await page.fill('input[name="password"]', password);

  // Click the Continue button
  await page.click('button[value="default"]');

  // Wait for the next page to load (optional)
  await page.waitForTimeout(2000);

  // Click the Accept button
  await page.click('button[value="accept"]');

  // Wait for the final URL after acceptance
  await page.waitForURL('**/sandbox', { timeout: 5000 });
}

async function uploadFile(page: Page, file: TestFile, testFilename: string) {
  await page.click('#open-upload-modal-btn');
  await page.waitForSelector('#upload-modal');

  const fileInput = await page.$('#upload-file-input');
  if (fileInput) {
    await fileInput.setInputFiles(file.name);
  } else {
    throw new Error('File input not found');
  }

  const fileItems = await page.$$('.file-item-name');
  const uploadedFileItem = await Promise.all(
    fileItems.map(async (item) => {
      const name = await item.textContent();
      return name?.includes(testFilename);
    })
  );

  if (!uploadedFileItem.includes(true)) {
    throw new Error('Uploaded file not found in the file list');
  }
}

async function extractFileWithPII(page: Page, file: TestFile, testFilename: string) {
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
  const similarity = calculateSimilarity(file.maskPIIOutput.join('\n\n'), extractedText);
  try {
    expect(similarity).toBeGreaterThanOrEqual(SIMILARITY_THRESHOLD);
    console.log(`MaskPII Result Similarity: ${similarity}`);
  } catch (e) {
    console.error(`MaskPII Result Similarity: ${similarity}`);
    console.error('Extracted text:');
    console.error(extractedText);
    throw e;
  }
}

async function extractFileWithoutPii(page: Page, file: TestFile) {
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
  const similarity = calculateSimilarity(file.noMaskPIIOutput.join('\n\n'), extractedText);
  try {
    expect(similarity).toBeGreaterThanOrEqual(SIMILARITY_THRESHOLD);
    console.log(`NoMaskPII Result Similarity: ${similarity}`);
  } catch (e) {
    console.error(`NoMaskPII Result Similarity: ${similarity}`);
    console.error('Extracted text:');
    console.error(extractedText);
    throw e;
  }
}

async function extractKeyValuePair(page: Page, file: TestFile, testFilename: string) {
  // Wait for and verify the file name
  const extractFileNameItem = await page.waitForSelector('#extract-file-name', { timeout: 5000 });
  if (extractFileNameItem) {
    const extractFileName = await extractFileNameItem.textContent();
    expect(extractFileName).toEqual(testFilename);
  } else {
    throw new Error('Extract file name item not found');
  }

  // Fill in the key-value input fields
  const firstInputKey = await page.waitForSelector('input[id^="input-"][id$="-key"][aria-label="Key Name Input"]');
  await firstInputKey?.fill('Total Amount');
  
  // Optional: Add description for better extraction
  const firstInputDesc = await page.waitForSelector('textarea[id^="input-"][id$="-description"][aria-label="Key Description"]');
  await firstInputDesc?.fill('The total monetary value or sum');

  // Add another key-value pair using the add button
  await page.click('button[aria-label="Add Key-Value Pair"]');
  const secondInputKey = await page.waitForSelector('input[id^="input-"][id$="-key"][aria-label="Key Name Input"]:nth-of-type(2)');
  await secondInputKey?.fill('Date');
  
  // Extract key-value pairs
  await page.click('button[aria-label="Extract Key-Value Pairs"]');
  
  // Wait for the result container
  await page.waitForSelector('#raw-extract-result[aria-label="Extraction Result"]');
  
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

  // Since we don't have specific key-value output in TestFile,
  // we'll verify that the extraction produced valid JSON with key-value pairs
  expect(typeof parsedResult).toBe('object');
  expect(parsedResult).not.toBeNull();
  
  // Log the extracted key-value pairs for debugging
  console.log('Key-Value Extraction Result:', JSON.stringify(parsedResult, null, 2));
}
  
export { login, signup, uploadFile, extractFileWithPII, extractFileWithoutPii, extractKeyValuePair };
