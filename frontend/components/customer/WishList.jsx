import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
const WishList = () => {
  const [products, setProduct] = useState([])

  useEffect(() =>{
    async function getProduct() {
      const res = await fetch("http://localhost:5000/api/customer/wish-list",{
        method: "GET",
        credentials: "include"
      })    
      const data = await res.json()  
      if(data.success){
        setProduct(data.data)
       if(products.length === 0){
        
        return (<p>No Products added yet</p> )
       }
      }
      else
        console.log(data.message)
      }
    getProduct()
  }, [])
  async function deleteProduct(e) {
    const id = e.target.value 
    const res = await fetch(`http://localhost:5000/api/customer/delete-item-wishlist/${id}`, {
      method: "DELETE",
      credentials: "include"
    })   
    const data = await res.json()
    window.alert(data.message)
  }
  return (
    <>
    <button><Link to="/">Back</Link></button>
      {
        products.length === 0 ? (<p>No products added yet</p>) : (
        products.map((item) =>(
          <Link to={`/productDetails/${item._id}`}>
            <div key={item?._id}>
              <img src={`http://localhost:5000${item?.photos?.[0]}`} style={{width: "100px"}}></img>
              <p>Product Name: {item?.pName}</p>
              <p>Stock Left: {item?.stocks}</p>
              <button onClick={deleteProduct} value={item?._id}>Delete</button>
            </div>
          </Link>
        ))
      )
      }
    </>
  )
}

export default WishList