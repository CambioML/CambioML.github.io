#!/usr/bin/env bun

import { execSync } from 'child_process';

interface TranslationChange {
  path: string;
  oldValue?: string;
  newValue?: string;
  action: 'added' | 'modified' | 'deleted';
}

interface BlogPostChange {
  file: string;
  lineNumber: number;
  content: string;
  action: 'added' | 'deleted';
}

interface DiffAnalysisResult {
  modifiedProperties: string[];
  changes: TranslationChange[];
}

interface BlogDiffAnalysisResult {
  modifiedFiles: string[];
  changes: BlogPostChange[];
}

/**
 * Extract property path and value from a TypeScript line
 */
function extractPropertyFromLine(line: string): { path: string; value: string } | null {
  const trimmedLine = line.trim();

  // Match property definitions like: "title: 'Hello World'," or "nav: {"
  const match = trimmedLine.match(/^(\w+(?:\.\w+)*)\s*:\s*['"`]([^'"`]*)['"`]/);
  if (match) {
    return {
      path: match[1],
      value: match[2],
    };
  }

  return null;
}

/**
 * Parse git diff output to extract translation changes
 */
function parseGitDiff(diffOutput: string): DiffAnalysisResult {
  const lines = diffOutput.split('\n');
  const changes: TranslationChange[] = [];
  const modifiedProperties = new Set<string>();

  let inTranslationFile = false;
  const pathStack: string[] = [];

  for (const line of lines) {
    // Check if we're in the translation file section
    if (line.startsWith('diff --git') && line.includes('lib/translations/en.ts')) {
      inTranslationFile = true;
      continue;
    }

    if (line.startsWith('diff --git') && !line.includes('lib/translations/en.ts')) {
      inTranslationFile = false;
      continue;
    }

    if (!inTranslationFile) continue;

    // Skip file headers
    if (line.startsWith('---') || line.startsWith('+++') || line.startsWith('@@')) {
      continue;
    }

    // Handle added lines (new translations)
    if (line.startsWith('+') && !line.startsWith('+++')) {
      const content = line.substring(1).trim();
      const property = extractPropertyFromLine(content);

      if (property) {
        const fullPath = pathStack.length > 0 ? `${pathStack.join('.')}.${property.path}` : property.path;
        changes.push({
          path: fullPath,
          newValue: property.value,
          action: 'added',
        });
        modifiedProperties.add(fullPath);
      }

      // Track object nesting
      if (content.includes(': {')) {
        const objName = content.split(':')[0].trim();
        pathStack.push(objName);
      } else if (content === '},') {
        pathStack.pop();
      }
    }

    // Handle deleted lines (removed translations)
    if (line.startsWith('-') && !line.startsWith('---')) {
      const content = line.substring(1).trim();
      const property = extractPropertyFromLine(content);

      if (property) {
        const fullPath = pathStack.length > 0 ? `${pathStack.join('.')}.${property.path}` : property.path;
        changes.push({
          path: fullPath,
          oldValue: property.value,
          action: 'deleted',
        });
        modifiedProperties.add(fullPath);
      }

      // Track object nesting for deleted lines too
      if (content.includes(': {')) {
        const objName = content.split(':')[0].trim();
        pathStack.push(objName);
      } else if (content === '},') {
        pathStack.pop();
      }
    }
  }

  // Merge add/delete pairs into modifications
  const finalChanges: TranslationChange[] = [];
  const pathCounts = new Map<string, { added: TranslationChange[]; deleted: TranslationChange[] }>();

  // Group changes by path
  changes.forEach((change) => {
    if (!pathCounts.has(change.path)) {
      pathCounts.set(change.path, { added: [], deleted: [] });
    }
    const group = pathCounts.get(change.path)!;
    if (change.action === 'added') group.added.push(change);
    if (change.action === 'deleted') group.deleted.push(change);
  });

  // Convert to final changes
  pathCounts.forEach((group, path) => {
    if (group.added.length > 0 && group.deleted.length > 0) {
      // This is a modification
      finalChanges.push({
        path,
        oldValue: group.deleted[0].oldValue,
        newValue: group.added[0].newValue,
        action: 'modified',
      });
    } else if (group.added.length > 0) {
      // Pure addition
      finalChanges.push(...group.added);
    } else if (group.deleted.length > 0) {
      // Pure deletion
      finalChanges.push(...group.deleted);
    }
  });

  return {
    modifiedProperties: Array.from(modifiedProperties),
    changes: finalChanges,
  };
}

/**
 * Parse git diff output to extract blog post changes
 */
function parseBlogDiff(diffOutput: string): BlogDiffAnalysisResult {
  const lines = diffOutput.split('\n');
  const changes: BlogPostChange[] = [];
  const modifiedFiles = new Set<string>();

  let currentFile = '';
  let oldLineNumber = 0;
  let newLineNumber = 0;

  for (const line of lines) {
    // Track current file being processed
    if (line.startsWith('diff --git') && line.includes('blog/')) {
      const match = line.match(/diff --git a\/(blog\/[^\s]+) b\/(blog\/[^\s]+)/);
      if (match) {
        currentFile = match[1];
        modifiedFiles.add(currentFile);
        oldLineNumber = 0;
        newLineNumber = 0;
      }
      continue;
    }

    // Skip if not in a blog file
    if (!currentFile) continue;

    // Skip file headers
    if (line.startsWith('---') || line.startsWith('+++')) {
      continue;
    }

    // Track line numbers from diff context
    if (line.startsWith('@@')) {
      const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
      if (match) {
        oldLineNumber = parseInt(match[1]);
        newLineNumber = parseInt(match[2]);
      }
      continue;
    }

    // Handle added lines
    if (line.startsWith('+') && !line.startsWith('+++')) {
      const content = line.substring(1);
      changes.push({
        file: currentFile,
        lineNumber: newLineNumber,
        content: content,
        action: 'added',
      });
      newLineNumber++;
    }
    // Handle deleted lines
    else if (line.startsWith('-') && !line.startsWith('---')) {
      const content = line.substring(1);
      changes.push({
        file: currentFile,
        lineNumber: oldLineNumber,
        content: content,
        action: 'deleted',
      });
      oldLineNumber++;
    }
    // Handle unchanged lines (context)
    else if (line.startsWith(' ')) {
      oldLineNumber++;
      newLineNumber++;
    }
  }

  return {
    modifiedFiles: Array.from(modifiedFiles),
    changes,
  };
}

/**
 * Get current git diff for the translation file
 */
function getCurrentTranslationDiff(): string {
  try {
    const diffCommand = 'git diff -- lib/translations/en.ts';
    const diffOutput = execSync(diffCommand, { encoding: 'utf-8' });
    return diffOutput;
  } catch (error) {
    console.error('❌ Failed to get git diff:', error);
    throw error;
  }
}

/**
 * Get current git diff for blog posts
 */
function getCurrentBlogDiff(): string {
  try {
    const diffCommand = 'git diff -- blog/';
    const diffOutput = execSync(diffCommand, { encoding: 'utf-8' });
    return diffOutput;
  } catch (error) {
    console.error('❌ Failed to get blog diff:', error);
    throw error;
  }
}

/**
 * Get just the modified property paths
 */
export function getModifiedTranslationProperties(): string[] {
  try {
    const diffOutput = getCurrentTranslationDiff();
    if (!diffOutput.trim()) {
      return [];
    }

    const result = parseGitDiff(diffOutput);
    return result.modifiedProperties;
  } catch (error) {
    console.error('❌ Error getting modified properties:', error);
    return [];
  }
}

/**
 * Get just the modified blog files
 */
export function getModifiedBlogFiles(): string[] {
  try {
    const diffOutput = getCurrentBlogDiff();
    if (!diffOutput.trim()) {
      return [];
    }

    const result = parseBlogDiff(diffOutput);
    return result.modifiedFiles;
  } catch (error) {
    console.error('❌ Error getting modified blog files:', error);
    return [];
  }
}

/**
 * Analyze current translation changes
 */
export function analyzeTranslationChanges(): DiffAnalysisResult {
  console.log('🔍 Analyzing current translation changes...');

  try {
    const diffOutput = getCurrentTranslationDiff();

    if (!diffOutput.trim()) {
      console.log('ℹ️  No uncommitted changes detected in lib/translations/en.ts');
      return { modifiedProperties: [], changes: [] };
    }

    const result = parseGitDiff(diffOutput);

    console.log(`✅ Found ${result.modifiedProperties.length} modified properties:`);
    result.modifiedProperties.forEach((prop) => {
      console.log(`   - ${prop}`);
    });

    if (result.changes.length > 0) {
      console.log('\n📝 Detailed changes:');
      result.changes.forEach((change) => {
        switch (change.action) {
          case 'added':
            console.log(`   + ${change.path}: "${change.newValue}"`);
            break;
          case 'deleted':
            console.log(`   - ${change.path}: "${change.oldValue}"`);
            break;
          case 'modified':
            console.log(`   ~ ${change.path}: "${change.oldValue}" → "${change.newValue}"`);
            break;
        }
      });
    }

    return result;
  } catch (error) {
    console.error('❌ Error analyzing translation changes:', error);
    throw error;
  }
}

/**
 * Analyze current blog post changes
 */
export function analyzeBlogChanges(): BlogDiffAnalysisResult {
  console.log('📝 Analyzing current blog post changes...');

  try {
    const diffOutput = getCurrentBlogDiff();

    if (!diffOutput.trim()) {
      console.log('ℹ️  No uncommitted changes detected in blog posts');
      return { modifiedFiles: [], changes: [] };
    }

    const result = parseBlogDiff(diffOutput);

    console.log(`✅ Found ${result.modifiedFiles.length} modified blog files:`);
    result.modifiedFiles.forEach((file) => {
      console.log(`   - ${file}`);
    });

    if (result.changes.length > 0) {
      console.log('\n📝 Detailed changes:');

      // Group changes by file
      const changesByFile = new Map<string, BlogPostChange[]>();
      result.changes.forEach((change) => {
        if (!changesByFile.has(change.file)) {
          changesByFile.set(change.file, []);
        }
        changesByFile.get(change.file)!.push(change);
      });

      changesByFile.forEach((changes, file) => {
        console.log(`\n   📄 ${file}:`);
        changes.forEach((change) => {
          const actionIcon = change.action === 'added' ? '+' : '-';
          const actionColor = change.action === 'added' ? '🟢' : '🔴';
          console.log(
            `     ${actionColor} ${actionIcon} Line ${change.lineNumber}: ${change.content.substring(0, 80)}${change.content.length > 80 ? '...' : ''}`
          );
        });
      });
    }

    return result;
  } catch (error) {
    console.error('❌ Error analyzing blog changes:', error);
    throw error;
  }
}

/**
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'both'; // 'translations', 'blog', or 'both'

  console.log('🌍 Translation & Blog Diff Checker');
  console.log('===================================\n');

  try {
    let translationResult: DiffAnalysisResult | null = null;
    let blogResult: BlogDiffAnalysisResult | null = null;

    if (mode === 'translations' || mode === 'both') {
      translationResult = analyzeTranslationChanges();
    }

    if (mode === 'blog' || mode === 'both') {
      if (mode === 'both') console.log('\n' + '='.repeat(50) + '\n');
      blogResult = analyzeBlogChanges();
    }

    // Output as JSON for programmatic use
    if (args.includes('--json')) {
      const jsonOutput = {
        translations: translationResult,
        blog: blogResult,
      };
      console.log('\n' + JSON.stringify(jsonOutput, null, 2));
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  }
}

// Run CLI if this script is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}
