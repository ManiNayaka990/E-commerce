import { Routes, Route, Outlet } from 'react-router-dom'

import Home from "../components/Seller/Home"
import Login from "../components/Seller/Login"
import Register from '../components/Seller/Register'
import Profile from '../components/Seller/Profile'

import { SellerProvider } from '../context/seller/sellerContext'
import EditProfile from '../components/Seller/EditProfile'
import ProductCards from '../components/global/ProductCards'
import ProductDetails from '../components/Seller/ProductDetails'
import EditProduct from '../components/Seller/EditProduct'
import AddProduct from '../components/Seller/AddProduct'

function SellerProviderLayout() {
    return (
        <SellerProvider>
            <Outlet />
        </SellerProvider>
    )
}

function Seller() {
    return (
        <Routes>

            {/* Public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected seller routes */}
            <Route element={<SellerProviderLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/editProfile" element = {<EditProfile></EditProfile>} />
                <Route path="/product-card" element = {<ProductCards />} />
                <Route path={`/product-details/:id`} element = { <ProductDetails />} />
                <Route path={`/edit-product/:id`} element = { <EditProduct />} />
                <Route path={`/add-new-product`} element={<AddProduct />}/>
            </Route>

        </Routes>
    )
}

export default Seller