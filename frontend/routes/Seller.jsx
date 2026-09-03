import { Routes, Route } from 'react-router-dom'
import Home from "../components/Seller/Home"
import Login from "../components/Seller/Login"
import Register from '../components/Seller/Register'
function Seller(){
  return (
    <>
      <Routes>
        <Route path='/' element={<Login />}></Route>
        <Route path='/home' element={<Home />} />
        <Route path='/register' element={ <Register />} />
      </Routes>
      
    </>
  )
}

export default Seller