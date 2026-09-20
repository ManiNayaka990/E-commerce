import { Children, createContext, useEffect, useState } from "react";

const CustomerContext = createContext()
const CustomerProvider = ({children}) =>{
    const [products, setProducts] = useState([])
    const [searchProduct, setSearchProduct] = useState([])
    const [product, setProduct] = useState(null)
    const [loginStatus, setStatus] = useState(false)
    const [orderData, setOrderData] = useState("")

    useEffect(() => {
      async function getLoginStatus(){
      const res = await fetch("http://localhost:5000/api/customer/login-check",{
        method: "POST",
        credentials: "include"
      })
      const data = await res.json()      
      if(data?.success){
        setStatus(true)
      }
    }
    getLoginStatus()
  }, [])

    async function getProducts(){
      const res = await fetch("http://localhost:5000/api/customer/products",{
        credentials: "include"
      })
      const data = await res.json()
      console.log(data)
      if(data?.success)
        setProducts(data.data)
    }
    useEffect(()=>{
      getProducts()
    }, [])
    
    async function getProductOnSearch(category, searchValue) {
      const res = await fetch(`http://localhost:5000/api/customer/search-products/${category}/${searchValue}`,{
        credentials: "include"
      })
      const data = await res.json()
      console.log(data?.message)
      if(data?.success)
        setSearchProduct(data.data)
    }

    async function getProduct(id) {
      const res = await fetch(`http://localhost:5000/api/customer/single-product/${id}`,
        {
          credentials: "include"
        }
      )
      const data = await res.json()
      console.log(data.message)
      setProduct(data?.data)
    }
    async function addToWishList(id) {
    const res = await fetch(`http://localhost:5000/api/customer/add-to-wishList/${id}`, 
      {
        method: "POST",
        credentials: "include"
      }
    )
    const data = await res.json()
    window.alert(data.message)

  }

  async function addToCart(id){
    const res = await fetch(`http://localhost:5000/api/customer/add-to-cart/${id}`,{
      method: "POST",
      credentials: "include"
    })
    const data = await res.json()
    window.alert(data.message)
  }
  function setOrder(id){
    setOrderData(id)
  }
  return <CustomerContext.Provider value={{
    searchProduct,
    products, 
    product, 
    setOrder, 
    orderData, 
    getProduct, 
    loginStatus, 
    addToCart, 
    addToWishList,
    getProductOnSearch
  }}>{children}</CustomerContext.Provider>
}
export {CustomerContext, CustomerProvider}