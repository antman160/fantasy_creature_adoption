import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'

const API_BASE = 'http://localhost:5124'

function CreatureDetails() {
    const { id } = useParams()
    const [creature, setCreature] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [adoptMessage, setAdoptMessage] = useState('')
    const [adoptError, setAdoptError] = useState('')
    const [adopting, setAdopting] = useState(false)

    const fetchCreature = useCallback(async () => {
        try {
            setLoading(true)
            setError('')

            const response = await fetch(`${API_BASE}/api/creatures/${id}`)

            if (!response.ok) {
                throw new Error('Creature not found.')
            }

            const data = await response.json()
            setCreature(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchCreature()
    }, [fetchCreature])

    const handleAdopt = async () => {
        try {
            setAdopting(true)
            setAdoptMessage('')
            setAdoptError('')

            const token = localStorage.getItem('token')

            if (!token) {
                setAdoptError('You must be logged in to adopt a creature.')
                return
            }

            const response = await fetch(`${API_BASE}/api/adoptions/${id}`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Failed to adopt creature.')
            }

            setAdoptMessage(data.message || 'Creature adopted successfully.')

            await fetchCreature()
        } catch (err) {
            setAdoptError(err.message)
        } finally {
            setAdopting(false)
        }
    }

    if (loading) return <p style={styles.message}>Loading creature...</p>
    if (error) return <p style={styles.error}>{error}</p>
    if (!creature) return <p style={styles.message}>No creature found.</p>

    return (
        <div style={styles.container}>
            <Link to="/creatures" style={styles.backLink}>Back to Browse</Link>

            <h1>{creature.name}</h1>
            <p><strong>Species:</strong> {creature.species}</p>
            <p><strong>Description:</strong> {creature.description}</p>
            <p><strong>Habitat:</strong> {creature.habitat}</p>
            <p><strong>Temperament:</strong> {creature.temperament}</p>
            <p><strong>Diet:</strong> {creature.diet}</p>
            <p><strong>Status:</strong> {creature.isAdopted ? 'Adopted' : 'Available'}</p>

            {!creature.isAdopted && (
                <button onClick={handleAdopt} style={styles.button} disabled={adopting}>
                    {adopting ? 'Adopting...' : 'Adopt Creature'}
                </button>
            )}

            {adoptMessage && <p style={styles.success}>{adoptMessage}</p>}
            {adoptError && <p style={styles.error}>{adoptError}</p>}
        </div>
    )
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '2rem auto',
        padding: '1rem',
    },
    backLink: {
        display: 'inline-block',
        marginBottom: '1rem',
        textDecoration: 'none',
        color: '#2c2c54',
    },
    button: {
        marginTop: '1rem',
        padding: '0.75rem 1.25rem',
        border: 'none',
        borderRadius: '8px',
        backgroundColor: '#2c2c54',
        color: 'white',
        cursor: 'pointer',
    },
    message: {
        padding: '2rem',
        textAlign: 'center',
    },
    success: {
        marginTop: '1rem',
        color: 'green',
        fontWeight: 'bold',
    },
    error: {
        marginTop: '1rem',
        color: 'crimson',
    },
}

export default CreatureDetails