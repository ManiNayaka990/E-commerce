import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'
import Home from '../components/customer/Home'
import Cart from '../components/customer/Cart'
import ProductDetails from '../components/customer/ProductDetails'
import Login from '../components/customer/Login'
import { CustomerProvider } from '../context/customer/CustomerContext'
import Register from '../components/customer/Register'
import Profile from '../components/customer/Profile'
import WishList from '../components/customer/WishList'
import MyOrders from '../components/customer/MyOrders'
import EditProfile from '../components/customer/EditProfile'
import BuyProduct from '../components/customer/BuyProduct'
import OrderConfirmation from '../components/customer/OrderConfirmation'
function CustomerProviderLayout() {
  return (
    <CustomerProvider>
    <Outlet></Outlet>
    </CustomerProvider>
  )
  
}
const Customer = () => {
  return (
    <>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register></Register>} />

        <Route element={<CustomerProviderLayout></CustomerProviderLayout>}>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />}></Route>
          <Route path={`/productDetails/:id`} element={<ProductDetails />}></Route>
          <Route path='/profile' element={<Profile></Profile>} />
          <Route path='/wishlist' element={<WishList />} />
          <Route path='/my-orders' element={<MyOrders />} />
          <Route path={'/buy-product'} element={<BuyProduct></BuyProduct>}/>
          <Route path='/edit-profile' element ={<EditProfile></EditProfile>}></Route>
          <Route path="/order-confirmation-card" element={<OrderConfirmation></OrderConfirmation>} />
        </Route>


      </Routes>
    </>
  )
}

export default Customer