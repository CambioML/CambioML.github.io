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

EXAMPLE:
Input: "---\\ntitle: 'Hello World'\\n---\\n# Test"
Output: "---\\ntitle: 'Bonjour le Monde'\\n---\\n# Test"

FORBIDDEN EXAMPLES:
❌ Do NOT add: code block markers, yaml/markdown/typescript blocks, or any wrappers
❌ Do NOT add: "Here is the translation:", "Translated content:", etc.
❌ Do NOT change the first or last characters of the content

Remember: Your output must be IDENTICAL in structure to the input, with only human-readable text translated.`;

// System prompt for TypeScript translation files
const TRANSLATION_FILE_SYSTEM_PROMPT = `You are a professional translator. Your ONLY task is to translate the string values in the exact TypeScript code provided by the user from {sourceLanguage} to {targetLanguage}.

CRITICAL RULES:
1. Translate ONLY the exact TypeScript code provided in the user message
2. Do NOT generate, create, or add any new code or structure
3. Only translate the text inside string quotes (single or double quotes)
4. Keep ALL object keys, variable names, syntax, and structure exactly identical
5. IMPORTANT: Change the export variable name from the source locale to the target locale (e.g., "export const en = {" should become "export const {targetLocale} = {")
6. Do NOT change any punctuation, brackets, commas, or semicolons
7. Do NOT add or remove any lines or code structure
8. Preserve all spacing and indentation exactly as provided
9. Do NOT add markdown code blocks or backticks or any formatting markers
10. Do NOT add any prefixes, suffixes, or wrapper text
11. The "export const {locale}" should be the current locale.

EXAMPLE:
Input: "export const en = {\n  name: 'Hello World',\n"
Output: "export const fr = {\n  name: 'Bonjour le Monde',\n"

FORBIDDEN EXAMPLES:
❌ Do NOT add: code block markers, typescript/javascript blocks, or any wrappers
❌ Do NOT add: "Here is the translation:", "Translated code:", etc.
❌ Do NOT change the first or last characters of the content structure

Remember: Your output must be IDENTICAL in structure to the input, with only string values translated and the export variable name changed to the target locale.`;

// System prompt for TypeScript content chunks (without export declaration)
const TRANSLATION_CONTENT_CHUNK_SYSTEM_PROMPT = `You are a professional translator. Your ONLY task is to translate the string values in the exact TypeScript object content provided by the user from {sourceLanguage} to {targetLanguage}.

CRITICAL RULES:
1. Translate ONLY the exact TypeScript object content provided in the user message
2. Do NOT generate, create, or add any new code or structure
3. Only translate the text inside string quotes (single or double quotes)
4. Keep ALL object keys, variable names, syntax, and structure exactly identical
5. Do NOT add any export declarations or variable assignments
6. Do NOT change any punctuation, brackets, commas, or semicolons
7. Do NOT add or remove any lines or code structure
8. Preserve all spacing and indentation exactly as provided
9. Do NOT add markdown code blocks or backticks or any formatting markers
10. Do NOT add any prefixes, suffixes, or wrapper text
11. When using single quotes for strings, properly escape ANY apostrophes (contractions, possessives, or within words) using backslash (e.g., "he's" becomes "he\\'s", "all'ufficio" becomes "all\\'ufficio")

EXAMPLE:
Input:   name: 'Hello World',\n  greeting: 'Hi there'
Output:   name: 'Bonjour le Monde',\n  greeting: 'Salut'

Input:   message: "He's coming",\n  status: "It's ready"
Output:   message: "Il arrive",\n  status: "C'est prêt"

Input:   description: 'Improve workflows from field to office',\n  title: 'User\\'s guide'
Output:   description: 'Migliora i flussi di lavoro dal campo all\\'ufficio',\n  title: 'Guida dell\\'utente'

FORBIDDEN EXAMPLES:
❌ Do NOT add: export declarations, variable assignments, or any wrappers
❌ Do NOT add: "Here is the translation:", "Translated code:", etc.
❌ Do NOT add: code block markers, typescript/javascript blocks

Remember: Your output must be IDENTICAL in structure to the input, with only string values translated.`;

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
    // For TypeScript files, handle export declaration specially
    const lines = content.split('\n');
    const exportLineIndex = lines.findIndex((line) => line.trim().startsWith('export const'));

    if (exportLineIndex === -1) {
      // Fallback to simple line-based splitting if no export found
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

    // For TypeScript files with export, preserve the export in first chunk only
    const exportLine = lines[exportLineIndex];
    const beforeExport = lines.slice(0, exportLineIndex);
    const afterExport = lines.slice(exportLineIndex + 1);

    // First chunk: everything up to and including the export line
    const firstChunk = [...beforeExport, exportLine].join('\n');
    chunks.push(firstChunk);

    // Subsequent chunks: just the object content without export declarations
    let currentChunk = '';
    for (const line of afterExport) {
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
  isBlogPost: boolean = true,
  targetLocale?: string
): Promise<string> {
  const estimatedTokens = estimateTokenCount(content);
  const maxTokensPerChunk = 10000;

  // If content is small enough, translate directly
  if (estimatedTokens <= maxTokensPerChunk) {
    console.log(`📄 Single chunk translation (${estimatedTokens} tokens)`);
    return await translateSingleChunk(content, sourceLanguage, targetLanguage, isBlogPost, targetLocale, true, 0);
  }

  // Split into chunks and translate each
  console.log(`📄 Large file detected (${estimatedTokens} tokens), splitting into chunks...`);
  const chunks = splitContentIntoChunks(content, isBlogPost, maxTokensPerChunk);

  console.log(`📦 Split into ${chunks.length} chunks`);

  const translatedChunks: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const isFirstChunk = i === 0;
    console.log(`🔄 Translating chunk ${i + 1}/${chunks.length} (${estimateTokenCount(chunk)} tokens)...`);

    // Log chunk input
    console.log(
      `📥 Chunk ${i + 1} input (first 200 chars):`,
      chunk.substring(0, 200) + (chunk.length > 200 ? '...' : '')
    );

    try {
      const translatedChunk = await translateSingleChunk(
        chunk,
        sourceLanguage,
        targetLanguage,
        isBlogPost,
        targetLocale,
        isFirstChunk,
        i
      );

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
async function translateSingleChunk(
  content: string,
  sourceLanguage: string,
  targetLanguage: string,
  isBlogPost: boolean = true,
  targetLocale?: string,
  isFirstChunk: boolean = true,
  chunkIndex: number = 0
): Promise<string> {
  // Use the appropriate system prompt based on content type and chunk position
  let systemPrompt: string;

  if (isBlogPost) {
    systemPrompt = BLOG_TRANSLATION_SYSTEM_PROMPT;
  } else if (isFirstChunk || chunkIndex === 0) {
    // First chunk of TypeScript file (contains export declaration)
    systemPrompt = TRANSLATION_FILE_SYSTEM_PROMPT;
  } else {
    // Subsequent chunks of TypeScript file (content only, no export)
    systemPrompt = TRANSLATION_CONTENT_CHUNK_SYSTEM_PROMPT;
  }

  // Format the system prompt with language information
  let formattedSystemPrompt = systemPrompt
    .replace('{sourceLanguage}', sourceLanguage)
    .replace('{targetLanguage}', targetLanguage);

  // For translation files, also replace the target locale code if needed
  if (!isBlogPost && targetLocale) {
    formattedSystemPrompt = formattedSystemPrompt.replace(/\{targetLocale\}/g, targetLocale);
  }

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

  for (const locale of SUPPORTED_LOCALES) {
    if (locale === sourceLocale) continue;

    const targetFile = join(translationsDir, `${locale}.ts`);

    // Skip if translation already exists
    if (existsSync(targetFile)) {
      console.log(`⏭️  Skipping ${locale}.ts - already exists`);
      continue;
    }

    try {
      const sourceContent = readFileSync(sourceFile, 'utf-8');

      console.log(`📝 Translating: ${locale}.ts`);
      const translatedContent = await translateContent(
        sourceContent,
        LANGUAGE_NAMES[sourceLocale],
        LANGUAGE_NAMES[locale],
        false,
        locale
      );

      writeFileSync(targetFile, translatedContent, 'utf-8');
      console.log(`✅ Created: ${targetFile}`);

      // Add a small delay to respect API rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to translate ${locale}.ts:`, error);
    }
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
