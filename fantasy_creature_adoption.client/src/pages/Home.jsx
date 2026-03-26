import { Link } from 'react-router-dom'

function Home() {
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
        </div>
    )
}

const styles = {
    container: {
        maxWidth: '800px',
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
}

export default Home