#!/usr/bin/env bun

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import OpenAI from 'openai';

// Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SUPPORTED_LOCALES = [
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

const METADATA_TRANSLATION_PROMPT = `You are a professional translator specializing in SEO and marketing content. Your task is to translate website metadata (titles, descriptions, keywords) from English to {targetLanguage}.

CRITICAL INSTRUCTIONS:
1. Output ONLY a valid JavaScript object - NO markdown formatting, NO code blocks, NO backticks
2. Keep the exact same object structure as the input
3. Translate only the string values, keeping object keys unchanged
4. Ensure translations are SEO-optimized and marketing-appropriate
5. Keep brand names unchanged
6. Make sure titles are compelling and under 60 characters when possible
7. Make sure descriptions are compelling and under 160 characters when possible
8. Adapt keywords to be relevant for {targetLanguage} speakers searching for AI automation tools
9. Properly escape all quotes and special characters
10. The output should be valid JavaScript object syntax

Target Language: {targetLanguage}

Translate this metadata object:

{content}

Output only the translated JavaScript object:`;

async function translateMetadata(content: string, targetLanguage: string): Promise<string> {
  const prompt = METADATA_TRANSLATION_PROMPT.replace(/\{targetLanguage\}/g, targetLanguage).replace(
    '{content}',
    content
  );

  try {
    console.log(`🔄 Translating metadata to ${targetLanguage}...`);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator with expertise in SEO and marketing content localization.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
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

async function addMetadataToTranslationFiles(): Promise<void> {
  const translationsDir = join(process.cwd(), 'lib', 'translations');
  const englishFile = join(translationsDir, 'en.ts');

  // Read the English metadata section
  const englishContent = readFileSync(englishFile, 'utf-8');
  const metadataMatch = englishContent.match(/metadata:\s*\{[\s\S]*?\},/);

  if (!metadataMatch) {
    console.error('❌ Could not find metadata section in English file');
    return;
  }

  const englishMetadata = metadataMatch[0];
  console.log('📋 Found English metadata section');

  for (const locale of SUPPORTED_LOCALES) {
    const targetFile = join(translationsDir, `${locale}.ts`);

    if (!existsSync(targetFile)) {
      console.log(`⏭️  Skipping ${locale}.ts - file does not exist`);
      continue;
    }

    const targetContent = readFileSync(targetFile, 'utf-8');

    // Check if metadata already exists
    if (targetContent.includes('metadata:')) {
      console.log(`⏭️  Skipping ${locale}.ts - metadata already exists`);
      continue;
    }

    try {
      // Translate the metadata
      const translatedMetadata = await translateMetadata(englishMetadata, LANGUAGE_NAMES[locale]);

      // Insert the translated metadata at the beginning of the export
      const updatedContent = targetContent.replace(
        /export const \w+ = \{/,
        `export const ${locale} = {\n  ${translatedMetadata.replace(/^metadata:/, 'metadata:')}`
      );

      writeFileSync(targetFile, updatedContent, 'utf-8');
      console.log(`✅ Added metadata to ${locale}.ts`);

      // Add a small delay to respect API rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Failed to add metadata to ${locale}.ts:`, error);
    }
  }
}

async function main(): Promise<void> {
  console.log('🚀 Starting metadata translation process');
  console.log('='.repeat(60));

  try {
    await addMetadataToTranslationFiles();
    console.log('\n🎉 Metadata translation process completed!');
  } catch (error) {
    console.error('\n❌ Metadata translation process failed:', error);
    process.exit(1);
  }
}

// Run the script
if (process.argv[1]?.includes('translate-metadata')) {
  main();
}
