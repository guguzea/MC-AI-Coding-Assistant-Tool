#!/usr/bin/env node
/**
 * scripts/_lib/csv.js
 * RFC4180-flavoured CSV parser and writer. Pure functions only.
 *
 * Parser rules:
 *  - Field may be wrapped in double quotes.
 *  - Inside a quoted field, "" is an escaped literal double quote.
 *  - Quotes must wrap a field that contains a comma, newline, or quote.
 *  - CR/LF/CRLF all treated as record separators.
 *
 * Returns: { headers: string[], rows: Record<string,string>[], errors: string[] }
 */

export function parseCSV(text, opts = {}) {
  const { header = true, maxColsWarn = 0 } = opts;
  const errors = [];
  const records = [];
  let field = "";
  let row = [];
  let inQuotes = false;
  let line = 1;
  let col = 1;

  const pushField = () => {
    row.push(field);
    field = "";
    col++;
  };
  const pushRow = () => {
    records.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        if (c === "\n") line++;
        field += c;
      }
      continue;
    }

    if (c === '"') {
      // Allow start-of-field quote only; if not at start of field, treat literally.
      if (field === "") {
        inQuotes = true;
        continue;
      }
      field += c;
      continue;
    }

    if (c === ",") {
      pushField();
      continue;
    }

    if (c === "\n" || c === "\r") {
      pushField();
      // skip CRLF pair
      if (c === "\r" && text[i + 1] === "\n") i++;
      line++;
      col = 1;
      pushRow();
      continue;
    }

    field += c;
  }

  if (inQuotes) {
    errors.push(`line ${line}: unterminated quoted field`);
  }

  // flush trailing field/row (file may not end with newline)
  if (field.length > 0 || row.length > 0) {
    pushField();
    pushRow();
  }

  let headers = [];
  let rows = records;
  if (header && records.length > 0) {
    headers = records[0].map((h) => h.trim());
    rows = records.slice(1);
  }

  // Column-count validation: every row should have headers.length fields.
  if (headers.length > 0) {
    for (let r = 0; r < rows.length; r++) {
      if (rows[r].length !== headers.length) {
        errors.push(
          `row ${r + 2}: expected ${headers.length} columns, got ${rows[r].length}`
        );
      }
    }
  }

  // Optional extra warning when rows contain way more columns than the header
  // (helps catch malformed input that "looked fine" without quotes).
  if (maxColsWarn > 0 && rows.length > 0) {
    for (let r = 0; r < rows.length; r++) {
      if (rows[r].length > headers.length + maxColsWarn) {
        errors.push(
          `row ${r + 2}: suspiciously many columns (${rows[r].length} vs header ${headers.length})`
        );
      }
    }
  }

  // Convert rows to objects when headers are available
  const objects = headers.length
    ? rows.map((r) => {
        const obj = {};
        for (let i = 0; i < headers.length; i++) obj[headers[i]] = r[i] ?? "";
        return obj;
      })
    : rows;

  return { headers, rows: objects, errors };
}

/**
 * Quote a field per RFC4180 if it contains reserved characters.
 */
export function csvField(v) {
  const s = v === null || v === undefined ? "" : String(v);
  if (/[",\r\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function csvRow(arr) {
  return arr.map(csvField).join(",");
}

export function toCSV(headers, rows) {
  const out = [];
  out.push(csvRow(headers));
  for (const r of rows) {
    if (Array.isArray(r)) out.push(csvRow(r));
    else out.push(csvRow(headers.map((h) => r[h] ?? "")));
  }
  return out.join("\n") + "\n";
}
