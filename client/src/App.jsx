import { useEffect, useId, useRef, useState } from 'react'
import { listPlaces, createPlace, updatePlace, deletePlace, NEEDS_LOGIN, setCredentials } from './api'
import { UPLOADS_ENABLED, uploadPhoto } from './uploadPhoto.js'
import DemoNotice from './components/DemoNotice.jsx'

const MAX_PHOTOS = 5

const EMPTY_FORM = {
  name: '',
  type: 'restaurant',
  area: '',
  status: 'want_to_try',
  rating: 4,
  notes: '',
  photos: [],
}

const NAV = [
  ['home', 'Home'],
  ['want', 'Want to try'],
  ['visited', 'Visited'],
  ['add', 'Add Place'],
]

const TYPE_OPTIONS = [
  ['all', 'All types'],
  ['restaurant', 'Restaurant'],
  ['cafe', 'Cafe'],
]

const STATUS_CHOICES = [
  ['want_to_try', 'Want to try'],
  ['visited', 'Visited'],
]

const TYPE_CHOICES = [
  ['restaurant', 'Restaurant'],
  ['cafe', 'Cafe'],
]

const STATUS_FOR_VIEW = { home: 'all', want: 'want_to_try', visited: 'visited' }

const TITLES = {
  home: 'Your places',
  want: 'Want to try',
  visited: 'Visited places',
  add: 'Add a place',
}

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

function PlacePhoto({ url, alt, className = 'photo' }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [url])

  if (!url || failed) {
    return <div className={`${className} photo-empty`}>No photo yet</div>
  }

  return (
    <img
      className={className}
      src={url}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}

function Slideshow({ photos, name, paused }) {
  const [index, setIndex] = useState(0)
  const count = photos.length

  useEffect(() => {
    if (count < 2 || paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), 3000)
    return () => clearInterval(timer)
  }, [count, paused])

  if (count < 2) return <PlacePhoto url={photos[0]} alt={`Photo of ${name}`} />

  const shown = index % count

  return (
    <div className="slides">
      <div className="slides-track" style={{ transform: `translateX(-${shown * 100}%)` }}>
        {photos.map((url, i) => (
          <PlacePhoto
            key={`${i}-${url}`}
            url={url}
            alt={i === 0 ? `Photo of ${name}` : ''}
            className="photo slide"
          />
        ))}
      </div>
      <div className="slides-dots" aria-hidden="true">
        {photos.map((url, i) => (
          <span key={`${i}-${url}`} className={i === shown ? 'dot on' : 'dot'} />
        ))}
      </div>
    </div>
  )
}

function PlaceCard({ place, onOpen }) {
  const [paused, setPaused] = useState(false)

  return (
    <li
      className="card place-card"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Slideshow photos={place.photos ?? []} name={place.name} paused={paused} />
      <div className="row-head">
        <h3>
          <button type="button" className="card-open" onClick={() => onOpen(place)}>
            {place.name}
          </button>
        </h3>
        <Rating place={place} />
      </div>
      <p className="meta small muted">{place.type}{place.area ? ` · ${place.area}` : ''}</p>
      <p className={place.notes ? '' : 'muted'}>{place.notes || 'No notes yet.'}</p>
    </li>
  )
}

function TypeFilter({ value, onChange }) {
  return (
    <div className="type-filter" role="group" aria-label="Filter by type">
      {TYPE_OPTIONS.map(([key, text]) => (
        <button
          key={key}
          type="button"
          className="type-chip"
          aria-pressed={value === key}
          onClick={() => onChange(key)}
        >
          {text}
        </button>
      ))}
    </div>
  )
}

function PlaceDetails({ place, onEdit, onDelete }) {
  const photos = place.photos ?? []
  const [current, setCurrent] = useState(0)
  const index = Math.min(current, Math.max(photos.length - 1, 0))
  const visited = place.status === 'visited'
  const canAddPhoto = visited && photos.length < MAX_PHOTOS

  return (
    <section className="place-page">
      <div className="place-head">
        <h1>{place.name}</h1>
        <div className="form-actions">
          <button type="button" onClick={onEdit}>Edit</button>
          <button type="button" className="ghost" onClick={onDelete}>Delete</button>
        </div>
      </div>

      <div className="place-main">
        <PlacePhoto url={photos[index]} alt={`Photo of ${place.name}`} className="hero" />
        <dl className="facts">
          <div>
            <dt>Type and area</dt>
            <dd className="meta">{place.type}{place.area ? ` · ${place.area}` : ''}</dd>
          </div>
          <div>
            <dt>Rating</dt>
            <dd>{visited ? <Stars value={place.rating} /> : <span className="muted">Not rated yet</span>}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span className="sr-only">{visited ? 'Visited' : 'Want to try'}</span>
              <span className="pills" aria-hidden="true">
                <span className={visited ? 'pill' : 'pill on'}>Want to try</span>
                <span className={visited ? 'pill on' : 'pill'}>Visited</span>
              </span>
            </dd>
          </div>
          <div>
            <dt>Notes</dt>
            <dd className={place.notes ? '' : 'muted'}>{place.notes || 'No notes yet.'}</dd>
          </div>
        </dl>
      </div>

      <div className="gallery-head">
        <h2>Photo Gallery</h2>
        {canAddPhoto && (
          <button type="button" className="ghost" onClick={onEdit}>+ Add Photo</button>
        )}
      </div>
      {photos.length > 0 ? (
        <ul className="place-gallery">
          {photos.map((url, i) => (
            <li key={`${i}-${url}`}>
              <button
                type="button"
                className="thumb-button"
                aria-label={`Show photo ${i + 1} of ${photos.length}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => setCurrent(i)}
              >
                <PlacePhoto url={url} alt="" className="thumb" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">
          {visited ? 'No photos yet. Use Add Photo to upload some.' : 'You can add photos after you visit.'}
        </p>
      )}
    </section>
  )
}

function Modal({ open, title, onClose, small = false, children }) {
  const ref = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) {
      dialog.showModal()
      dialog.querySelector('[data-autofocus]')?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  function handleCancel(event) {
    event.preventDefault()
    onClose()
  }

  function handleClick(event) {
    if (event.target === ref.current) onClose()
  }

  return (
    <dialog
      ref={ref}
      className={small ? 'modal modal-small' : 'modal'}
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleClick}
    >
      {open && (
        <div className="modal-body">
          <h2 id={titleId}>{title}</h2>
          {children}
        </div>
      )}
    </dialog>
  )
}

function ChoicePills({ legend, name, value, options, onChange }) {
  return (
    <fieldset className="choice">
      <legend>{legend}</legend>
      <div className="choice-options">
        {options.map(([key, text]) => (
          <label key={key} className="choice-pill">
            <input type="radio" name={name} value={key} checked={value === key} onChange={onChange} />
            {text}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function PlaceForm({ initial, saving, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(initial)
  const [uploading, setUploading] = useState(false)
  const [photoError, setPhotoError] = useState(null)

  function change(field) {
    return (event) => {
      const value = event.target.value
      setValues((current) => ({ ...current, [field]: value }))
    }
  }

  async function handleFiles(event) {
    const chosen = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (chosen.length === 0) return

    const room = MAX_PHOTOS - values.photos.length
    const files = chosen.slice(0, room)
    setPhotoError(
      chosen.length > room ? `Only ${MAX_PHOTOS} photos per place, so extra files were skipped.` : null
    )

    setUploading(true)
    try {
      for (const file of files) {
        const url = await uploadPhoto(file)
        setValues((current) => ({ ...current, photos: [...current.photos, url] }))
      }
    } catch (caught) {
      setPhotoError(caught.message)
    } finally {
      setUploading(false)
    }
  }

  function removePhoto(index) {
    setValues((current) => ({
      ...current,
      photos: current.photos.filter((_, i) => i !== index),
    }))
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
      photos: values.status === 'visited' ? values.photos : [],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="place-form">
      <label htmlFor="name">Name</label>
      <input id="name" value={values.name} onChange={change('name')} maxLength={120} required />

      <ChoicePills
        legend="Type"
        name="type"
        value={values.type}
        options={TYPE_CHOICES}
        onChange={change('type')}
      />

      <label htmlFor="area">Area</label>
      <input id="area" value={values.area} onChange={change('area')} maxLength={120} />

      <ChoicePills
        legend="Status"
        name="status"
        value={values.status}
        options={STATUS_CHOICES}
        onChange={change('status')}
      />

      {values.status === 'visited' && (
        <div className="visited-block">
          <label htmlFor="rating">Rating, 1 to 5</label>
          <input
            id="rating"
            type="number"
            min="1"
            max="5"
            value={values.rating}
            onChange={change('rating')}
          />

          <label htmlFor="photo-file">Photos (optional, up to {MAX_PHOTOS})</label>
          {values.photos.length > 0 && (
            <ul className="gallery">
              {values.photos.map((url, i) => (
                <li key={`${i}-${url}`} className="gallery-item">
                  <PlacePhoto
                    url={url}
                    alt={`Photo ${i + 1} of ${values.name || 'this place'}`}
                    className="thumb"
                  />
                  <button
                    type="button"
                    className="ghost"
                    aria-label={`Remove photo ${i + 1}`}
                    onClick={() => removePhoto(i)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          {UPLOADS_ENABLED ? (
            <input
              id="photo-file"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFiles}
              disabled={uploading || values.photos.length >= MAX_PHOTOS}
            />
          ) : (
            <p className="muted small">Photo upload is not set up in this build.</p>
          )}
          <p className="muted small">{values.photos.length} of {MAX_PHOTOS} photos</p>
          {uploading && <p className="muted small">Uploading...</p>}
          {photoError && <p className="error" role="alert">{photoError}</p>}
        </div>
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
  const [confirming, setConfirming] = useState(false)
  const [typeFilter, setTypeFilter] = useState('all')
  const [searchText, setSearchText] = useState('')
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
    setConfirming(false)
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

  function confirmedDelete() {
    const id = selected.id
    setConfirming(false)
    setSelectedId(null)
    setEditing(false)
    setView(returnView)
    handleDelete(id)
  }

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />
  }

  const selected = places.find((p) => p.id === selectedId)
  const activeNav = view === 'detail' ? returnView : view
  const isList = view in STATUS_FOR_VIEW
  const statusFilter = STATUS_FOR_VIEW[view] ?? 'all'

  const visiblePlaces = places.filter(
    (p) =>
      (statusFilter === 'all' || p.status === statusFilter) &&
      (typeFilter === 'all' || p.type === typeFilter) &&
      (searchText === '' || p.name.toLowerCase().includes(searchText.toLowerCase()))
  )

  return (
    <>
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
          {TITLES[view] && <h1>{TITLES[view]}</h1>}

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
                <>
                  <h1>Edit place</h1>
                  <PlaceForm
                    key={selected.id}
                    initial={{ ...selected, rating: selected.rating ?? 4, photos: selected.photos ?? [] }}
                    saving={saving}
                    submitLabel="Save changes"
                    onSubmit={handleUpdate}
                    onCancel={() => setEditing(false)}
                  />
                </>
              ) : (
                <PlaceDetails
                  key={selected.id}
                  place={selected}
                  onEdit={() => setEditing(true)}
                  onDelete={() => setConfirming(true)}
                />
              )}
            </>
          )}

          {isList && (
            <>
              <label htmlFor="place-search">Search places</label>
              <input
                id="place-search"
                type="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />

              <TypeFilter value={typeFilter} onChange={setTypeFilter} />

              {status === 'loading' && (
                <p className="muted">
                  Loading{slow ? '. The server may be waking up, which can take up to a minute.' : '...'}
                </p>
              )}

              {status === 'ready' && visiblePlaces.length === 0 && (
                <p className="muted">
                  {searchText ? 'No places match your search.' : 'No places here yet.'}
                </p>
              )}

              {status === 'ready' && visiblePlaces.length > 0 && (
                <ul className="list">
                  {visiblePlaces.map((place) => (
                    <PlaceCard key={place.id} place={place} onOpen={openPlace} />
                  ))}
                </ul>
              )}
            </>
          )}
        </main>
      </div>

      <Modal
        open={Boolean(selected) && confirming}
        title="Delete this place?"
        small
        onClose={() => setConfirming(false)}
      >
        {selected && (
          <>
            <p>{selected.name} will be removed for good.</p>
            <div className="form-actions">
              <button type="button" onClick={confirmedDelete}>Delete</button>
              <button type="button" className="ghost" data-autofocus onClick={() => setConfirming(false)}>
                Cancel
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  )
}