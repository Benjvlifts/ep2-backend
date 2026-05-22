import { Router, Request, Response } from 'express'
import { query } from '../database/connection'

const router = Router()

// GET /api/products - Obtener todos los productos
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM products ORDER BY id ASC')
    res.json(result.rows)
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// GET /api/products/:id - Obtener un producto por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await query('SELECT * FROM products WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

// POST /api/products - Crear un producto
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, price, description } = req.body
    const result = await query(
      'INSERT INTO products (name, price, description) VALUES ($1, $2, $3) RETURNING *',
      [name, price, description]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' })
  }
})

export default router