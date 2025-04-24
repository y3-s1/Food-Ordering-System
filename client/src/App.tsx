import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Register from './pages/Register';

function App() {
  // const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
       
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
    
  );
}

export default App
