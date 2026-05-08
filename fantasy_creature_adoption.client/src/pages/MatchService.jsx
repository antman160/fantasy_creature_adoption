import { useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'http://localhost:5124'

function MatchService() {
    // Stores answers
    const [form, setForm] = useState({
        preferredSpecies: '',
        preferredTemperament: '',
        preferredDiet: '',
        housingType: '',
    })

    // Stores the ranked results
    const [results, setResults] = useState([])

    // tracks currently running
    const [loading, setLoading] = useState(false)

    // Stores error message 
    const [error, setError] = useState('')

    // Updates the form on input
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            setError('')

            // Get the saved login token 
            const token = localStorage.getItem('token')

            if (!token) {
                setError('You must be logged in to use the match service.')
                return
            }

            const response = await fetch(`${API_BASE}/api/match`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            })

            const data = await response.json()

            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to get matches.')
            }

            
            setResults(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <h1>Match Service</h1>
            <p>Answer a few questions to find compatible creatures.</p>

            <form onSubmit={handleSubmit} style={styles.form}>
                <select
                    name="preferredSpecies"
                    value={form.preferredSpecies}
                    onChange={handleChange}
                    style={styles.input}
                >
                    <option value="">Any Species</option>
                    <option value="Dragon">Dragon</option>
                    <option value="Unicorn">Unicorn</option>
                    <option value="Jackalope">Jackalope</option>
                    <option value="Griffin">Griffin</option>
                    <option value="Phoenix">Phoenix</option>
                    <option value="Mothman">Mothman</option>
                </select>

                <select
                    name="preferredTemperament"
                    value={form.preferredTemperament}
                    onChange={handleChange}
                    style={styles.input}
                    required
                >
                    <option value="">Select Temperament</option>
                    <option value="Calm">Calm</option>
                    <option value="High-energy">High-energy</option>
                    <option value="Shy">Shy</option>
                    <option value="Independent">Independent</option>
                    <option value="Prey drive">Prey drive</option>
                    <option value="Aggressive">Aggressive</option>
                </select>

                <select
                    name="preferredDiet"
                    value={form.preferredDiet}
                    onChange={handleChange}
                    style={styles.input}
                >
                    <option value="">Any Diet</option>
                    <option value="Omnivore">Omnivore</option>
                    <option value="Carnivore">Carnivore</option>
                    <option value="Herbivore">Herbivore</option>
                </select>

                <select
                    name="housingType"
                    value={form.housingType}
                    onChange={handleChange}
                    style={styles.input}
                    required
                >
                    <option value="">Select Housing Type</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Ranch">Ranch</option>
                    <option value="Rural">Rural</option>
                    <option value="QuietHome">Quiet Home</option>
                    <option value="Aviary">Aviary</option>
                </select>

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Finding Matches...' : 'Get Matches'}
                </button>
            </form>

            {/* Show error message if something went wrong */}
            {error && <p style={styles.error}>{error}</p>}

            {/* Show ranked results after the questionnaire is submitted */}
            {results.length > 0 && (
                <div style={styles.results}>
                    <h2>Recommended Creatures</h2>

                    <div style={styles.grid}>
                        {results.map((match) => (
                            <div key={match.creatureId} style={styles.card}>
                                <img src={match.imageUrl} alt={match.name} style={styles.image} />
                                <h3>{match.name}</h3>
                                <p><strong>Score:</strong> {match.score}</p>
                                <p><strong>Species:</strong> {match.species}</p>
                                <p><strong>Temperament:</strong> {match.temperament}</p>
                                <p><strong>Diet:</strong> {match.diet}</p>
                                <p><strong>Habitat:</strong> {match.habitat}</p>

                                {/* Show the reasons why this creature matched */}
                                {match.reasons.length > 0 && (
                                    <ul style={styles.reasonList}>
                                        {match.reasons.map((reason, index) => (
                                            <li key={index}>{reason}</li>
                                        ))}
                                    </ul>
                                )}

                                <Link to={`/creatures/${match.creatureId}`} style={styles.link}>
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
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
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '0.75rem',
        marginTop: '1rem',
        marginBottom: '2rem',
    },
    input: {
        padding: '0.7rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
    },
    button: {
        padding: '0.75rem 1rem',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#2c2c54',
        color: 'white',
        cursor: 'pointer',
    },
    error: {
        color: 'crimson',
        marginTop: '1rem',
    },
    results: {
        marginTop: '2rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
    reasonList: {
        paddingLeft: '1.2rem',
    },
    link: {
        display: 'inline-block',
        marginTop: '0.75rem',
        textDecoration: 'none',
        color: '#2c2c54',
        fontWeight: 'bold',
    },
}

export default MatchService