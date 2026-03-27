import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BrowseCreatures from './pages/BrowseCreatures'
import CreatureDetails from './pages/CreatureDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import MyAdoptions from './pages/MyAdoptions'
import Navbar from './components/Navbar'

function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/creatures" element={<BrowseCreatures />} />
                <Route path="/creatures/:id" element={<CreatureDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/my-adoptions" element={<MyAdoptions />} />
            </Routes>
        </>
    )
}

export default App