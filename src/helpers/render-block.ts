

export function renderBlock(borderChar: string, lines: string[]): void {
  const border = new Array(process.stdout.columns)
    .fill(borderChar)
    .join('');

  console.log(border);
  ['', ...lines, ''].forEach(l => console.log(`| ${l}`));
  console.log(border);
}
