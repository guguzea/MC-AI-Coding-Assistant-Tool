#!/usr/bin/env node
/**
 * scripts/_lib/diag.js
 * Diagnostic accumulator + structured reporter. Lets validators print all
 * problems instead of bailing on the first failure.
 */

export class DiagnosticBag {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.infos = [];
  }
  error(msg, ctx) {
    this.errors.push(ctx ? { msg, ...ctx } : { msg });
  }
  warn(msg, ctx) {
    this.warnings.push(ctx ? { msg, ...ctx } : { msg });
  }
  info(msg, ctx) {
    this.infos.push(ctx ? { msg, ...ctx } : { msg });
  }
  hasErrors() {
    return this.errors.length > 0;
  }
  toString() {
    const lines = [];
    for (const w of this.warnings) lines.push(`  ⚠ ${w.msg}`);
    for (const e of this.errors) lines.push(`  ✗ ${e.msg}`);
    for (const i of this.infos) lines.push(`  · ${i.msg}`);
    return lines.join("\n");
  }
}

/**
 * Render a single-section report to console.
 */
export function reportSection(bag, title) {
  console.log(`\n=== ${title} ===`);
  if (bag.errors.length === 0 && bag.warnings.length === 0 && bag.infos.length === 0) {
    console.log("  ✓ ok");
    return;
  }
  console.log(bag.toString());
}

/**
 * Final exit-code helper for validator scripts:
 * returns 0 when no errors, 1 otherwise. Use with `process.exitCode = ...`.
 */
export function exitCodeFor(bag) {
  return bag.hasErrors() ? 1 : 0;
}
