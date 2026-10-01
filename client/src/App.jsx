import { useEffect, useState } from 'react'
import { listPlaces, createPlace, updatePlace, deletePlace, NEEDS_LOGIN, setCredentials } from './api'
import { UPLOADS_ENABLED, uploadPhoto } from './uploadPhoto.js'
import DemoNotice from './components/DemoNotice.jsx'

const EMPTY_FORM = {
  name: '',
  type: 'restaurant',
  area: '',
  status: 'want_to_try',
  rating: 4,
  notes: '',
  photoUrl: '',
}

const NAV = [
  ['home', 'Home'],
  ['visited', 'Visited'],
  ['add', 'Add Place'],
]

const STATUS_OPTIONS = [
  ['all', 'All statuses'],
  ['want_to_try', 'Want to try'],
  ['visited', 'Visited'],
]

const TYPE_OPTIONS = [
  ['all', 'All types'],
  ['restaurant', 'Restaurant'],
  ['cafe', 'Cafe'],
]

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [checking, setChecking] = useState(false)
  const [message, setMessage] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setChecking(true)
    setMessage(null)
    setCredentials(username, password)
    try {
      await listPlaces()
      onLogin()
    } catch (caught) {
      setMessage(caught.isAuthError ? 'Invalid username or password.' : caught.message)
      setChecking(false)
    }
  }

  return (
    <main className="login">
      <h1>Yumzys</h1>
      <p className="muted">Restaurant &amp; café bucket list.</p>
      <form onSubmit={handleSubmit} className="card">
        <h2>Log in</h2>
        {message && (
          <p className="error" role="alert">
            {message}
          </p>
        )}
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
        <div className="form-actions">
          <button type="submit" disabled={checking}>{checking ? 'Logging in...' : 'Log in'}</button>
        </div>
      </form>
    </main>
  )
}

function Stars({ value }) {
  const count = Number(value) || 0
  return (
    <span className="stars" role="img" aria-label={`Rating ${count} of 5`}>
      <span aria-hidden="true">{'★'.repeat(count)}{'☆'.repeat(5 - count)}</span>
      <span className="stars-number" aria-hidden="true"> {count}/5</span>
    </span>
  )
}

function Rating({ place }) {
  if (place.status === 'visited') return <Stars value={place.rating} />
  return <span className="badge">Want to try</span>
}

function PlacePhoto({ url, name }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [url])

  if (!url || failed) {
    return <div className="photo photo-empty">No photo yet</div>
  }

  return (
    <img
      className="photo"
      src={url}
      alt={`Photo of ${name}`}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}

function FilterRow({ label, value, options, onChange }) {
  return (
    <div className="filters" role="group" aria-label={label}>
      {options.map(([key, text]) => (
        <button key={key} className="chip" aria-pressed={value === key} onClick={() => onChange(key)}>
          {text}
        </button>
      ))}
    </div>
  )
}

function PlaceForm({ initial, saving, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(initial)
  const [uploading, setUploading] = useState(false)
  const [photoError, setPhotoError] = useState(null)

  function change(field) {
    return (event) => setValues({ ...values, [field]: event.target.value })
  }

  async function handleFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setUploading(true)
    setPhotoError(null)
    try {
      const url = await uploadPhoto(file)
      setValues((current) => ({ ...current, photoUrl: url }))
    } catch (caught) {
      setPhotoError(caught.message)
    } finally {
      setUploading(false)
    }
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
      photos: values.status === 'visited' && values.photoUrl ? [values.photoUrl] : [],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="card">
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

          <label htmlFor="photo-file">Photo (optional)</label>
          {values.photoUrl && <PlacePhoto url={values.photoUrl} name={values.name || 'this place'} />}
          {UPLOADS_ENABLED ? (
            <input
              id="photo-file"
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={uploading}
            />
          ) : (
            <p className="muted small">Photo upload is not set up in this build.</p>
          )}
          {uploading && <p className="muted small">Uploading...</p>}
          {photoError && <p className="error" role="alert">{photoError}</p>}
          {values.photoUrl && !uploading && (
            <button
              type="button"
              className="ghost"
              onClick={() => setValues({ ...values, photoUrl: '' })}
            >
              Remove photo
            </button>
          )}
        </>
      )}

      <label htmlFor="notes">Notes</label>
      <textarea id="notes" value={values.notes} onChange={change('notes')} maxLength={2000} rows={3} />

      <div className="form-actions">
        <button type="submit" disabled={saving || uploading}>{saving ? 'Saving...' : submitLabel}</button>
        {onCancel && <button type="button" className="ghost" onClick={onCancel}>Cancel</button>}
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
    setError(null)
    try {
      const created = await createPlace(values)
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
    setError(null)
    try {
      const updated = await updatePlace(selected.id, values)
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

  function confirmDelete(place) {
  return window.confirm(`Delete ${place.name}?`)
}

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />
  }

  const selected = places.find((p) => p.id === selectedId)
  const activeNav = view === 'detail' ? returnView : view

  const titles = {
    home: 'Your places',
    visited: 'Visited places',
    add: 'Add a place',
    detail: editing ? 'Edit place' : 'Place details',
  }

  const visiblePlaces =
    view === 'visited'
      ? places.filter((p) => p.status === 'visited' && (typeFilter === 'all' || p.type === typeFilter))
      : places.filter(
          (p) => (filter === 'all' || p.status === filter) && (typeFilter === 'all' || p.type === typeFilter)
        )

  return (
    <div className="app">
      <nav className="sidebar" aria-label="Main">
        <span className="brand">Yumzys</span>
        {NAV.map(([key, label]) => (
          <button
            key={key}
            className="nav-item"
            aria-current={activeNav === key ? 'page' : undefined}
            onClick={() => setView(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <main className="content">
        <h1>{titles[view]}</h1>

        <DemoNotice />

        {error && (
          <p className="error" role="alert">
            {error.message} <button className="ghost" onClick={load}>Try again</button>
          </p>
        )}

        {view === 'add' && (
          <PlaceForm initial={EMPTY_FORM} saving={saving} submitLabel="Save place" onSubmit={handleCreate} />
        )}

        {view === 'detail' && selected && (
          <>
            <button className="ghost" onClick={() => setView(returnView)}>Back</button>
            {editing ? (
              <PlaceForm
                key={selected.id}
                initial={{ ...selected, rating: selected.rating ?? 4, photoUrl: selected.photos?.[0] ?? '' }}
                saving={saving}
                submitLabel="Save changes"
                onSubmit={handleUpdate}
                onCancel={() => setEditing(false)}
              />
            ) : (
              <article className="card detail">
                <PlacePhoto url={selected.photos?.[0]} name={selected.name} />
                <div className="row-head">
                  <h2>{selected.name}</h2>
                  <Rating place={selected} />
                </div>
                <p className="meta small muted">{selected.type} · {selected.area}</p>
                <p>{selected.notes || 'No notes yet.'}</p>
                <footer>
                  <button onClick={() => setEditing(true)}>Edit</button>
                  <button
                    className="ghost"
                    onClick={() => {
                      if (!confirmDelete(selected)) return
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
                <FilterRow label="Filter by status" value={filter} options={STATUS_OPTIONS} onChange={setFilter} />
                <FilterRow label="Filter by type" value={typeFilter} options={TYPE_OPTIONS} onChange={setTypeFilter} />
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
                    <PlacePhoto url={place.photos?.[0]} name={place.name} />
                    <div className="row-head">
                      <h3>{place.name}</h3>
                      <Rating place={place} />
                    </div>
                    <p className="meta small muted">{place.type} · {place.area}</p>
                    <p className={place.notes ? '' : 'muted'}>{place.notes || 'No notes yet.'}</p>
                    <footer>
                      <button className="ghost" onClick={() => openPlace(place)}>Details</button>
                      <button
                        className="ghost"
                        onClick={() => {
                          if (confirmDelete(place)) handleDelete(place.id)
                        }}
                      >
                        Delete
                      </button>
                    </footer>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  )
}