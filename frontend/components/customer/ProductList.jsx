import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import ProductDetails from './ProductDetails'
const ProductList = () => {
  return (
        <>
            <Link to={'/productDetails/:id'}><h3>Product List</h3></Link>
        </>
    )
}

export default ProductList