import { useEffect, useState } from 'react'
import { listPlaces, createPlace, updatePlace, deletePlace, listPhotos, NEEDS_LOGIN, setCredentials } from './api'
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
        <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
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

function Stars({ value }) {
  return (
    <span aria-label={`Rating ${value} of 5`}>
      {'★'.repeat(value)}{'☆'.repeat(5 - value)}
    </span>
  )
}

function PlacePhoto({ photo }) {
  if (!photo) return null
  return (
    <>
      <img src={photo.url} alt="" style={{ width: '100%', borderRadius: '8px' }} />
      <p className="muted">
        Photo by <a href={photo.link} target="_blank" rel="noreferrer">{photo.credit}</a> on Unsplash
      </p>
    </>
  )
}

function PlaceForm({ title, initial, saving, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(initial)

  function change(field) {
    return (event) => setValues({ ...values, [field]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!values.name.trim()) return
    onSubmit({
      name: values.name.trim(),
      type: values.type,
      area: values.area.trim(),
      status: values.status,
      rating: values.status === 'visited' ? Number(values.rating) : null,
      notes: values.notes.trim(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="card">
      <h2>{title}</h2>

      <label htmlFor="name">Name</label>
      <input id="name" value={values.name} onChange={change('name')} maxLength={120} required />

      <label htmlFor="type">Type</label>
      <select id="type" value={values.type} onChange={change('type')}>
        <option value="restaurant">Restaurant</option>
        <option value="cafe">Cafe</option>
      </select>

      <label htmlFor="area">Area</label>
      <input id="area" value={values.area} onChange={change('area')} maxLength={120} />

      <label htmlFor="place-status">Status</label>
      <select id="place-status" value={values.status} onChange={change('status')}>
        <option value="want_to_try">Want to try</option>
        <option value="visited">Visited</option>
      </select>

      {values.status === 'visited' && (
        <>
          <label htmlFor="rating">Rating, 1 to 5</label>
          <input
            id="rating"
            type="number"
            min="1"
            max="5"
            value={values.rating}
            onChange={change('rating')}
          />
        </>
      )}

      <label htmlFor="notes">Notes</label>
      <textarea id="notes" value={values.notes} onChange={change('notes')} maxLength={2000} rows={3} />

      <div className="row-head">
        <button type="submit" disabled={saving}>{saving ? 'Saving...' : submitLabel}</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}

export default function App() {
  const [authed, setAuthed] = useState(!NEEDS_LOGIN)
  const [status, setStatus] = useState('loading')
  const [places, setPlaces] = useState([])
  const [error, setError] = useState(null)
  const [slow, setSlow] = useState(false)
  const [view, setView] = useState('home')
  const [returnView, setReturnView] = useState('home')
  const [selectedId, setSelectedId] = useState(null)
  const [editing, setEditing] = useState(false)
  const [filter, setFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
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
    if (authed) load()
  }, [authed])

  useEffect(() => {
    if (!authed) return
    Promise.all([listPhotos('restaurant'), listPhotos('cafe')])
      .then(([restaurant, cafe]) => setPhotos({ restaurant, cafe }))
      .catch(() => {})
  }, [authed])

  function fail(caught) {
    if (caught.isAuthError) setAuthed(false)
    else setError(caught)
  }

  function openPlace(place) {
    setReturnView(view)
    setSelectedId(place.id)
    setEditing(false)
    setView('detail')
  }

  async function handleCreate(values) {
    setSaving(true)
    try {
      const created = await createPlace({ ...values, photos: [] })
      setPlaces([created, ...places])
      setView('home')
    } catch (caught) {
      fail(caught)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdate(values) {
    setSaving(true)
    try {
      const updated = await updatePlace(selected.id, { ...values, photos: selected.photos ?? [] })
      setPlaces(places.map((p) => (p.id === updated.id ? updated : p)))
      setEditing(false)
    } catch (caught) {
      fail(caught)
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
      fail(caught)
    }
  }

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />
  }

  const selected = places.find((p) => p.id === selectedId)

  const visiblePlaces =
    view === 'visited'
      ? places.filter((p) => p.status === 'visited' && (typeFilter === 'all' || p.type === typeFilter))
      : places.filter(
          (p) => (filter === 'all' || p.status === filter) && (typeFilter === 'all' || p.type === typeFilter)
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
        <PlaceForm
          title="Add a place"
          initial={EMPTY_FORM}
          saving={saving}
          submitLabel="Save place"
          onSubmit={handleCreate}
        />
      )}

      {view === 'detail' && selected && (
        <>
          <button onClick={() => setView(returnView)}>Back</button>
          {editing ? (
            <PlaceForm
              key={selected.id}
              title="Edit place"
              initial={{ ...selected, rating: selected.rating ?? 4 }}
              saving={saving}
              submitLabel="Save changes"
              onSubmit={handleUpdate}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <article className="card">
              <PlacePhoto photo={pickPhoto(photos[selected.type] ?? [], selected.id)} />
              <div className="row-head">
                <h2>{selected.name}</h2>
                {selected.status === 'visited' ? (
                  <Stars value={selected.rating} />
                ) : (
                  <span className="muted">Want to try</span>
                )}
              </div>
              <p className="muted">{selected.type} · {selected.area}</p>
              <p>{selected.notes || 'No notes yet.'}</p>
              <footer>
                <button onClick={() => setEditing(true)}>Edit</button>
                <button
                  onClick={() => {
                    handleDelete(selected.id)
                    setView(returnView)
                  }}
                >
                  Delete
                </button>
              </footer>
            </article>
          )}
        </>
      )}

      {(view === 'home' || view === 'visited') && (
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
              {visiblePlaces.map((place) => (
                <li key={place.id} className="card">
                  <PlacePhoto photo={pickPhoto(photos[place.type] ?? [], place.id)} />
                  <div className="row-head">
                    <h3>{place.name}</h3>
                    {place.status === 'visited' ? (
                      <Stars value={place.rating} />
                    ) : (
                      <span className="muted">Want to try</span>
                    )}
                  </div>
                  <p className="muted">{place.type} · {place.area}</p>
                  <p className={place.notes ? '' : 'muted'}>{place.notes || 'No notes yet.'}</p>
                  <footer>
                    <button onClick={() => openPlace(place)}>Details</button>
                    <button onClick={() => handleDelete(place.id)}>Delete</button>
                  </footer>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

