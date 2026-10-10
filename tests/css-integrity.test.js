import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

function checkBraceBalance(cssContent, fileName) {
  // Strip comments
  const noComments = cssContent.replace(/\/\*[\s\S]*?\*\//g, '');
  // Strip strings (both single and double quoted)
  const noStrings = noComments.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '');

  let depth = 0;
  let line = 1;
  let col = 0;

  for (let i = 0; i < noStrings.length; i++) {
    const char = noStrings[i];
    if (char === '\n') {
      line++;
      col = 0;
    } else {
      col++;
    }

    if (char === '{') {
      depth++;
    } else if (char === '}') {
      depth--;
      if (depth < 0) {
        throw new Error(`Unexpected closing brace '}' in ${fileName} at line ${line}, col ${col}`);
      }
    }
  }

  if (depth !== 0) {
    throw new Error(`Unbalanced braces in ${fileName}: ${depth} unclosed '{' brace(s) remain`);
  }
}

test('CSS Integrity: All stylesheets in src/styles/ have balanced braces and no unclosed rules', () => {
  const stylesDir = path.resolve(process.cwd(), 'src/styles');
  const files = fs.readdirSync(stylesDir).filter(f => f.endsWith('.css'));

  assert.ok(files.length >= 3, `Expected at least 3 CSS files in src/styles, found: ${files.join(', ')}`);

  for (const file of files) {
    const fullPath = path.join(stylesDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    assert.doesNotThrow(
      () => checkBraceBalance(content, file),
      `CSS file ${file} must have strictly balanced braces`
    );
  }
});
