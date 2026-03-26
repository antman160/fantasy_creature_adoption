import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'http://localhost:5124'

function BrowseCreatures() {
    const [creatures, setCreatures] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [search, setSearch] = useState('')
    const [species, setSpecies] = useState('')
    const [temperament, setTemperament] = useState('')
    const [diet, setDiet] = useState('')
    const [availableOnly, setAvailableOnly] = useState(false)

    // Load all creatures once when the page first opens
    useEffect(() => {
        const loadInitialCreatures = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await fetch(`${API_BASE}/api/creatures`)

                if (!response.ok) {
                    throw new Error('Failed to load creatures.')
                }

                const data = await response.json()
                setCreatures(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadInitialCreatures()
    }, [])

    const fetchCreatures = async () => {
        try {
            setLoading(true)
            setError('')

            const params = new URLSearchParams()

            if (search) params.append('search', search)
            if (species) params.append('species', species)
            if (temperament) params.append('temperament', temperament)
            if (diet) params.append('diet', diet)
            if (availableOnly) params.append('availableOnly', 'true')

            const response = await fetch(`${API_BASE}/api/creatures?${params.toString()}`)

            if (!response.ok) {
                throw new Error('Failed to load creatures.')
            }

            const data = await response.json()
            setCreatures(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterSubmit = (e) => {
        e.preventDefault()
        fetchCreatures()
    }

    return (
        <div style={styles.container}>
            <h1>Browse Creatures</h1>

            <form onSubmit={handleFilterSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={styles.input}
                />

                <select value={species} onChange={(e) => setSpecies(e.target.value)} style={styles.input}>
                    <option value="">All Species</option>
                    <option value="Dragon">Dragon</option>
                    <option value="Unicorn">Unicorn</option>
                    <option value="Jackalope">Jackalope</option>
                    <option value="Griffin">Griffin</option>
                    <option value="Phoenix">Phoenix</option>
                    <option value="Mothman">Mothman</option>
                </select>

                <select
                    value={temperament}
                    onChange={(e) => setTemperament(e.target.value)}
                    style={styles.input}
                >
                    <option value="">All Temperaments</option>
                    <option value="Calm">Calm</option>
                    <option value="High-energy">High-energy</option>
                    <option value="Shy">Shy</option>
                    <option value="Independent">Independent</option>
                    <option value="Prey drive">Prey drive</option>
                    <option value="Aggressive">Aggressive</option>
                </select>

                <select value={diet} onChange={(e) => setDiet(e.target.value)} style={styles.input}>
                    <option value="">All Diets</option>
                    <option value="Omnivore">Omnivore</option>
                    <option value="Carnivore">Carnivore</option>
                    <option value="Herbivore">Herbivore</option>
                </select>

                <label style={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={availableOnly}
                        onChange={(e) => setAvailableOnly(e.target.checked)}
                    />
                    Available only
                </label>

                <button type="submit" style={styles.button}>Apply Filters</button>
            </form>

            {loading && <p>Loading creatures...</p>}
            {error && <p style={styles.error}>{error}</p>}

            {!loading && !error && creatures.length === 0 && (
                <p>No creatures matched your search.</p>
            )}

            <div style={styles.grid}>
                {creatures.map((creature) => (
                    <div key={creature.id} style={styles.card}>
                        <h2>{creature.name}</h2>
                        <p><strong>Species:</strong> {creature.species}</p>
                        <p><strong>Temperament:</strong> {creature.temperament}</p>
                        <p><strong>Diet:</strong> {creature.diet}</p>
                        <p><strong>Habitat:</strong> {creature.habitat}</p>
                        <p><strong>Status:</strong> {creature.isAdopted ? 'Adopted' : 'Available'}</p>

                        <Link to={`/creatures/${creature.id}`} style={styles.detailsLink}>
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
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
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '0.75rem',
        marginBottom: '2rem',
        alignItems: 'center',
    },
    input: {
        padding: '0.6rem',
        borderRadius: '6px',
        border: '1px solid #ccc',
    },
    checkboxLabel: {
        display: 'flex',
        gap: '0.5rem',
        alignItems: 'center',
    },
    button: {
        padding: '0.7rem 1rem',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#2c2c54',
        color: 'white',
        cursor: 'pointer',
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
    detailsLink: {
        display: 'inline-block',
        marginTop: '0.75rem',
        color: '#2c2c54',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
    error: {
        color: 'crimson',
    },
}

export default BrowseCreatures