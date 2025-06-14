#!/usr/bin/env bun

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AzureOpenAI } from 'openai';

// Configuration
const AZURE_OPENAI_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_OPENAI_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_OPENAI_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2024-04-01-preview';
const AZURE_OPENAI_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
const SUPPORTED_LOCALES = [
  'en',
  'zh',
  'es',
  'fr',
  'de',
  'ja',
  'pt',
  'ru',
  'it',
  'ar',
  'ko',
  'nl',
  'hi',
  'tr',
  'sv',
  'pl',
  'no',
  'da',
  'fi',
  'cs',
  'hu',
  'ro',
] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

// Initialize Azure OpenAI client
if (!AZURE_OPENAI_API_KEY) {
  console.error('❌ AZURE_OPENAI_API_KEY environment variable is required');
  process.exit(1);
}

if (!AZURE_OPENAI_ENDPOINT) {
  console.error('❌ AZURE_OPENAI_ENDPOINT environment variable is required');
  process.exit(1);
}

const openai = new AzureOpenAI({
  apiKey: AZURE_OPENAI_API_KEY,
  endpoint: AZURE_OPENAI_ENDPOINT,
  apiVersion: AZURE_OPENAI_API_VERSION,
  deployment: AZURE_OPENAI_DEPLOYMENT,
});

// Language mapping
const LANGUAGE_NAMES: Record<Locale, string> = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  zh: 'Chinese (Simplified)',
  de: 'German',
  ja: 'Japanese',
  pt: 'Portuguese',
  ru: 'Russian',
  it: 'Italian',
  ar: 'Arabic',
  ko: 'Korean',
  nl: 'Dutch',
  hi: 'Hindi',
  tr: 'Turkish',
  sv: 'Swedish',
  pl: 'Polish',
  no: 'Norwegian',
  da: 'Danish',
  fi: 'Finnish',
  cs: 'Czech',
  hu: 'Hungarian',
  ro: 'Romanian',
};

// System prompt for blog posts
const BLOG_TRANSLATION_SYSTEM_PROMPT = `You are a professional translator. Your ONLY task is to translate the exact text provided by the user from {sourceLanguage} to {targetLanguage}.

CRITICAL RULES:
1. Translate ONLY the exact text content provided in the user message
2. Do NOT generate, create, or add any new content
3. Do NOT change, add, or remove any formatting, structure, or syntax
4. Do NOT add markdown code blocks or backticks or any formatting markers
5. Keep all markdown, YAML, code blocks, and technical syntax exactly as provided
6. Only change the human-readable text content to the target language
7. Preserve all technical terms, URLs, variable names, and code examples unchanged
8. Do NOT be creative - translate literally and directly
9. Do NOT add any prefixes, suffixes, or wrapper text
10. Output must start and end exactly like the input
11. PRESERVE UNCLOSED QUOTES - If a quote starts but doesn't end in the provided text, leave it unclosed (the closing quote is in the next chunk)

EXAMPLE:
Input: "---\\ntitle: 'Hello World'\\n---\\n# Test"
Output: "---\\ntitle: 'Bonjour le Monde'\\n---\\n# Test"

UNCLOSED QUOTES EXAMPLE:
Input: "#### 10.2.2 Application Deployment\\n\\n\`\`\`bash\\n# Install Flux GitOps\\nflux bootstrap github \\\\"
Output: "#### 10.2.2 应用程序部署\\n\\n\`\`\`bash\\n# Install Flux GitOps\\nflux bootstrap github \\\\"

FORBIDDEN EXAMPLES:
❌ Do NOT add: code block markers, yaml/markdown/typescript blocks, or any wrappers
❌ Do NOT add: "Here is the translation:", "Translated content:", etc.
❌ Do NOT change the first or last characters of the content
❌ Do NOT close quotes that are left unclosed in the input

Remember: Your output must be IDENTICAL in structure to the input, with only human-readable text translated.`;

// System prompt for JSON object translation
const SIMPLE_VALUE_TRANSLATION_PROMPT = `You are a precise translator. Translate all string values in the provided JSON object from {sourceLanguage} to {targetLanguage}.

STRICT REQUIREMENTS:
1. You will receive a JSON object containing nested properties with string values
2. You MUST preserve the exact same object structure and property names
3. Only translate the string VALUES, never translate property KEYS
4. Return the same JSON structure with translated string values
5. Do NOT add explanations, markdown, or extra text outside the JSON
6. If a value is not a string (numbers, booleans), keep it unchanged
7. PRESERVE ALL ESCAPE SEQUENCES: Keep \\n, \\t, \\r, and other escape sequences exactly as they appear - do NOT convert them to actual newlines or tabs
8. For multiline content with \\n, translate the text but keep the \\n escape sequences in the output

FORMAT:
Input: JSON object with string values to translate
Output: Same JSON object with translated string values

EXAMPLE:
Input:
{
  "nav": {
    "home": "Home",
    "blog": "Blog"
  },
  "pricing": {
    "title": "Pricing",
    "monthly": "Monthly"
  },
  "steps": {
    "step1Description": "First, you need to extract.\\n\\nOnce extracted, you can download."
  }
}

Output:
{
  "nav": {
    "home": "首页",
    "blog": "博客"
  },
  "pricing": {
    "title": "定价",
    "monthly": "每月"
  },
  "steps": {
    "step1Description": "首先，您需要提取。\\n\\n提取后，您可以下载。"
  }
}

CRITICAL: Preserve \\n escape sequences exactly - do NOT convert to actual line breaks.
Remember: Output ONLY valid JSON. Preserve structure exactly. Translate only string values.`;

/**
 * Estimate token count (conservative estimation: 1 token ≈ 1 character)
 */
function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 1);
}

/**
 * Split content into chunks for translation
 */
function splitContentIntoChunks(content: string, isBlogPost: boolean = true, maxTokens: number = 10000): string[] {
  const estimatedTokens = estimateTokenCount(content);

  if (estimatedTokens <= maxTokens) {
    return [content];
  }

  console.log(`📊 Content estimated at ${estimatedTokens} tokens, splitting into chunks...`);

  const chunks: string[] = [];

  if (isBlogPost) {
    // For blog posts (markdown), split by sections/paragraphs
    const sections = content.split(/\n(?=#{1,6}\s)/); // Split by headers

    let currentChunk = '';

    for (const section of sections) {
      if (estimateTokenCount(currentChunk + section) > maxTokens && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = section;
      } else {
        currentChunk += (currentChunk ? '\n' : '') + section;
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    // If still too large, split by paragraphs
    if (chunks.some((chunk) => estimateTokenCount(chunk) > maxTokens)) {
      const refinedChunks: string[] = [];

      for (const chunk of chunks) {
        if (estimateTokenCount(chunk) <= maxTokens) {
          refinedChunks.push(chunk);
        } else {
          const paragraphs = chunk.split(/\n\s*\n/);
          let currentParagraphChunk = '';

          for (const paragraph of paragraphs) {
            if (estimateTokenCount(currentParagraphChunk + paragraph) > maxTokens && currentParagraphChunk) {
              refinedChunks.push(currentParagraphChunk.trim());
              currentParagraphChunk = paragraph;
            } else {
              currentParagraphChunk += (currentParagraphChunk ? '\n\n' : '') + paragraph;
            }
          }

          if (currentParagraphChunk) {
            refinedChunks.push(currentParagraphChunk.trim());
          }
        }
      }

      return refinedChunks;
    }

    return chunks;
  } else {
    // For TypeScript files, this is trickier - split by logical boundaries
    // Try to split by object properties or large sections
    const lines = content.split('\n');
    let currentChunk = '';

    for (const line of lines) {
      if (estimateTokenCount(currentChunk + line + '\n') > maxTokens && currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = line + '\n';
      } else {
        currentChunk += line + '\n';
      }
    }

    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}

/**
 * Translate content using OpenAI API
 */
async function translateContent(
  content: string,
  sourceLanguage: string,
  targetLanguage: string,
  isBlogPost: boolean = true
): Promise<string> {
  const estimatedTokens = estimateTokenCount(content);
  const maxTokensPerChunk = 10000;

  // If content is small enough, translate directly
  if (estimatedTokens <= maxTokensPerChunk) {
    console.log(`📄 Single chunk translation (${estimatedTokens} tokens)`);
    return await translateSingleChunk(content, sourceLanguage, targetLanguage);
  }

  // Split into chunks and translate each
  console.log(`📄 Large file detected (${estimatedTokens} tokens), splitting into chunks...`);
  const chunks = splitContentIntoChunks(content, isBlogPost, maxTokensPerChunk);

  console.log(`📦 Split into ${chunks.length} chunks`);

  const translatedChunks: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`🔄 Translating chunk ${i + 1}/${chunks.length} (${estimateTokenCount(chunk)} tokens)...`);

    // Log chunk input
    console.log(
      `📥 Chunk ${i + 1} input (first 200 chars):`,
      chunk.substring(0, 200) + (chunk.length > 200 ? '...' : '')
    );

    try {
      const translatedChunk = await translateSingleChunk(chunk, sourceLanguage, targetLanguage);

      // Log chunk output
      console.log(
        `📤 Chunk ${i + 1} output (first 200 chars):`,
        translatedChunk.substring(0, 200) + (translatedChunk.length > 200 ? '...' : '')
      );
      console.log(`📊 Chunk ${i + 1} size: input=${chunk.length} chars, output=${translatedChunk.length} chars`);

      translatedChunks.push(translatedChunk);

      // Add delay between chunks to respect API rate limits
      if (i < chunks.length - 1) {
        console.log('⏳ Waiting 2 seconds before next chunk...');
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`❌ Failed to translate chunk ${i + 1}:`, error);
      throw error;
    }
  }

  // Join chunks back together
  const joinedContent = isBlogPost ? translatedChunks.join('\n\n') : translatedChunks.join('\n');

  console.log(`✅ Successfully translated all ${chunks.length} chunks`);
  console.log(`📋 Final content size: ${joinedContent.length} chars`);

  return joinedContent;
}

/**
 * Translate a single chunk of content using OpenAI API
 */
async function translateSingleChunk(content: string, sourceLanguage: string, targetLanguage: string): Promise<string> {
  // Use blog translation system prompt (this function is now only used for blog posts and resources)
  const formattedSystemPrompt = BLOG_TRANSLATION_SYSTEM_PROMPT.replace('{sourceLanguage}', sourceLanguage).replace(
    '{targetLanguage}',
    targetLanguage
  );

  try {
    const response = await openai.chat.completions.create({
      model: AZURE_OPENAI_DEPLOYMENT,
      messages: [
        {
          role: 'system',
          content: formattedSystemPrompt,
        },
        {
          role: 'user',
          content: content, // Only the content to translate, no additional instructions
        },
      ],
      temperature: 0.3,
      max_tokens: 16384, // Increased to maximum for GPT-4o
    });

    const translatedContent = response.choices[0]?.message?.content;

    if (!translatedContent) {
      throw new Error('No translation received from Azure OpenAI API');
    }

    return translatedContent.trim();
  } catch (error) {
    console.error(`❌ Translation failed: ${error}`);
    throw error;
  }
}

/**
 * Check if a locale directory exists, create if not
 */
function ensureLocaleDirectory(basePath: string, locale: Locale): void {
  const localePath = join(basePath, locale);
  if (!existsSync(localePath)) {
    mkdirSync(localePath, { recursive: true });
    console.log(`📁 Created directory: ${localePath}`);
  }
}

/**
 * Translate blog posts
 */
async function translateBlogPosts(sourceLocale: Locale = 'en'): Promise<void> {
  const blogBasePath = join(process.cwd(), 'blog');
  const sourceDir = join(blogBasePath, sourceLocale);

  if (!existsSync(sourceDir)) {
    console.error(`❌ Source blog directory not found: ${sourceDir}`);
    return;
  }

  const blogFiles = readdirSync(sourceDir).filter((file) => file.endsWith('.md'));

  if (blogFiles.length === 0) {
    console.log(`ℹ️  No blog posts found in ${sourceDir}`);
    return;
  }

  console.log(`📚 Found ${blogFiles.length} blog posts in ${sourceLocale}`);

  for (const locale of SUPPORTED_LOCALES) {
    if (locale === sourceLocale) continue;

    ensureLocaleDirectory(blogBasePath, locale);
    const targetDir = join(blogBasePath, locale);

    console.log(`\n🌐 Translating to ${LANGUAGE_NAMES[locale]} (${locale})...`);

    for (const filename of blogFiles) {
      const sourcePath = join(sourceDir, filename);
      const targetPath = join(targetDir, filename);

      // Skip if translation already exists
      if (existsSync(targetPath)) {
        console.log(`⏭️  Skipping ${filename} - already exists in ${locale}`);
        continue;
      }

      try {
        const sourceContent = readFileSync(sourcePath, 'utf-8');

        console.log(`📝 Translating: ${filename}`);
        const translatedContent = await translateContent(
          sourceContent,
          LANGUAGE_NAMES[sourceLocale],
          LANGUAGE_NAMES[locale],
          true
        );

        writeFileSync(targetPath, translatedContent, 'utf-8');
        console.log(`✅ Created: ${targetPath}`);

        // Add a small delay to respect API rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to translate ${filename} to ${locale}:`, error);
      }
    }
  }
}

/**
 * Translate resources
 */
async function translateResources(sourceLocale: Locale = 'en'): Promise<void> {
  const resourcesBasePath = join(process.cwd(), 'resources');
  const sourceDir = join(resourcesBasePath, sourceLocale);

  if (!existsSync(sourceDir)) {
    console.error(`❌ Source resources directory not found: ${sourceDir}`);
    return;
  }

  const resourceFiles = readdirSync(sourceDir).filter((file) => file.endsWith('.md'));

  if (resourceFiles.length === 0) {
    console.log(`ℹ️  No resources found in ${sourceDir}`);
    return;
  }

  console.log(`📖 Found ${resourceFiles.length} resources in ${sourceLocale}`);

  for (const locale of SUPPORTED_LOCALES) {
    if (locale === sourceLocale) continue;

    ensureLocaleDirectory(resourcesBasePath, locale);
    const targetDir = join(resourcesBasePath, locale);

    console.log(`\n🌐 Translating resources to ${LANGUAGE_NAMES[locale]} (${locale})...`);

    for (const filename of resourceFiles) {
      const sourcePath = join(sourceDir, filename);
      const targetPath = join(targetDir, filename);

      // Skip if translation already exists
      if (existsSync(targetPath)) {
        console.log(`⏭️  Skipping ${filename} - already exists in ${locale}`);
        continue;
      }

      try {
        const sourceContent = readFileSync(sourcePath, 'utf-8');

        console.log(`📝 Translating: ${filename}`);
        const translatedContent = await translateContent(
          sourceContent,
          LANGUAGE_NAMES[sourceLocale],
          LANGUAGE_NAMES[locale],
          true
        );

        writeFileSync(targetPath, translatedContent, 'utf-8');
        console.log(`✅ Created: ${targetPath}`);

        // Add a small delay to respect API rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to translate ${filename} to ${locale}:`, error);
      }
    }
  }
}

/**
 * Parse a TypeScript object string into a JavaScript object
 * Preserves escape sequences like \n, \r, \t by keeping them as literal strings
 */
function parseTypescriptObject(content: string): Record<string, unknown> {
  try {
    // Remove the export statement and variable declaration
    // Handle multiline content with the 'm' flag
    const objectMatch = content.match(/export\s+const\s+\w+\s*=\s*({[\s\S]*})\s*as\s+const;?\s*$/m);
    if (!objectMatch) {
      throw new Error('Could not parse TypeScript object structure');
    }

    const objectString = objectMatch[1];

    // Use eval in a safer way to parse the TypeScript object
    // This is acceptable since we control the input (our own translation files)
    try {
      // Create a safe evaluation context
      const evalFunction = new Function('return ' + objectString);
      const result = evalFunction();

      // Post-process the result to convert any actual newlines back to \n escape sequences
      // This handles cases where eval converted escape sequences to actual characters
      return preserveEscapeSequences(result) as Record<string, unknown>;
    } catch {
      // Fallback to JSON parsing approach if eval fails
      console.warn('⚠️  Eval approach failed, trying JSON parsing fallback');
      const jsonString = objectString
        .replace(/'/g, '"')
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/(\w+):/g, '"$1":'); // Quote object keys

      const result = JSON.parse(jsonString);
      return preserveEscapeSequences(result) as Record<string, unknown>;
    }
  } catch (error) {
    console.error('❌ Failed to parse TypeScript object:', error);
    console.error('Content preview:', content.substring(0, 200) + '...');
    throw error;
  }
}

/**
 * Recursively process an object to convert actual newlines back to escape sequences
 * This ensures that when we parse TypeScript objects, escape sequences are preserved
 */
function preserveEscapeSequences(obj: unknown): unknown {
  if (typeof obj === 'string') {
    // Convert actual newlines back to escape sequences
    return obj.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => preserveEscapeSequences(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const preserved: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      preserved[key] = preserveEscapeSequences(value);
    }
    return preserved;
  }

  return obj;
}

/**
 * Convert a JavaScript object back to TypeScript format
 */
function objectToTypescript(obj: unknown, locale: string, indent: number = 0): string {
  const spaces = '  '.repeat(indent);

  if (typeof obj === 'string') {
    // Escape single quotes, but preserve escape sequences that are already properly formatted
    const escaped = obj.replace(/'/g, "\\'");
    return `'${escaped}'`;
  }

  if (Array.isArray(obj)) {
    const items = obj.map((item) => `${spaces}  ${objectToTypescript(item, locale, indent + 1)}`);
    return `[\n${items.join(',\n')}\n${spaces}]`;
  }

  if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj);
    const items = entries.map(([key, value]) => {
      return `${spaces}  ${key}: ${objectToTypescript(value, locale, indent + 1)}`;
    });
    return `{\n${items.join(',\n')}\n${spaces}}`;
  }

  return String(obj);
}

/**
 * Find missing translations by comparing source and target objects
 */
function findMissingTranslations(sourceObj: unknown, targetObj: unknown): Record<string, unknown> {
  // Create a deep copy of the source object
  const missingObj = JSON.parse(JSON.stringify(sourceObj));

  // Remove properties that already exist in the target
  function removeExistingPaths(missing: Record<string, unknown>, existing: Record<string, unknown>) {
    if (typeof missing !== 'object' || missing === null) return;
    if (typeof existing !== 'object' || existing === null) return;

    for (const key in missing) {
      if (Object.prototype.hasOwnProperty.call(existing, key)) {
        if (
          typeof missing[key] === 'object' &&
          missing[key] !== null &&
          typeof existing[key] === 'object' &&
          existing[key] !== null
        ) {
          removeExistingPaths(missing[key] as Record<string, unknown>, existing[key] as Record<string, unknown>);
          // If the nested object is now empty, remove it
          if (
            typeof missing[key] === 'object' &&
            missing[key] !== null &&
            Object.keys(missing[key] as Record<string, unknown>).length === 0
          ) {
            delete missing[key];
          }
        } else {
          // Property exists in both, so remove from missing
          delete missing[key];
        }
      }
    }
  }

  if (typeof missingObj === 'object' && missingObj !== null && typeof targetObj === 'object' && targetObj !== null) {
    removeExistingPaths(missingObj as Record<string, unknown>, targetObj as Record<string, unknown>);
  }
  return missingObj;
}

/**
 * Translate object values using JSON prompt
 */
async function translateObjectValues(
  obj: Record<string, unknown>,
  sourceLanguage: string,
  targetLanguage: string
): Promise<Record<string, unknown>> {
  if (Object.keys(obj).length === 0) return {};

  const inputJson = JSON.stringify(obj, null, 2);

  const systemPrompt = SIMPLE_VALUE_TRANSLATION_PROMPT.replace('{sourceLanguage}', sourceLanguage).replace(
    '{targetLanguage}',
    targetLanguage
  );

  console.log(`\n📥 INPUT OBJECT:`);
  console.log('=' + '='.repeat(50));
  console.log(inputJson);
  console.log('=' + '='.repeat(50));

  try {
    const response = await openai.chat.completions.create({
      model: AZURE_OPENAI_DEPLOYMENT,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: inputJson,
        },
      ],
      temperature: 0.1, // Lower temperature for more consistency
      max_tokens: 16384,
    });

    const translatedContent = response.choices[0]?.message?.content;

    if (!translatedContent) {
      throw new Error('No translation received from Azure OpenAI API');
    }

    console.log(`\n📤 RAW OUTPUT:`);
    console.log('=' + '='.repeat(50));
    console.log(`"${translatedContent}"`);
    console.log('=' + '='.repeat(50));

    // Parse JSON response
    try {
      // Clean up common JSON formatting issues
      const cleanedContent = translatedContent.trim();
      const jsonContent = cleanedContent
        .replace(/```json\s*/, '') // Remove markdown json code blocks
        .replace(/```\s*$/, '') // Remove closing markdown code blocks
        .replace(/^[^{]*{/, '{') // Remove any text before the first {
        .replace(/}[^}]*$/, '}'); // Remove any text after the last }

      const translatedObj = JSON.parse(jsonContent);

      console.log(`\n📊 ANALYSIS:`);
      console.log(`Input object keys:`, Object.keys(obj));
      console.log(`Output object keys:`, Object.keys(translatedObj));
      console.log(`Translation successful:`, typeof translatedObj === 'object');

      return translatedObj;
    } catch (jsonError) {
      console.error(`❌ Failed to parse JSON response:`, jsonError);
      console.error(`Cleaned content:`, translatedContent.trim());
      throw jsonError;
    }
  } catch (error) {
    console.error(`❌ Object translation failed: ${error}`);
    throw error;
  }
}

/**
 * Remove extra properties from target object that don't exist in source object
 */
function removeExtraProperties(
  sourceObj: Record<string, unknown>,
  targetObj: Record<string, unknown>
): Record<string, unknown> {
  const cleanedObj: Record<string, unknown> = {};

  function cleanRecursively(
    source: Record<string, unknown>,
    target: Record<string, unknown>,
    cleaned: Record<string, unknown>
  ) {
    // Only iterate through keys that exist in the source
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        if (
          typeof source[key] === 'object' &&
          source[key] !== null &&
          !Array.isArray(source[key]) &&
          typeof target[key] === 'object' &&
          target[key] !== null &&
          !Array.isArray(target[key])
        ) {
          // Both are objects, recurse
          const nestedCleaned: Record<string, unknown> = {};
          cleanRecursively(
            source[key] as Record<string, unknown>,
            target[key] as Record<string, unknown>,
            nestedCleaned
          );
          // Only add the nested object if it has properties
          if (Object.keys(nestedCleaned).length > 0) {
            cleaned[key] = nestedCleaned;
          }
        } else {
          // Keep the property as it exists in source
          cleaned[key] = target[key];
        }
      }
      // If key doesn't exist in target, it's already missing (nothing to clean)
    }
  }

  cleanRecursively(sourceObj, targetObj, cleanedObj);
  return cleanedObj;
}

/**
 * Count properties recursively for better logging
 */
function countPropertiesRecursively(obj: Record<string, unknown>): number {
  let count = 0;
  for (const key in obj) {
    count++;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      count += countPropertiesRecursively(obj[key] as Record<string, unknown>);
    }
  }
  return count;
}

/**
 * Deep merge two objects
 */
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== 'object') {
        target[key] = {};
      }
      deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>);
    } else {
      target[key] = source[key];
    }
  }
}

/**
 * Translate TypeScript translation files
 */
async function translateTranslationFiles(sourceLocale: Locale = 'en'): Promise<void> {
  const translationsDir = join(process.cwd(), 'lib', 'translations');
  const sourceFile = join(translationsDir, `${sourceLocale}.ts`);

  if (!existsSync(sourceFile)) {
    console.error(`❌ Source translation file not found: ${sourceFile}`);
    return;
  }

  console.log(`🔤 Translating TypeScript translation files from ${sourceLocale}...`);

  // Read and parse source file
  const sourceContent = readFileSync(sourceFile, 'utf-8');
  const sourceObj = parseTypescriptObject(sourceContent);

  for (const locale of SUPPORTED_LOCALES) {
    if (locale === sourceLocale) continue;

    const targetFile = join(translationsDir, `${locale}.ts`);
    let targetObj = {};
    let originalKeyCount = 0;
    let cleanedKeyCount = 0;

    // Read existing target file if it exists
    if (existsSync(targetFile)) {
      try {
        const targetContent = readFileSync(targetFile, 'utf-8');
        targetObj = parseTypescriptObject(targetContent);
        console.log(`📖 Loaded existing translations for ${locale}`);

        // Clean up target object by removing extra properties that don't exist in source
        const originalTargetObj = JSON.parse(JSON.stringify(targetObj));
        targetObj = removeExtraProperties(sourceObj as Record<string, unknown>, targetObj as Record<string, unknown>);

        // Count properties recursively for better logging

        originalKeyCount = countPropertiesRecursively(originalTargetObj);
        cleanedKeyCount = countPropertiesRecursively(targetObj);

        if (originalKeyCount !== cleanedKeyCount) {
          console.log(`🧹 Cleaned up ${originalKeyCount - cleanedKeyCount} extra properties from ${locale}.ts`);
        }
      } catch (error) {
        console.warn(`⚠️  Failed to parse existing ${locale}.ts, will recreate:`, error);
        targetObj = {};
      }
    }

    // Find missing translations
    const missingTranslations = findMissingTranslations(sourceObj, targetObj);

    // Check if we need to write the file (either missing translations or cleanup was performed)
    const needsUpdate =
      Object.keys(missingTranslations).length > 0 || (existsSync(targetFile) && originalKeyCount !== cleanedKeyCount);

    if (!needsUpdate) {
      console.log(`✅ ${locale}.ts is already up to date`);
      continue;
    }

    const finalObj = JSON.parse(JSON.stringify(targetObj));

    if (Object.keys(missingTranslations).length > 0) {
      console.log(`📝 Found missing translations for ${locale}`);
      console.log(`Missing keys:`, Object.keys(missingTranslations));

      try {
        // Translate the entire missing object structure
        console.log(`🔄 Translating missing translations for ${locale}...`);

        const translatedMissing = await translateObjectValues(
          missingTranslations,
          LANGUAGE_NAMES[sourceLocale],
          LANGUAGE_NAMES[locale]
        );

        // Deep merge the translated missing parts with the existing target object

        deepMerge(finalObj, translatedMissing);

        // Add a small delay to respect API rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to translate ${locale}.ts:`, error);
        continue;
      }
    }

    // Convert back to TypeScript format and write
    const typescriptContent = `export const ${locale} = ${objectToTypescript(finalObj, locale)} as const;\n`;

    writeFileSync(targetFile, typescriptContent, 'utf-8');

    const actions = [];
    if (Object.keys(missingTranslations).length > 0) {
      actions.push(`added ${Object.keys(missingTranslations).length} translations`);
    }
    if (originalKeyCount !== cleanedKeyCount) {
      actions.push(`removed ${originalKeyCount - cleanedKeyCount} extra properties`);
    }

    console.log(`✅ Updated: ${targetFile} (${actions.join(', ')})`);
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];
  const sourceLocale = (args[1] as Locale) || 'en';

  if (!SUPPORTED_LOCALES.includes(sourceLocale)) {
    console.error(`❌ Unsupported source locale: ${sourceLocale}`);
    console.error(`Supported locales: ${SUPPORTED_LOCALES.join(', ')}`);
    process.exit(1);
  }

  console.log(`🚀 Starting AI translation from ${LANGUAGE_NAMES[sourceLocale]} (${sourceLocale})`);
  console.log('='.repeat(60));

  try {
    switch (command) {
      case 'blog':
        await translateBlogPosts(sourceLocale);
        break;
      case 'resources':
        await translateResources(sourceLocale);
        break;
      case 'translations':
        await translateTranslationFiles(sourceLocale);
        break;
      case 'all':
        await translateBlogPosts(sourceLocale);
        await translateResources(sourceLocale);
        await translateTranslationFiles(sourceLocale);
        break;
      default:
        console.log(`
Usage: bun run scripts/i18n-ai-translator.ts <command> [sourceLocale]

Commands:
  blog         Translate blog posts
  resources    Translate resource files  
  translations Translate TypeScript translation files
  all          Translate everything

Source Locale (optional, defaults to 'en'):
  ${SUPPORTED_LOCALES.join(', ')}

Examples:
  bun run scripts/i18n-ai-translator.ts blog
  bun run scripts/i18n-ai-translator.ts all en
  bun run scripts/i18n-ai-translator.ts translations

Environment Variables:
  AZURE_OPENAI_API_KEY - Your Azure OpenAI API key (required)
  AZURE_OPENAI_ENDPOINT - Your Azure OpenAI endpoint (required)
  AZURE_OPENAI_API_VERSION - Your Azure OpenAI API version (optional, defaults to '2024-04-01-preview')
  AZURE_OPENAI_DEPLOYMENT - Your Azure OpenAI deployment (optional, defaults to 'gpt-4o')
        `);
        break;
    }

    console.log('\n🎉 Translation process completed!');
  } catch (error) {
    console.error('\n❌ Translation process failed:', error);
    process.exit(1);
  }
}

// Run the script
if (process.argv[1]?.includes('i18n-ai-translator')) {
  main();
}
