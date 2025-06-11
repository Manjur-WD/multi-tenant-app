import React, { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Preloader from './components/Preloader'


// Lazy load the Dashboard page only
const DashBoard = lazy(() => import('./pages/DashBoard'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const ProductList = lazy(() => import('./pages/Products/ProductList'))
const AddProduct = lazy(() => import('./pages/Products/AddProduct'))

const App = () => {
  return (
    <Suspense fallback={<Preloader />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashBoard />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/add-product" element={<AddProduct />} />
        </Route>


        {/* <Route path="/" element={<DashBoard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/product-list" element={<ProductList />} /> */}
      </Routes>
    </Suspense>
  )
}

export default App
