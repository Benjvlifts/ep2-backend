import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'innovatech',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres123',
})

export const query = (text: string, params?: unknown[]) => pool.query(text, params)

export const connectDB = async () => {
  try {
    await pool.query('SELECT NOW()')
    console.log('✅ Conectado a PostgreSQL correctamente')
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error)
    process.exit(1)
  }
}

export default pool