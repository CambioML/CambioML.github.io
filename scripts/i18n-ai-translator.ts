#!/usr/bin/env bun

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { AzureOpenAI } from 'openai';
import { analyzeTranslationChanges, analyzeBlogChanges } from './i18n-diff-checker';

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
  }
}

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
 * Remove lines exactly using line numbers and exact content matching
 */
function removeMatchingLines(
  targetContent: string,
  deletedChanges: Array<{ lineNumber: number; content: string; action: 'deleted' }>
): string {
  if (deletedChanges.length === 0) return targetContent;

  const lines = targetContent.split('\n');
  const linesToRemove = new Set<number>();

  console.log(`🗑️  Removing ${deletedChanges.length} deleted lines from target content...`);

  // Sort deletions by line number to process in order
  const sortedDeletions = [...deletedChanges].sort((a, b) => a.lineNumber - b.lineNumber);

  for (const deletion of sortedDeletions) {
    const deletedContent = deletion.content;
    const deletedLineNumber = deletion.lineNumber;

    console.log(`   🔍 Removing line ${deletedLineNumber}: "${deletedContent.substring(0, 60)}..."`);

    // Strategy 1: Try exact line number match first (if line exists and not already marked for deletion)
    const targetLineIndex = deletedLineNumber - 1; // Convert to 0-based index
    if (targetLineIndex >= 0 && targetLineIndex < lines.length && !linesToRemove.has(targetLineIndex)) {
      linesToRemove.add(targetLineIndex);
      console.log(
        `   ✅ Line ${deletedLineNumber} marked for removal: "${lines[targetLineIndex].substring(0, 50)}..."`
      );
      continue;
    }

    // Strategy 2: Find first exact content match (for cases where line numbers don't align)
    let found = false;
    const trimmedDeletedContent = deletedContent.trim();

    for (let i = 0; i < lines.length; i++) {
      if (linesToRemove.has(i)) continue;

      const targetLine = lines[i].trim();
      if (targetLine === trimmedDeletedContent) {
        linesToRemove.add(i);
        console.log(`   ✅ Found exact content match at line ${i + 1}: "${targetLine.substring(0, 50)}..."`);
        found = true;
        break;
      }
    }

    // Strategy 3: For empty lines, find first empty line
    if (!found && trimmedDeletedContent === '') {
      for (let i = 0; i < lines.length; i++) {
        if (!linesToRemove.has(i) && lines[i].trim() === '') {
          linesToRemove.add(i);
          console.log(`   ✅ Found empty line at line ${i + 1}`);
          found = true;
          break;
        }
      }
    }

    if (!found) {
      console.warn(`   ⚠️  Could not find line to delete: "${trimmedDeletedContent.substring(0, 50)}..."`);
    }
  }

  console.log(`🗑️  Removing ${linesToRemove.size} lines total`);

  // Remove lines in reverse order to avoid index shifting
  const sortedIndices = Array.from(linesToRemove).sort((a, b) => b - a);
  for (const index of sortedIndices) {
    console.log(`   🗑️  Removing line ${index + 1}: "${lines[index].substring(0, 50)}..."`);
    lines.splice(index, 1);
  }

  return lines.join('\n');
}

/**
 * Apply line-level changes to a target file using exact line operations
 */
function applyLinesToFile(
  targetContent: string,
  changes: Array<{ lineNumber: number; content: string; action: 'added' | 'deleted' }>
): string {
  // Separate additions and deletions
  const additions = changes.filter((c) => c.action === 'added');
  const deletions = changes.filter((c) => c.action === 'deleted') as Array<{
    lineNumber: number;
    content: string;
    action: 'deleted';
  }>;

  // First, handle deletions using exact line matching
  let updatedContent = removeMatchingLines(targetContent, deletions);

  // Then handle additions by exact line number
  if (additions.length > 0) {
    const updatedLines = updatedContent.split('\n');

    // Sort additions by line number in descending order to avoid index shifting
    const sortedAdditions = [...additions].sort((a, b) => b.lineNumber - a.lineNumber);

    console.log(`➕ Adding ${additions.length} new lines...`);

    for (const addition of sortedAdditions) {
      const lineIndex = Math.max(0, Math.min(addition.lineNumber - 1, updatedLines.length));
      updatedLines.splice(lineIndex, 0, addition.content);
      console.log(`   ➕ Added line ${addition.lineNumber}: "${addition.content.substring(0, 50)}..."`);
    }

    updatedContent = updatedLines.join('\n');
  }

  return updatedContent;
}

/**
 * Apply translated changes to a target blog file
 */
async function applyChangesToTargetFile(
  sourceFile: string,
  targetLocale: Locale,
  filename: string,
  addedChanges: Array<{ lineNumber: number; content: string; action: 'added' }>,
  deletedChanges: Array<{ lineNumber: number; content: string; action: 'deleted' }>,
  translatedLines: string[]
): Promise<void> {
  const targetFilePath = join(process.cwd(), 'blog', targetLocale, filename);

  // Ensure target directory exists
  const targetDir = join(process.cwd(), 'blog', targetLocale);
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
    console.log(`📁 Created directory: ${targetDir}`);
  }

  let targetContent = '';

  // Read existing target file or create from source as template
  if (existsSync(targetFilePath)) {
    targetContent = readFileSync(targetFilePath, 'utf-8');
    console.log(`   📖 Updating existing ${targetLocale}/${filename}`);
  } else {
    // If target doesn't exist, translate the entire source file first
    console.log(`   📄 Creating new ${targetLocale}/${filename} from source`);
    const sourceFilePath = join(process.cwd(), sourceFile);
    const sourceContent = readFileSync(sourceFilePath, 'utf-8');

    try {
      const sourceFileLocale = sourceFile.split('/')[1] as Locale;
      targetContent = await translateContent(
        sourceContent,
        LANGUAGE_NAMES[sourceFileLocale],
        LANGUAGE_NAMES[targetLocale],
        true
      );
    } catch (error) {
      console.error(`❌ Failed to create base translation for ${targetLocale}/${filename}:`, error);
      return;
    }
  }

  // Apply all changes together (deletions and additions)
  const allChangesToApply: Array<{
    lineNumber: number;
    content: string;
    action: 'added' | 'deleted';
  }> = [];

  // Add deletions
  deletedChanges.forEach((change) => {
    allChangesToApply.push({
      lineNumber: change.lineNumber,
      content: change.content,
      action: 'deleted',
    });
  });

  // Add additions with translated content
  addedChanges.forEach((change, index) => {
    allChangesToApply.push({
      lineNumber: change.lineNumber,
      content: index < translatedLines.length ? translatedLines[index] : change.content,
      action: 'added',
    });
  });

  if (allChangesToApply.length > 0) {
    targetContent = applyLinesToFile(targetContent, allChangesToApply);
    console.log(
      `   🔄 Applied ${deletedChanges.length} deletions and ${addedChanges.length} additions to ${targetLocale}/${filename}`
    );
  }

  // Write the updated content
  writeFileSync(targetFilePath, targetContent, 'utf-8');
  console.log(`   💾 Saved ${targetFilePath}`);
}

/**
 * Translate blog posts using diff-based approach
 */
async function translateBlogPostsDiffBased(): Promise<void> {
  console.log('🔍 Analyzing blog post changes using diff checker...');

  try {
    // Use diff checker to identify blog changes
    const blogDiffResult = analyzeBlogChanges();

    if (blogDiffResult.modifiedFiles.length === 0) {
      console.log('ℹ️  No changes detected in blog posts. All target files are up to date.');
      return;
    }

    console.log(`📝 Found changes in ${blogDiffResult.modifiedFiles.length} blog files:`);
    blogDiffResult.modifiedFiles.forEach((file) => console.log(`   - ${file}`));

    // Group changes by file
    const changesByFile = new Map<
      string,
      Array<{ lineNumber: number; content: string; action: 'added' | 'deleted' }>
    >();

    blogDiffResult.changes.forEach((change) => {
      if (!changesByFile.has(change.file)) {
        changesByFile.set(change.file, []);
      }
      changesByFile.get(change.file)!.push(change);
    });

    // Process each modified file
    for (const sourceFile of Array.from(changesByFile.keys())) {
      const changes = changesByFile.get(sourceFile)!;
      console.log(`\n📄 Processing ${sourceFile}...`);

      // Extract locale and filename from path (e.g., "blog/en/file.md" -> locale="en", filename="file.md")
      const pathParts = sourceFile.split('/');
      if (pathParts.length < 3 || pathParts[0] !== 'blog') {
        console.warn(`⚠️  Skipping invalid blog path: ${sourceFile}`);
        continue;
      }

      const sourceLocale = pathParts[1] as Locale;
      const filename = pathParts.slice(2).join('/');

      if (!SUPPORTED_LOCALES.includes(sourceLocale)) {
        console.warn(`⚠️  Skipping unsupported locale: ${sourceLocale}`);
        continue;
      }

      // Verify source file exists
      const sourceFilePath = join(process.cwd(), sourceFile);
      if (!existsSync(sourceFilePath)) {
        console.warn(`⚠️  Source file not found: ${sourceFilePath}`);
        continue;
      }

      // Separate added and deleted changes
      const addedChanges = changes.filter((c) => c.action === 'added') as Array<{
        lineNumber: number;
        content: string;
        action: 'added';
      }>;
      const deletedChanges = changes.filter((c) => c.action === 'deleted') as Array<{
        lineNumber: number;
        content: string;
        action: 'deleted';
      }>;

      console.log(`   📊 Changes: ${addedChanges.length} additions, ${deletedChanges.length} deletions`);

      // Translate only the added lines if there are any
      if (addedChanges.length > 0) {
        const linesToTranslate = addedChanges.map((c) => c.content).join('\n');

        console.log(`   🔄 Translating ${addedChanges.length} added lines...`);

        // Translate to each target locale
        for (const targetLocale of SUPPORTED_LOCALES) {
          if (targetLocale === sourceLocale) continue;

          try {
            const translatedContent = await translateContent(
              linesToTranslate,
              LANGUAGE_NAMES[sourceLocale],
              LANGUAGE_NAMES[targetLocale],
              true
            );

            const translatedLinesArray = translatedContent.split('\n');

            // Apply changes to target file
            await applyChangesToTargetFile(
              sourceFile,
              targetLocale,
              filename,
              addedChanges,
              deletedChanges,
              translatedLinesArray
            );

            // Add delay between locales to respect API rate limits
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(`❌ Failed to translate changes for ${targetLocale}:`, error);
            continue;
          }
        }
      } else {
        // Only deletions, apply to all target locales
        for (const targetLocale of SUPPORTED_LOCALES) {
          if (targetLocale === sourceLocale) continue;

          await applyChangesToTargetFile(sourceFile, targetLocale, filename, [], deletedChanges, []);
        }
      }
    }

    console.log('\n✅ Diff-based blog translation completed!');
  } catch (error) {
    console.error('❌ Failed to analyze blog changes:', error);
    throw error;
  }
}

/**
 * Translate blog posts (legacy full-file approach - kept for fallback)
 */
async function translateBlogPostsLegacy(sourceLocale: Locale = 'en'): Promise<void> {
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
 * Translate blog posts using diff-based approach by default
 */
async function translateBlogPosts(sourceLocale: Locale = 'en'): Promise<void> {
  try {
    // Try diff-based translation first
    await translateBlogPostsDiffBased();
  } catch (error) {
    console.warn('⚠️  Diff-based translation failed, falling back to legacy method:', error);
    await translateBlogPostsLegacy(sourceLocale);
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
      return evalFunction();
    } catch {
      // Fallback to JSON parsing approach if eval fails
      console.warn('⚠️  Eval approach failed, trying JSON parsing fallback');
      const jsonString = objectString
        .replace(/'/g, '"')
        .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
        .replace(/(\w+):/g, '"$1":'); // Quote object keys

      return JSON.parse(jsonString);
    }
  } catch (error) {
    console.error('❌ Failed to parse TypeScript object:', error);
    console.error('Content preview:', content.substring(0, 200) + '...');
    throw error;
  }
}

/**
 * Properly escape a string for TypeScript/JavaScript
 */
function escapeString(str: string): string {
  return str
    .replace(/\\/g, '\\\\') // Escape backslashes first
    .replace(/'/g, "\\'") // Escape single quotes
    .replace(/"/g, '\\"') // Escape double quotes
    .replace(/\n/g, '\\n') // Escape newlines
    .replace(/\r/g, '\\r') // Escape carriage returns
    .replace(/\t/g, '\\t') // Escape tabs
    .replace(/\f/g, '\\f') // Escape form feeds
    .replace(/\v/g, '\\v') // Escape vertical tabs
    .replace(/\0/g, '\\0') // Escape null characters
    .replace(/\u2028/g, '\\u2028') // Escape line separator
    .replace(/\u2029/g, '\\u2029'); // Escape paragraph separator
}

/**
 * Convert a JavaScript object back to TypeScript format
 */
function objectToTypescript(obj: unknown, locale: string, indent: number = 0): string {
  const spaces = '  '.repeat(indent);

  if (typeof obj === 'string') {
    return `'${escapeString(obj)}'`;
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
 * Extract specific properties from an object based on dot notation paths
 */
function extractPropertiesByPaths(obj: Record<string, unknown>, paths: string[]): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const path of paths) {
    const keys = path.split('.');
    let sourceValue: unknown = obj;
    let targetRef: Record<string, unknown> = result;

    // Navigate to the value in the source object
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (i === keys.length - 1) {
        // Last key - set the value
        if (sourceValue && typeof sourceValue === 'object' && key in sourceValue) {
          targetRef[key] = (sourceValue as Record<string, unknown>)[key];
        }
      } else {
        // Intermediate key - ensure path exists in both source and target
        if (sourceValue && typeof sourceValue === 'object' && key in sourceValue) {
          sourceValue = (sourceValue as Record<string, unknown>)[key];

          if (!targetRef[key] || typeof targetRef[key] !== 'object') {
            targetRef[key] = {};
          }
          targetRef = targetRef[key] as Record<string, unknown>;
        } else {
          // Path doesn't exist in source
          break;
        }
      }
    }
  }

  return result;
}

/**
 * Apply property changes to a target object based on diff analysis
 */
function applyPropertyChanges(
  targetObj: Record<string, unknown>,
  changes: Array<{ path: string; action: 'added' | 'modified' | 'deleted'; newValue?: unknown }>
): Record<string, unknown> {
  const result = JSON.parse(JSON.stringify(targetObj));

  for (const change of changes) {
    const keys = change.path.split('.');
    let currentRef: Record<string, unknown> = result;

    // Navigate to parent object
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!currentRef[key] || typeof currentRef[key] !== 'object') {
        currentRef[key] = {};
      }
      currentRef = currentRef[key] as Record<string, unknown>;
    }

    const finalKey = keys[keys.length - 1];

    if (change.action === 'deleted') {
      delete currentRef[finalKey];
    } else if (change.action === 'added' || change.action === 'modified') {
      currentRef[finalKey] = change.newValue;
    }
  }

  return result;
}

/**
 * Validate and fix AI response to ensure proper string escaping
 */
function validateAndFixAiResponse(response: string): string {
  // Check for common issues and fix them
  let fixed = response.trim();

  // Remove markdown code blocks if present
  fixed = fixed
    .replace(/```json\s*/, '')
    .replace(/```\s*$/, '')
    .replace(/^[^{]*{/, '{')
    .replace(/}[^}]*$/, '}');

  console.log(`🔍 Validating AI response...`);

  try {
    // Parse to validate JSON structure
    const parsed = JSON.parse(fixed);

    // Check for unescaped newlines in string values
    const hasUnescapedNewlines = checkForUnescapedNewlines(parsed);
    if (hasUnescapedNewlines) {
      console.log(`⚠️  Found unescaped newlines, fixing...`);
      const fixedParsed = fixUnescapedNewlines(parsed);
      fixed = JSON.stringify(fixedParsed, null, 2);
    }

    console.log(`✅ AI response validation passed`);
    return fixed;
  } catch (error) {
    console.error(`❌ AI response validation failed:`, error);
    console.error(`Response content:`, fixed.substring(0, 500) + '...');
    throw new Error(`Invalid AI response: ${error}`);
  }
}

/**
 * Recursively check for unescaped newlines in object values
 */
function checkForUnescapedNewlines(obj: unknown): boolean {
  if (typeof obj === 'string') {
    return obj.includes('\n') || obj.includes('\r');
  }

  if (Array.isArray(obj)) {
    return obj.some((item) => checkForUnescapedNewlines(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    return Object.values(obj).some((value) => checkForUnescapedNewlines(value));
  }

  return false;
}

/**
 * Recursively fix unescaped newlines in object values
 */
function fixUnescapedNewlines(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return obj.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => fixUnescapedNewlines(item));
  }

  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = fixUnescapedNewlines(value);
    }
    return result;
  }

  return obj;
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

    // Validate and fix AI response
    const validatedContent = validateAndFixAiResponse(translatedContent);

    // Parse JSON response
    try {
      const translatedObj = JSON.parse(validatedContent);

      console.log(`\n📊 ANALYSIS:`);
      console.log(`Input object keys:`, Object.keys(obj));
      console.log(`Output object keys:`, Object.keys(translatedObj));
      console.log(`Translation successful:`, typeof translatedObj === 'object');

      return translatedObj;
    } catch (jsonError) {
      console.error(`❌ Failed to parse JSON response:`, jsonError);
      console.error(`Validated content:`, validatedContent);
      throw jsonError;
    }
  } catch (error) {
    console.error(`❌ Object translation failed: ${error}`);
    throw error;
  }
}

/**
 * Translate translation files using diff-based approach
 */
async function translateTranslationFilesDiffBased(sourceLocale: Locale = 'en'): Promise<void> {
  const translationsDir = join(process.cwd(), 'lib', 'translations');
  const sourceFile = join(translationsDir, `${sourceLocale}.ts`);

  if (!existsSync(sourceFile)) {
    console.error(`❌ Source translation file not found: ${sourceFile}`);
    return;
  }

  console.log(`🔍 Analyzing translation changes using diff checker...`);

  try {
    // Use diff checker to identify changes
    const diffResult = analyzeTranslationChanges();

    if (diffResult.modifiedProperties.length === 0) {
      console.log(`ℹ️  No changes detected in translation files. All target files are up to date.`);
      return;
    }

    console.log(`📝 Found ${diffResult.modifiedProperties.length} changed properties:`);
    diffResult.modifiedProperties.forEach((prop) => console.log(`   - ${prop}`));

    // Read and parse source file
    const sourceContent = readFileSync(sourceFile, 'utf-8');
    const sourceObj = parseTypescriptObject(sourceContent);

    // Extract only the changed properties from source
    const changedProperties = extractPropertiesByPaths(
      sourceObj as Record<string, unknown>,
      diffResult.modifiedProperties
    );

    if (Object.keys(changedProperties).length === 0) {
      console.log(`ℹ️  No translatable properties found in changes.`);
      return;
    }

    // Translate to each target locale
    for (const locale of SUPPORTED_LOCALES) {
      if (locale === sourceLocale) continue;

      const targetFile = join(translationsDir, `${locale}.ts`);
      let targetObj: Record<string, unknown> = {};

      // Read existing target file if it exists
      if (existsSync(targetFile)) {
        try {
          const targetContent = readFileSync(targetFile, 'utf-8');
          targetObj = parseTypescriptObject(targetContent) as Record<string, unknown>;
          console.log(`📖 Loaded existing translations for ${locale}`);
        } catch (error) {
          console.warn(`⚠️  Failed to parse existing ${locale}.ts, will recreate:`, error);
          targetObj = {};
        }
      }

      console.log(`🔄 Translating changes to ${LANGUAGE_NAMES[locale]} (${locale})...`);

      try {
        // Translate only the changed properties
        const translatedChanges = await translateObjectValues(
          changedProperties,
          LANGUAGE_NAMES[sourceLocale],
          LANGUAGE_NAMES[locale]
        );

        // Apply the translated changes to the target object
        const updatedChanges = diffResult.changes.map((change) => ({
          path: change.path,
          action: change.action,
          newValue: change.action === 'deleted' ? undefined : getNestedValue(translatedChanges, change.path),
        }));

        const finalObj = applyPropertyChanges(targetObj, updatedChanges);

        // Convert back to TypeScript format and write
        const typescriptContent = `export const ${locale} = ${objectToTypescript(finalObj, locale)} as const;\n`;

        writeFileSync(targetFile, typescriptContent, 'utf-8');
        console.log(`✅ Updated: ${targetFile} (${diffResult.changes.length} changes applied)`);

        // Add a small delay to respect API rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`❌ Failed to translate changes for ${locale}:`, error);
        continue;
      }
    }
  } catch (error) {
    console.error(`❌ Failed to analyze translation changes:`, error);
    throw error;
  }
}

/**
 * Get nested value from object using dot notation path
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return current;
}

/**
 * Translate TypeScript translation files (legacy approach - kept for fallback)
 */
async function translateTranslationFiles(sourceLocale: Locale = 'en'): Promise<void> {
  // Use the new diff-based approach by default
  return translateTranslationFilesDiffBased(sourceLocale);
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
