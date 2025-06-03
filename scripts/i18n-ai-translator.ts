#!/usr/bin/env bun

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import OpenAI from 'openai';

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
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

// Initialize OpenAI client
if (!OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY environment variable is required');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
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

// Translation prompt for blog posts
const BLOG_TRANSLATION_PROMPT = `You are a professional translator and technical content specialist. Your task is to translate blog posts from one language to another while maintaining the technical accuracy, tone, and structure.

Guidelines:
1. Preserve all markdown formatting (headers, links, code blocks, images, etc.)
2. Keep all technical terms accurate and consistent
3. Maintain the original tone and style
4. Preserve any metadata/frontmatter at the top of the file
5. Keep URLs, image paths, and code examples unchanged
6. Adapt cultural references appropriately for the target audience
7. Ensure the translation reads naturally in the target language
8. Keep brand names and product names unchanged unless there's an official localized version
9. CRITICAL: Always use double quotes for all frontmatter metadata fields:
   - Use double quotes for title: "Your translated title"
   - Use double quotes for keywords: "keyword1,keyword2,keyword3"
   - Use double quotes for any other string fields in the frontmatter
   - Ensure all frontmatter fields remain syntactically valid YAML
   - Example: keywords: "déploiement AWS,contrôle de l'infrastructure,mode hors ligne"

Source Language: {sourceLanguage}
Target Language: {targetLanguage}

Return only the translated content, preserving all markdown formatting and ensuring double quotes for all frontmatter metadata.

Please translate the following blog post:

{content}`;

// Translation prompt for TypeScript translation files
const TRANSLATION_FILE_PROMPT = `You are a professional translator specializing in software localization. Your task is to translate a TypeScript translation file from one language to another.

CRITICAL INSTRUCTIONS:
1. Output ONLY the TypeScript code - NO markdown formatting, NO code blocks, NO backticks
2. Preserve the exact TypeScript structure and formatting
3. Keep all object keys unchanged
4. Translate only the string values
5. Maintain consistent terminology throughout
6. Keep proper TypeScript syntax (quotes, commas, semicolons)
7. Preserve any template literals or interpolation syntax
8. Ensure translations are appropriate for a technical/business context
9. Keep brand names unchanged unless there's an official localized version
10. The output should be ready to save directly as a .ts file
11. IMPORTANT: Replace the export variable name with the target locale code. For example, if translating to German (de), use "export const de =" instead of "export const en ="
12. CRITICAL: Properly escape all quotes and special characters in strings:
    - If using single quotes for strings, escape internal single quotes as \'
    - If using double quotes for strings, escape internal double quotes as \"
    - Escape backslashes as \\
    - Ensure all strings are properly terminated and valid TypeScript

Source Language: {sourceLanguage}
Target Language: {targetLanguage}
Target Locale Code: {targetLocale}

Translate the following TypeScript translation file:

{content}

Remember: 
- Output ONLY the TypeScript code without any markdown formatting
- Replace the export variable name with "{targetLocale}" (e.g., "export const {targetLocale} =")
- PROPERLY ESCAPE ALL QUOTES AND SPECIAL CHARACTERS in translated strings
- Use consistent quote style (single quotes) throughout the file
- Ensure all strings are syntactically valid TypeScript`;

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
  const prompt = isBlogPost ? BLOG_TRANSLATION_PROMPT : TRANSLATION_FILE_PROMPT;

  let formattedPrompt = prompt
    .replace('{sourceLanguage}', sourceLanguage)
    .replace('{targetLanguage}', targetLanguage)
    .replace('{content}', content);

  // For translation files, also replace the target locale code
  if (!isBlogPost && targetLocale) {
    formattedPrompt = formattedPrompt.replace(/\{targetLocale\}/g, targetLocale);
  }

  try {
    console.log(`🔄 Translating from ${sourceLanguage} to ${targetLanguage}...`);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using the most capable model for best translation quality
      messages: [
        {
          role: 'system',
          content:
            'You are a professional translator with expertise in technical content, marketing copy, and software localization.',
        },
        {
          role: 'user',
          content: formattedPrompt,
        },
      ],
      temperature: 0.3, // Low temperature for consistent, accurate translations
      max_tokens: 8000, // Increased to handle large translation files
    });

    const translatedContent = response.choices[0]?.message?.content;

    if (!translatedContent) {
      throw new Error('No translation received from OpenAI API');
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
  OPENAI_API_KEY - Your OpenAI API key (required)
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
