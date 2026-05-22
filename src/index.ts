import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectDB, query } from './database/connection'
import productRoutes from './routes/products'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Rutas
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.use('/api/products', productRoutes)

// Inicializar base de datos y arrancar servidor
const initDB = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `)

  // Insertar datos de ejemplo si la tabla está vacía
  const existing = await query('SELECT COUNT(*) FROM products')
  if (parseInt(existing.rows[0].count) === 0) {
    await query(`
      INSERT INTO products (name, price, description) VALUES
      ('Laptop Pro X1', 899990, 'Laptop de alto rendimiento para profesionales'),
      ('Monitor 4K UltraWide', 459990, 'Monitor 34 pulgadas resolución 4K'),
      ('Teclado Mecánico RGB', 89990, 'Teclado mecánico con switches Cherry MX'),
      ('Mouse Inalámbrico', 45990, 'Mouse ergonómico con batería de larga duración'),
      ('Auriculares Noise Cancelling', 279990, 'Auriculares premium con cancelación de ruido')
    `)
    console.log('✅ Datos de ejemplo insertados')
  }
}

const start = async () => {
  await connectDB()
  await initDB()
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    console.log(`🏥 Health check: http://localhost:${PORT}/health`)
  })
}

start()