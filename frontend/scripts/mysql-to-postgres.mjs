// Convierte un dump de phpMyAdmin (MySQL) en SQL compatible con Postgres.
//
//   node scripts/mysql-to-postgres.mjs <dump.sql> <salida.sql>
//
// Mantiene los ids originales y escapa los valores con la convencion de
// Postgres (comillas simples duplicadas) en lugar de los escapes de MySQL.

import fs from 'node:fs';

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error('Uso: node scripts/mysql-to-postgres.mjs <dump.sql> <salida.sql>');
  process.exit(1);
}

const dump = fs.readFileSync(inputPath, 'utf8');
const out = [];

out.push('-- Generado automaticamente por scripts/mysql-to-postgres.mjs');
out.push('-- desde un dump de phpMyAdmin (MySQL). No editar a mano.');
out.push('');

function unescapeMysql(value) {
  let out = '';
  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if (char !== '\\') {
      out += char;
      continue;
    }
    const next = value[i + 1];
    i += 1;
    switch (next) {
      case 'n': out += '\n'; break;
      case 't': out += '\t'; break;
      case 'r': out += '\r'; break;
      case '0': out += '\0'; break;
      case 'Z': out += '\x1a'; break;
      default: out += next ?? '';
    }
  }
  return out;
}

const escape = (value) => `'${value.replace(/'/g, "''")}'`;

// Recorre las tuplas de un VALUES respetando comillas y escapes de MySQL.
function parseTuples(block) {
  const rows = [];
  let i = 0;

  while (i < block.length) {
    if (block[i] !== '(') {
      i += 1;
      continue;
    }
    i += 1;

    let current = '';
    let depth = 0;
    let inString = false;

    while (i < block.length) {
      const char = block[i];

      if (inString) {
        if (char === '\\') { current += char + (block[i + 1] ?? ''); i += 2; continue; }
        if (char === "'") { inString = false; current += char; i += 1; continue; }
        current += char;
        i += 1;
        continue;
      }

      if (char === "'") { inString = true; current += char; i += 1; continue; }
      if (char === '(') { depth += 1; current += char; i += 1; continue; }
      if (char === ')') {
        if (depth === 0) break;
        depth -= 1;
        current += char;
        i += 1;
        continue;
      }
      current += char;
      i += 1;
    }

    rows.push(splitValues(current));
    i += 1;
  }

  return rows;
}

// Separa los valores de una tupla ya sin los parentesis externos.
function splitValues(row) {
  const values = [];
  let current = '';
  let inString = false;

  for (let i = 0; i < row.length; i += 1) {
    const char = row[i];

    if (inString) {
      if (char === '\\' && row[i + 1] === "'") { current += "'"; i += 1; continue; }
      if (char === '\\') { current += char + (row[i + 1] ?? ''); i += 1; continue; }
      if (char === "'") {
        inString = false;
        if (row[i + 1] === "'") { current += "''"; i += 1; continue; }
        current += "'";
        continue;
      }
      current += char;
      continue;
    }

    if (char === "'") { inString = true; current += char; continue; }
    if (char === ',') { values.push(current.trim()); current = ''; continue; }
    current += char;
  }

  values.push(current.trim());
  return values.map((value) => {
    if (value === 'NULL') return null;
    if (value.startsWith("'") && value.endsWith("'")) {
      return escape(unescapeMysql(value.slice(1, -1)));
    }
    return value;
  });
}

// store_config tiene una sola fila (id = 1) y su valor debe ganar sobre el
// NULL que deja schema.sql, asi que ahi hace falta un upsert y no un DO NOTHING.
function upsertClause(table) {
  if (table === 'store_config') {
    return ' ON CONFLICT (id) DO UPDATE SET whatsapp_number = EXCLUDED.whatsapp_number;';
  }
  return ' ON CONFLICT DO NOTHING;';
}

const insertRegex = /INSERT INTO\s+`([^`]+)`\s*\(([^)]+)\)\s*VALUES\s*([\s\S]*?);\s*(?=INSERT INTO|CREATE TABLE|ALTER TABLE|--|\/\*|$)/g;

let match;
let total = 0;
const parsedTables = new Map();

while ((match = insertRegex.exec(dump)) !== null) {
  const [, table, columns, block] = match;
  const rows = parseTuples(block);
  if (!rows.length) continue;
  parsedTables.set(table, rows);

  const columnList = columns
    .split(',')
    .map((column) => `"${column.trim().replace(/`/g, '')}"`)
    .join(', ');

  out.push(`INSERT INTO "${table}" (${columnList}) VALUES`);
  out.push(
    rows
      .map((row) => `  (${row.map((value) => (value === null ? 'NULL' : value)).join(', ')})`)
      .join(',\n') + upsertClause(table),
  );
  out.push('');

  total += rows.length;
  console.log(`  ${table}: ${rows.length} filas`);
}

// store_config usa INT PRIMARY KEY (no SERIAL), asi que no lleva secuencia.
const SERIAL_TABLES = new Set(['categories', 'products', 'admins']);
const maxIds = new Map();

for (const [table, rows] of parsedTables) {
  const ids = rows.map((row) => Number.parseInt(row[0], 10)).filter(Number.isFinite);
  if (ids.length) maxIds.set(table, Math.max(...ids));
}

for (const table of SERIAL_TABLES) {
  const maxId = maxIds.get(table);
  if (maxId === undefined) continue;
  out.push(
    `SELECT setval(pg_get_serial_sequence('${table}', 'id'), ${maxId + 1}, false);`,
  );
}
out.push('');

fs.writeFileSync(outputPath, out.join('\n'), 'utf8');
console.log(`\n${total} filas escritas en ${outputPath}`);