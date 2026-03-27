import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const userFullName = localStorage.getItem('userFullName')

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userFullName')
        navigate('/login')
    }

    return (
        <nav style={styles.nav}>
            <div style={styles.brand}>Fantasy Creature Adoption</div>

            <div style={styles.links}>
                <Link to="/" style={styles.link}>Home</Link>
                <Link to="/creatures" style={styles.link}>Browse Creatures</Link>

                {!token ? (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                ) : (
                    <>
                        <Link to="/my-adoptions" style={styles.link}>My Adoptions</Link>
                        <span style={styles.userText}>{userFullName || 'Logged in'}</span>
                        <button onClick={handleLogout} style={styles.logoutButton}>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#2c2c54',
        color: 'white',
        width: '100%',
    },
    brand: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
    },
    links: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
    },
    link: {
        color: 'white',
        textDecoration: 'none',
    },
    userText: {
        color: '#ddd',
    },
    logoutButton: {
        padding: '0.45rem 0.8rem',
        border: '1px solid white',
        borderRadius: '6px',
        backgroundColor: 'transparent',
        color: 'white',
        cursor: 'pointer',
    },
}

export default Navbar