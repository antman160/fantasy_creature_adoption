import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BrowseCreatures from './pages/BrowseCreatures'
import CreatureDetails from './pages/CreatureDetails'
import Navbar from './components/Navbar'

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/creatures" element={<BrowseCreatures />} />
                <Route path="/creatures/:id" element={<CreatureDetails />} />
            </Routes>
        </>
    )
}

export default App