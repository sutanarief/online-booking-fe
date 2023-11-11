import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Protected from './components/Protected'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
          <Route
            path='/login'
            element={
              <Protected>
                <Login />
              </Protected>}
          />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
