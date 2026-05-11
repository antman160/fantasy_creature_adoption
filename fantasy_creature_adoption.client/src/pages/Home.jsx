import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'http://localhost:5124'

function Home() {
    const [featuredCreature, setFeaturedCreature] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadFeaturedCreature = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await fetch(`${API_BASE}/api/creatures?availableOnly=true`)

                if (!response.ok) {
                    throw new Error('Failed to load featured creature.')
                }

                const data = await response.json()

                if (!data || data.length === 0) {
                    setFeaturedCreature(null)
                    return
                }

                const randomIndex = Math.floor(Math.random() * data.length)
                setFeaturedCreature(data[randomIndex])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadFeaturedCreature()
    }, [])

    return (
        <div style={styles.container}>
            <h1>Fantasy Creature Adoption</h1>
            <p>
                Welcome to the adoption center. Browse magical companions and find the
                creature that best matches your home and lifestyle.
            </p>

            <Link to="/creatures" style={styles.button}>
                Browse Creatures
            </Link>

            <div style={styles.featuredSection}>
                <h2 style={styles.featuredTitle}>Featured cutie</h2>

                {loading && <p>Loading featured creature...</p>}
                {error && <p style={styles.error}>{error}</p>}

                {!loading && !error && !featuredCreature && (
                    <p>No available creatures to feature right now.</p>
                )}

                {!loading && !error && featuredCreature && (
                    <div style={styles.card}>
                        <div style={styles.imageFrame}>
                            <img
                                src={featuredCreature.imageUrl}
                                alt={featuredCreature.name}
                                style={styles.image}
                            />
                        </div>

                        <h3>{featuredCreature.name}</h3>
                        <p><strong>Species:</strong> {featuredCreature.species}</p>
                        <p><strong>Temperament:</strong> {featuredCreature.temperament}</p>
                        <p><strong>Diet:</strong> {featuredCreature.diet}</p>

                        <Link
                            to={`/creatures/${featuredCreature.id}`}
                            style={styles.detailsLink}
                        >
                            View Details
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

const styles = {
    container: {
        maxWidth: '900px',
        margin: '3rem auto',
        textAlign: 'center',
        padding: '1rem',
    },
    button: {
        display: 'inline-block',
        marginTop: '1rem',
        padding: '0.75rem 1.25rem',
        backgroundColor: '#2c2c54',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
    },
    featuredSection: {
        marginTop: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    featuredTitle: {
        marginBottom: '1rem',
    },
    card: {
        width: '100%',
        maxWidth: '340px',
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '1rem',
        backgroundColor: '#fff',
        textAlign: 'left',
    },
    imageFrame: {
        width: '100%',
        height: '220px',
        backgroundColor: '#f4f4f8',
        borderRadius: '8px',
        marginBottom: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
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

export default Home