import { useEffect, useState } from 'react'
import { listPlaces, createPlace, deletePlace, listPhotos, NEEDS_LOGIN, setCredentials } from './api'
import DemoNotice from './components/DemoNotice.jsx'

const EMPTY_FORM = { name: '', type: 'restaurant', area: '', status: 'want_to_try', rating: 4, notes: '' }

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setCredentials(username, password)
    onLogin()
  }

  return (
    <div className="page">
      <header>
        <h1>Yumzys</h1>
        <p className="lede">Restaurant &amp; café bucket list.</p>
      </header>
      <form onSubmit={handleSubmit} className="card">
        <h2>Log in</h2>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  )
}

function pickPhoto(list, id) {
  if (list.length === 0) return null
  const seed = [...String(id)].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return list[seed % list.length]
}

export default function App() {
  const [authed, setAuthed] = useState(!NEEDS_LOGIN)
  const [status, setStatus] = useState('loading')
  const [places, setPlaces] = useState([])
  const [error, setError] = useState(null)
  const [slow, setSlow] = useState(false)
  const [view, setView] = useState('home')
  const [filter, setFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [photos, setPhotos] = useState({ restaurant: [], cafe: [] })

  async function load() {
    setStatus('loading')
    setError(null)
    const timer = setTimeout(() => setSlow(true), 3000)
    try {
      setPlaces(await listPlaces())
      setStatus('ready')
    } catch (caught) {
      if (caught.isAuthError) {
        setAuthed(false)
      } else {
        setError(caught)
        setStatus('error')
      }
    } finally {
      clearTimeout(timer)
      setSlow(false)
    }
  }

  useEffect(() => {
  if (!authed) return
  Promise.all([listPhotos('restaurant'), listPhotos('cafe')])
    .then(([restaurant, cafe]) => setPhotos({ restaurant, cafe }))
    .catch(() => {})
}, [authed])
  
  useEffect(() => {
    if (authed) load()
  }, [authed])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.name.trim()) return

    setSaving(true)
    try {
      const created = await createPlace({
        name: form.name.trim(),
        type: form.type,
        area: form.area.trim(),
        status: form.status,
        rating: form.status === 'visited' ? Number(form.rating) : null,
        notes: form.notes.trim(),
        photos: [],
      })
      setPlaces([created, ...places])
      setForm(EMPTY_FORM)
      setView('home')
    } catch (caught) {
      if (caught.isAuthError) {
        setAuthed(false)
      } else {
        setError(caught)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    const previous = places
    setPlaces(places.filter((p) => p.id !== id))
    try {
      await deletePlace(id)
    } catch (caught) {
      setPlaces(previous)
      if (caught.isAuthError) {
        setAuthed(false)
      } else {
        setError(caught)
      }
    }
  }

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />
  }

const visiblePlaces =
  view === 'visited'
    ? places.filter((p) =>
        p.status === 'visited' &&
        (typeFilter === 'all' || p.type === typeFilter)
      )
    : places.filter((p) =>
        (filter === 'all' || p.status === filter) &&
        (typeFilter === 'all' || p.type === typeFilter)
      )

  return (
    <div className="page">
      <header>
        <h1>Yumzys</h1>
        <p className="lede">Restaurant &amp; café bucket list.</p>
      </header>

      <DemoNotice />

      <nav className="row-head" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => setView('home')} disabled={view === 'home'}>Home</button>
        <button onClick={() => setView('visited')} disabled={view === 'visited'}>Visited</button>
        <button onClick={() => setView('add')} disabled={view === 'add'}>Add Place</button>
      </nav>

      {error && (
        <p className="error" role="alert">
          {error.message} <button onClick={load}>Try again</button>
        </p>
      )}

      {view === 'add' && (
        <form onSubmit={handleSubmit} className="card">
          <h2>Add a place</h2>

          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            maxLength={120}
            required
          />

          <label htmlFor="type">Type</label>
          <select
            id="type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="restaurant">Restaurant</option>
            <option value="cafe">Cafe</option>
          </select>

          <label htmlFor="area">Area</label>
          <input
            id="area"
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
            maxLength={120}
          />

          <label htmlFor="place-status">Status</label>
          <select
            id="place-status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="want_to_try">Want to try</option>
            <option value="visited">Visited</option>
          </select>

          {form.status === 'visited' && (
            <>
              <label htmlFor="rating">Rating, 1 to 5</label>
              <input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              />
            </>
          )}

          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            maxLength={2000}
            rows={3}
          />

          <button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save place'}
          </button>
        </form>
      )}

      {view !== 'add' && (
        <>
          {view === 'home' && (
            <>
              <div className="row-head" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
                <button onClick={() => setFilter('all')} disabled={filter === 'all'}>All statuses</button>
                <button onClick={() => setFilter('want_to_try')} disabled={filter === 'want_to_try'}>Want to Try</button>
                <button onClick={() => setFilter('visited')} disabled={filter === 'visited'}>Visited</button>
              </div>

              <div className="row-head" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
                <button onClick={() => setTypeFilter('all')} disabled={typeFilter === 'all'}>All types</button>
                <button onClick={() => setTypeFilter('restaurant')} disabled={typeFilter === 'restaurant'}>Restaurant</button>
                <button onClick={() => setTypeFilter('cafe')} disabled={typeFilter === 'cafe'}>Cafe</button>
              </div>
            </>
          )}

          {status === 'loading' && (
            <p className="muted">
              Loading{slow ? '. The server may be waking up, which can take up to a minute.' : '...'}
            </p>
          )}

          {status === 'ready' && visiblePlaces.length === 0 && (
            <p className="muted">No places here yet.</p>
          )}

          {status === 'ready' && visiblePlaces.length > 0 && (
            <ul className="list">
              {visiblePlaces.map((place) => {
                const photo = pickPhoto(photos[place.type] ?? [], place.id)
                return (
                  <li key={place.id} className="card">
                    {photo && (
                      <>
                        <img src={photo.url} alt="" style={{ width: '100%', borderRadius: '8px' }} />
                        <p className="muted">
                          Photo by <a href={photo.link} target="_blank" rel="noreferrer">{photo.credit}</a> on Unsplash
                        </p>
                      </>
                    )}
                    <div className="row-head">
                      <h3>{place.name}</h3>
                      {place.status === 'visited' ? (
                        <span aria-label={`Rating ${place.rating} of 5`}>
                          {'★'.repeat(place.rating)}{'☆'.repeat(5 - place.rating)}
                        </span>
                      ) : (
                        <span className="muted">Want to try</span>
                      )}
                    </div>
                    <p className="muted">{place.type} · {place.area}</p>
                    {place.notes
                      ? <p>{place.notes}</p>
                      : <p className="muted">No notes yet.</p>}
                    <footer>
                      <button onClick={() => handleDelete(place.id)}>Delete</button>
                    </footer>
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

