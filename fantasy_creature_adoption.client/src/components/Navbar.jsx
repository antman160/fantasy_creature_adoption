import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav style={styles.nav}>
            <div style={styles.brand}>Fantasy Creature Adoption</div>

            <div style={styles.links}>
                <Link to="/" style={styles.link}>Home</Link>
                <Link to="/creatures" style={styles.link}>Browse Creatures</Link>
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
    },
    link: {
        color: 'white',
        textDecoration: 'none',
    },
}

export default Navbar