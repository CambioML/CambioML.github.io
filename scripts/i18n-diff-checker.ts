#!/usr/bin/env bun

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

// We'll implement a basic diff parser since we need to install parse-git-diff
// For now, let's create a working version without external dependencies

interface TranslationChange {
  path: string;
  oldValue?: string;
  newValue?: string;
  action: 'added' | 'modified' | 'deleted';
}

interface DiffAnalysisResult {
  modifiedProperties: string[];
  changes: TranslationChange[];
}

/**
 * Parse TypeScript object from file content
 */
function parseTypescriptObject(content: string): Record<string, unknown> {
  try {
    // Remove the export and const declaration
    const cleanContent = content
      .replace(/^.*export\s+const\s+\w+\s*=\s*/, '')
      .replace(/\s*as\s+const\s*;?\s*$/, '')
      .trim();

    // Use eval in a safer way - this is acceptable for internal scripts
    const obj = eval(`(${cleanContent})`);
    return obj;
  } catch (error) {
    console.error('❌ Failed to parse TypeScript object:', error);
    throw error;
  }
}

/**
 * Flatten nested object to dot notation paths
 */
function flattenObject(obj: Record<string, unknown>, prefix: string = ''): Record<string, unknown> {
  const flattened: Record<string, unknown> = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value as Record<string, unknown>, newKey));
    } else {
      // Convert arrays and objects to JSON string for comparison
      flattened[newKey] =
        Array.isArray(value) || (typeof value === 'object' && value !== null) ? JSON.stringify(value) : value;
    }
  });

  return flattened;
}

/**
 * Extract line content from git diff line
 */
function extractLineContent(line: string): string {
  // Remove the +/- prefix and any leading whitespace
  return line.substring(1).trimStart();
}

/**
 * Extract property path from a TypeScript line
 */
function extractPropertyPath(line: string, currentPath: string[] = []): { path: string; value: string } | null {
  const trimmedLine = line.trim();

  // Handle object property definitions like "nav: {" or "title: 'something',"
  const propertyMatch = trimmedLine.match(/^(\w+):\s*(.*)$/);
  if (propertyMatch) {
    const [, key, rest] = propertyMatch;
    const fullPath = [...currentPath, key].join('.');

    // If it's an object start, return without value
    if (rest.trim() === '{') {
      return { path: fullPath, value: '' };
    }

    // Extract string value
    const valueMatch = rest.match(/^['"`]([^'"`]*)['"`]/);
    if (valueMatch) {
      return { path: fullPath, value: valueMatch[1] };
    }
  }

  return null;
}

/**
 * Parse git diff output manually
 */
function parseGitDiff(diffOutput: string): DiffAnalysisResult {
  const lines = diffOutput.split('\n');
  const changes: TranslationChange[] = [];
  const modifiedProperties = new Set<string>();

  const currentPath: string[] = [];
  let inTranslationFile = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if we're in the translation file
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

    // Handle added lines
    if (line.startsWith('+') && !line.startsWith('+++')) {
      const content = extractLineContent(line);
      const property = extractPropertyPath(content, currentPath);

      if (property && property.value) {
        changes.push({
          path: property.path,
          newValue: property.value,
          action: 'added',
        });
        modifiedProperties.add(property.path);
      }
    }

    // Handle deleted lines
    if (line.startsWith('-') && !line.startsWith('---')) {
      const content = extractLineContent(line);
      const property = extractPropertyPath(content, currentPath);

      if (property && property.value) {
        changes.push({
          path: property.path,
          oldValue: property.value,
          action: 'deleted',
        });
        modifiedProperties.add(property.path);
      }
    }

    // Update current path based on object structure
    const trimmedLine = line.trim();
    if (trimmedLine.endsWith(': {')) {
      const key = trimmedLine.substring(0, trimmedLine.length - 3).trim();
      currentPath.push(key);
    } else if (trimmedLine === '},') {
      currentPath.pop();
    }
  }

  // Detect modifications (when a property is both deleted and added)
  const pathCounts = new Map<string, { added: number; deleted: number }>();

  changes.forEach((change) => {
    if (!pathCounts.has(change.path)) {
      pathCounts.set(change.path, { added: 0, deleted: 0 });
    }
    const count = pathCounts.get(change.path)!;
    if (change.action === 'added') count.added++;
    if (change.action === 'deleted') count.deleted++;
  });

  // Convert add+delete pairs to modifications
  const finalChanges: TranslationChange[] = [];
  const processedPaths = new Set<string>();

  changes.forEach((change) => {
    if (processedPaths.has(change.path)) return;

    const counts = pathCounts.get(change.path)!;
    if (counts.added > 0 && counts.deleted > 0) {
      // This is a modification
      const deletedChange = changes.find((c) => c.path === change.path && c.action === 'deleted');
      const addedChange = changes.find((c) => c.path === change.path && c.action === 'added');

      finalChanges.push({
        path: change.path,
        oldValue: deletedChange?.oldValue,
        newValue: addedChange?.newValue,
        action: 'modified',
      });
    } else {
      // This is a pure add or delete
      finalChanges.push(change);
    }

    processedPaths.add(change.path);
  });

  return {
    modifiedProperties: Array.from(modifiedProperties),
    changes: finalChanges,
  };
}

/**
 * Get git diff for the translation file
 */
function getTranslationDiff(commitRange: string = 'HEAD~1..HEAD'): string {
  try {
    const diffCommand = `git diff ${commitRange} -- lib/translations/en.ts`;
    const diffOutput = execSync(diffCommand, { encoding: 'utf-8' });
    return diffOutput;
  } catch (error) {
    console.error('❌ Failed to get git diff:', error);
    throw error;
  }
}

/**
 * Alternative method: Compare current en.ts with git show version
 */
function compareWithPreviousVersion(commitRef: string = 'HEAD~1'): DiffAnalysisResult {
  try {
    // Get previous version
    const previousContent = execSync(`git show ${commitRef}:lib/translations/en.ts`, {
      encoding: 'utf-8',
    });

    // Get current version
    const currentContent = readFileSync(join(process.cwd(), 'lib/translations/en.ts'), 'utf-8');

    // Parse both versions
    const previousObj = parseTypescriptObject(previousContent);
    const currentObj = parseTypescriptObject(currentContent);

    // Flatten both objects
    const previousFlat = flattenObject(previousObj);
    const currentFlat = flattenObject(currentObj);

    // Find differences
    const changes: TranslationChange[] = [];
    const modifiedProperties = new Set<string>();

    // Check for added and modified properties
    Object.keys(currentFlat).forEach((key) => {
      if (!(key in previousFlat)) {
        changes.push({
          path: key,
          newValue: String(currentFlat[key]),
          action: 'added',
        });
        modifiedProperties.add(key);
      } else if (currentFlat[key] !== previousFlat[key]) {
        changes.push({
          path: key,
          oldValue: String(previousFlat[key]),
          newValue: String(currentFlat[key]),
          action: 'modified',
        });
        modifiedProperties.add(key);
      }
    });

    // Check for deleted properties
    Object.keys(previousFlat).forEach((key) => {
      if (!(key in currentFlat)) {
        changes.push({
          path: key,
          oldValue: String(previousFlat[key]),
          action: 'deleted',
        });
        modifiedProperties.add(key);
      }
    });

    return {
      modifiedProperties: Array.from(modifiedProperties),
      changes,
    };
  } catch (error) {
    console.error('❌ Failed to compare with previous version:', error);
    throw error;
  }
}

/**
 * Simple function to get just the modified property paths
 */
export function getModifiedTranslationProperties(commitRange: string = 'HEAD~1'): string[] {
  try {
    const result = compareWithPreviousVersion(commitRange);
    return result.modifiedProperties;
  } catch (error) {
    console.error('❌ Error getting modified properties:', error);
    return [];
  }
}

/**
 * Main function to analyze translation changes
 */
export function analyzeTranslationChanges(
  method: 'diff' | 'compare' = 'compare',
  commitRange: string = 'HEAD~1'
): DiffAnalysisResult {
  console.log(`🔍 Analyzing translation changes using ${method} method...`);

  try {
    let result: DiffAnalysisResult;

    if (method === 'diff') {
      const diffOutput = getTranslationDiff(commitRange);
      if (!diffOutput.trim()) {
        console.log('ℹ️  No changes detected in lib/translations/en.ts');
        return { modifiedProperties: [], changes: [] };
      }
      result = parseGitDiff(diffOutput);
    } else {
      result = compareWithPreviousVersion(commitRange);
    }

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
 * CLI interface
 */
async function main() {
  const args = process.argv.slice(2);
  const method = (args[0] as 'diff' | 'compare') || 'compare';
  const commitRange = args[1] || 'HEAD~1';

  console.log('🌍 Translation Diff Checker');
  console.log('============================\n');

  try {
    const result = analyzeTranslationChanges(method, commitRange);

    // Output as JSON for programmatic use
    if (args.includes('--json')) {
      console.log('\n' + JSON.stringify(result, null, 2));
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
