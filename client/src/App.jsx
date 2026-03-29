import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard';
import Interview from './pages/Interview';
import HomePage from './pages/Homepage';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <div className="App">
            <Routes>
                <Route path='/' element={<HomePage/>} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/interview/:sessionId"
                    element={
                        <ProtectedRoute>
                            <Interview />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    )

}

export default App;
