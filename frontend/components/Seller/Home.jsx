import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import { SellerContext } from '../../context/seller/sellerContext'
import { useState } from 'react'
import ProductCards from './ProductCards'
const Home = () => {
  const {productData} = useContext(SellerContext)
  return (
    <>
      <div>
        <h1>Logo</h1>
        <div>notification</div>
        <Link to={"/seller/profile"}>
          <div>Profile</div>
        </Link>
      </div>  
      <div>
        <Link to={"/seller/add-new-product"}>
          <button>Add New Product</button>
        </Link>  
      </div>  
      <div>
        { !productData?.success ?  (<p>{productData?.message}</p>):
          (<ProductCards />)
        }
        
      </div>            
    </>
  )
}

export default Home 