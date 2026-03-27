import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'http://localhost:5124'

function MyAdoptions() {
    const [adoptions, setAdoptions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchMyAdoptions = async () => {
            try {
                setLoading(true)
                setError('')

                const token = localStorage.getItem('token')

                if (!token) {
                    setError('You must be logged in to view your adoptions.')
                    return
                }

                const response = await fetch(`${API_BASE}/api/adoptions/my`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                })

                const text = await response.text()
                const data = text ? JSON.parse(text) : []

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to load your adoptions.')
                }

                setAdoptions(Array.isArray(data) ? data : [])
            } catch (err) {
                console.error('MyAdoptions error:', err)
                setError(err.message || 'Something went wrong loading your adoptions.')
            } finally {
                setLoading(false)
            }
        }

        fetchMyAdoptions()
    }, [])

    return (
        <div style={styles.container}>
            <h1>My Adoptions</h1>

            {loading && <p style={styles.message}>Loading your adoptions...</p>}

            {!loading && error && <p style={styles.error}>{error}</p>}

            {!loading && !error && adoptions.length === 0 && (
                <p style={styles.message}>You have not adopted any creatures yet.</p>
            )}

            {!loading && !error && adoptions.length > 0 && (
                <div style={styles.grid}>
                    {adoptions.map((adoption) => (
                        <div key={adoption.adoptionId} style={styles.card}>
                            <h2>{adoption.creatureName}</h2>
                            <p><strong>Species:</strong> {adoption.species}</p>
                            <p>
                                <strong>Adopted On:</strong>{' '}
                                {new Date(adoption.adoptedAt).toLocaleString()}
                            </p>

                            <Link to={`/creatures/${adoption.creatureId}`} style={styles.link}>
                                View Creature
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const styles = {
    container: {
        maxWidth: '1000px',
        margin: '2rem auto',
        padding: '1rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1rem',
        marginTop: '1rem',
    },
    card: {
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '1rem',
        backgroundColor: '#fff',
    },
    link: {
        display: 'inline-block',
        marginTop: '0.75rem',
        textDecoration: 'none',
        color: '#2c2c54',
        fontWeight: 'bold',
    },
    message: {
        marginTop: '1rem',
    },
    error: {
        marginTop: '1rem',
        color: 'crimson',
    },
}

export default MyAdoptions