import React from 'react'
import ProtectedRoute from './components/ProtectedRoute'
import { Route, Routes } from 'react-router-dom'
import SignIn from './pages/LoginPage'
import DashBoard from './pages/DashBoard'
import ProductList from './pages/Products/ProductList'
import LoginPage from './pages/LoginPage'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashBoard />} />
        <Route path="/product-list" element={<ProductList />} />
      </Route>
    </Routes>
  )
}

export default App
