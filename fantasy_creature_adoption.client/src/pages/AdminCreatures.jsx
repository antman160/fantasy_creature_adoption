import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:5124'

const emptyForm = {
    name: '',
    species: '',
    description: '',
    habitat: '',
    temperament: '',
    diet: '',
    imageUrl: '',
    isAdopted: false,
}

function AdminCreatures() {
    const [creatures, setCreatures] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(emptyForm)

    const token = localStorage.getItem('token')
    const roles = JSON.parse(localStorage.getItem('roles') || '[]')
    const isAdmin = roles.includes('Admin')

    useEffect(() => {
        const loadAdminCreatures = async () => {
            try {
                setLoading(true)
                setError('')
                setMessage('')

                if (!token || !isAdmin) {
                    setError('You must be logged in as an admin to use this page.')
                    return
                }

                const response = await fetch(`${API_BASE}/api/admin/creatures`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to load admin creatures.')
                }

                setCreatures(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadAdminCreatures()
    }, [token, isAdmin])

    const fetchCreatures = async () => {
        try {
            setLoading(true)
            setError('')
            setMessage('')

            const response = await fetch(`${API_BASE}/api/admin/creatures`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to load admin creatures.')
            }

            setCreatures(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }))
    }

    const resetForm = () => {
        setForm(emptyForm)
        setEditingId(null)
    }

    const handleEditClick = (creature) => {
        setEditingId(creature.id)
        setMessage('')
        setError('')
        setForm({
            name: creature.name,
            species: creature.species,
            description: creature.description,
            habitat: creature.habitat,
            temperament: creature.temperament,
            diet: creature.diet,
            imageUrl: creature.imageUrl,
            isAdopted: creature.isAdopted,
        })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setError('')
            setMessage('')

            const isEditing = editingId !== null
            const url = isEditing
                ? `${API_BASE}/api/admin/creatures/${editingId}`
                : `${API_BASE}/api/admin/creatures`

            const method = isEditing ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to save creature.')
            }

            setMessage(isEditing ? 'Creature updated successfully.' : 'Creature created successfully.')
            resetForm()
            await fetchCreatures()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Delete this creature?')
        if (!confirmed) return

        try {
            setError('')
            setMessage('')

            const response = await fetch(`${API_BASE}/api/admin/creatures/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete creature.')
            }

            setMessage(data.message || 'Creature deleted successfully.')
            await fetchCreatures()
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) {
        return <p style={styles.message}>Loading admin tools...</p>
    }

    return (
        <div style={styles.container}>
            <h1>Admin Creature Manager</h1>

            {message && <p style={styles.success}>{message}</p>}
            {error && <p style={styles.error}>{error}</p>}

            {!isAdmin ? null : (
                <>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <h2>{editingId ? 'Edit Creature' : 'Create Creature'}</h2>

                        <input
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />

                        <input
                            name="species"
                            placeholder="Species"
                            value={form.species}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                            style={styles.textarea}
                            required
                        />

                        <input
                            name="habitat"
                            placeholder="Habitat"
                            value={form.habitat}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />

                        <select
                            name="temperament"
                            value={form.temperament}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        >
                            <option value="">Select temperament</option>
                            <option value="Calm">Calm</option>
                            <option value="High-energy">High-energy</option>
                            <option value="Shy">Shy</option>
                            <option value="Independent">Independent</option>
                            <option value="Prey drive">Prey drive</option>
                            <option value="Aggressive">Aggressive</option>
                        </select>

                        <select
                            name="diet"
                            value={form.diet}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        >
                            <option value="">Select diet</option>
                            <option value="Omnivore">Omnivore</option>
                            <option value="Carnivore">Carnivore</option>
                            <option value="Herbivore">Herbivore</option>
                        </select>

                        <input
                            name="imageUrl"
                            placeholder="/images/example.jpg"
                            value={form.imageUrl}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />

                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="isAdopted"
                                checked={form.isAdopted}
                                onChange={handleChange}
                            />
                            Mark as adopted
                        </label>

                        <div style={styles.buttonRow}>
                            <button type="submit" style={styles.button}>
                                {editingId ? 'Update Creature' : 'Create Creature'}
                            </button>

                            {editingId && (
                                <button type="button" onClick={resetForm} style={styles.cancelButton}>
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </form>

                    <div style={styles.listSection}>
                        <h2>All Creatures</h2>

                        {creatures.length === 0 ? (
                            <p>No creatures found.</p>
                        ) : (
                            <div style={styles.grid}>
                                {creatures.map((creature) => (
                                    <div key={creature.id} style={styles.card}>
                                        <img
                                            src={creature.imageUrl}
                                            alt={creature.name}
                                            style={styles.image}
                                        />

                                        <h3>{creature.name}</h3>
                                        <p><strong>Species:</strong> {creature.species}</p>
                                        <p><strong>Temperament:</strong> {creature.temperament}</p>
                                        <p><strong>Diet:</strong> {creature.diet}</p>
                                        <p><strong>Status:</strong> {creature.isAdopted ? 'Adopted' : 'Available'}</p>

                                        <div style={styles.cardButtons}>
                                            <button
                                                onClick={() => handleEditClick(creature)}
                                                style={styles.smallButton}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(creature.id)}
                                                style={styles.deleteButton}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}

const styles = {
    container: {
        maxWidth: '1100px',
        margin: '2rem auto',
        padding: '1rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
        marginBottom: '2rem',
        padding: '1rem',
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#fff',
    },
    input: {
        padding: '0.7rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
    },
    textarea: {
        padding: '0.7rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        minHeight: '100px',
        resize: 'vertical',
    },
    checkboxLabel: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
    },
    buttonRow: {
        display: 'flex',
        gap: '0.75rem',
    },
    button: {
        padding: '0.75rem 1rem',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#2c2c54',
        color: 'white',
        cursor: 'pointer',
    },
    cancelButton: {
        padding: '0.75rem 1rem',
        border: '1px solid #aaa',
        borderRadius: '8px',
        backgroundColor: 'white',
        cursor: 'pointer',
    },
    listSection: {
        marginTop: '2rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
    },
    card: {
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '1rem',
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: '180px',
        objectFit: 'contain',
        borderRadius: '8px',
        marginBottom: '0.75rem',
    },
    cardButtons: {
        display: 'flex',
        gap: '0.75rem',
        marginTop: '0.75rem',
    },
    smallButton: {
        padding: '0.55rem 0.9rem',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#2c2c54',
        color: 'white',
        cursor: 'pointer',
    },
    deleteButton: {
        padding: '0.55rem 0.9rem',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: 'crimson',
        color: 'white',
        cursor: 'pointer',
    },
    message: {
        padding: '2rem',
        textAlign: 'center',
    },
    success: {
        color: 'green',
        fontWeight: 'bold',
        marginBottom: '1rem',
    },
    error: {
        color: 'crimson',
        fontWeight: 'bold',
        marginBottom: '1rem',
    },
}

export default AdminCreatures