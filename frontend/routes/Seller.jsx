import { Routes, Route } from 'react-router-dom'
import Home from "../components/Seller/Home"
import Login from "../components/Seller/Login"
import Register from '../components/Seller/Register'
import Profile from '../components/Seller/Profile'
import { SellerProvider } from '../context/seller/sellerContext'
function Seller(){
  return (
      <>
        <SellerProvider>
        <Routes>
          <Route path= '/' element={<Login />}></Route>
          <Route path='/register' element={ <Register />} />
          <Route path='/home' element={<Home />} />
          <Route path='/profile' element={<Profile />} />        
        </Routes>
      </SellerProvider>
    </>
  )
}

export default Seller