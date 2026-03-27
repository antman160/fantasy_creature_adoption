import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API_BASE = 'http://localhost:5124'

function Register() {
    const navigate = useNavigate()

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            setError('')

            const response = await fetch(`${API_BASE}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                const message =
                    data.message ||
                    (data.errors && data.errors.length > 0 ? data.errors.join(', ') : 'Registration failed.')

                throw new Error(message)
            }

            localStorage.setItem('token', data.token)
            localStorage.setItem('userEmail', data.email)
            localStorage.setItem('userFullName', data.fullName)

            navigate('/creatures')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <h1>Register</h1>

            <form onSubmit={handleSubmit} style={styles.form}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={styles.input}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />

                <button type="submit" style={styles.button} disabled={loading}>
                    {loading ? 'Creating account...' : 'Register'}
                </button>
            </form>

            {error && <p style={styles.error}>{error}</p>}

            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    )
}

const styles = {
    container: {
        maxWidth: '500px',
        margin: '3rem auto',
        padding: '1rem',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginTop: '1rem',
    },
    input: {
        padding: '0.75rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
    },
    button: {
        padding: '0.75rem',
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
}

export default Register