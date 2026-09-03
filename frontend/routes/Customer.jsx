import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Body from '../components/customer/Body'
import Cart from '../components/customer/Cart'
import ProductDetails from '../components/customer/ProductDetails'
import Login from '../components/customer/Login'

const Customer = () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<Body />} />
                <Route path='/cart' element={<Cart />}></Route>
                <Route path='/productDetails/:id' element={<ProductDetails />}></Route>
                <Route path='/login' element={<Login />} />
            </Routes>
        </>
    )
}

export default Customer