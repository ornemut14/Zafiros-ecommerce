import pg from 'pg';

// En serverless (Neon/Supabase) el servidor exige TLS. Contra una base local
// la conexion es en claro, asi que solo lo activamos cuando hace falta.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Falta la variable de entorno DATABASE_URL');
}

const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);

export const pool = new pg.Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

export function query(text, params) {
  return pool.query(text, params);
}

// Postgres devuelve los DECIMAL/NUMERIC como string para no perder precision.
// El frontend ya formatea con Number(...), asi que se reenvia tal cual.