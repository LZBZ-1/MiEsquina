import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DonarPage from './pages/DonarPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/donar" element={<DonarPage />} />
        <Route path="/donar/:id" element={<DonarPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
