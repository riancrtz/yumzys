import express from 'express'
import cors from 'cors'
import { pool } from './db/pool.js'
import * as places from './placesRepo.js'

const app = express()

// CORS before the routes. Middleware registered after a route never sees that
// route's requests, which is the m4 lesson showing up in production.
//
// Name your origins. app.use(cors()) with no options sends
// Access-Control-Allow-Origin: *, which lets any site on the internet call this
// API from a visitor's browser, and is incompatible with cookies.
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '100kb' }))

// Is the process alive?
app.get('/healthz', (request, response) => {
  response.json({ ok: true })
})

// Is the database reachable?
app.get('/readyz', async (request, response) => {
  try {
    await pool.query('SELECT 1')
    response.json({ ok: true, db: 'up' })
  } catch (error) {
    console.error('readyz failed:', error.message)
    response.status(503).json({ ok: false, db: 'down' })
  }
})

// HTTP Basic Auth, protects every route below this line. healthz/readyz above
// stay open so hosting dashboards can check the app is alive without a login.
function basicAuth(request, response, next) {
  const auth = request.headers.authorization
  if (!auth || !auth.startsWith('Basic ')) {
    response.set('WWW-Authenticate', 'Basic')
    return response.status(401).send('Authentication required')
  }
  const [user, pass] = Buffer.from(auth.slice(6), 'base64').toString().split(':')
  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    return next()
  }
  response.set('WWW-Authenticate', 'Basic')
  return response.status(401).send('Invalid credentials')
}

app.use(basicAuth)

// Validation lives on the server because the client can be bypassed.
function validate(body) {
  const errors = []
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const type = typeof body.type === 'string' ? body.type.trim() : ''
  const area = typeof body.area === 'string' ? body.area.trim() : ''
  const status = typeof body.status === 'string' ? body.status.trim() : 'want_to_try'
  const notes = typeof body.notes === 'string' ? body.notes.trim() : ''
  const photos = Array.isArray(body.photos) ? body.photos : []
  const rating = body.rating === null || body.rating === undefined ? null : Number(body.rating)

  if (!name) errors.push('name is required')
  if (name.length > 120) errors.push('name must be 120 characters or fewer')
  if (!['restaurant', 'cafe'].includes(type)) errors.push('type must be restaurant or cafe')
  if (!['want_to_try', 'visited'].includes(status)) errors.push('status must be want_to_try or visited')
  if (notes.length > 2000) errors.push('notes must be 2000 characters or fewer')
  if (rating !== null && (!Number.isInteger(rating) || rating < 1 || rating > 5)) {
    errors.push('rating must be a whole number from 1 to 5')
  }

  return { errors, value: { name, type, area, status, rating, notes, photos } }
}

app.get('/api/places', async (request, response, next) => {
  try {
    response.json(await places.getAll(pool))
  } catch (error) {
    next(error)
  }
})

app.get('/api/places/:id', async (request, response, next) => {
  try {
    const row = await places.getById(pool, request.params.id)
    if (!row) return response.status(404).json({ error: 'Not found' })
    response.json(row)
  } catch (error) {
    next(error)
  }
})

app.post('/api/places', async (request, response, next) => {
  const { errors, value } = validate(request.body ?? {})
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

  try {
    response.status(201).json(await places.create(pool, value))
  } catch (error) {
    next(error)
  }
})

app.put('/api/places/:id', async (request, response, next) => {
  const { errors, value } = validate(request.body ?? {})
  if (errors.length > 0) return response.status(400).json({ error: errors.join('; ') })

  try {
    const row = await places.update(pool, request.params.id, value)
    if (!row) return response.status(404).json({ error: 'Not found' })
    response.json(row)
  } catch (error) {
    next(error)
  }
})

app.delete('/api/places/:id', async (request, response, next) => {
  try {
    const removed = await places.remove(pool, request.params.id)
    if (!removed) return response.status(404).json({ error: 'Not found' })
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

const photoCache = new Map()

async function photosFor(type) {
  if (photoCache.has(type)) return photoCache.get(type)

  const query = type === 'cafe' ? 'cafe coffee' : 'restaurant food'
  const url =
    'https://api.unsplash.com/search/photos' +
    `?query=${encodeURIComponent(query)}&per_page=30&orientation=landscape`

  const result = await fetch(url, {
    headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
  })
  if (!result.ok) throw new Error(`Unsplash responded ${result.status}`)

  const body = await result.json()
  const photos = body.results.map((photo) => ({
    url: photo.urls.small,
    credit: photo.user.name,
    link: photo.user.links.html,
  }))

  photoCache.set(type, photos)
  return photos
}

app.get('/api/photos/:type', async (request, response, next) => {
  if (!['restaurant', 'cafe'].includes(request.params.type)) {
    return response.status(400).json({ error: 'type must be restaurant or cafe' })
  }
  try {
    response.json(await photosFor(request.params.type))
  } catch (error) {
    next(error)
  }
})

app.use((request, response) => {
  response.status(404).json({ error: 'No such route' })
})

app.use((error, request, response, next) => {
  console.error(error)
  response.status(500).json({ error: 'Something went wrong on the server' })
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
  console.log(`CORS allows: ${allowedOrigins.join(', ')}`)
})