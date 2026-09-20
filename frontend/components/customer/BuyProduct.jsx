import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CustomerContext } from '../../context/customer/CustomerContext'

const BuyProduct = () => {
  const navigate = useNavigate()
  const {orderData} = useContext(CustomerContext)
  const [paymentType, getPaymentType] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("")
  const [message, setMessage] = useState("")
  const [stocks, setStocks] = useState(0)
  useEffect(() => {
    async function get(){
      const res = await fetch("http://localhost:5000/api/customer/order-info",{
        credentials: 'include'
      })
      const data = await res.json()
      getPaymentType(data.paymentTypes)
    }
    get()
  }, [])
  function addPaymentMethod(e){
    setPaymentMethod(e.target.value)
  }
  const date = new Date()
  date.setDate(date.getDate() + 5)
  const now = (date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear())

  async function buyNow() {
    const res = await fetch(`http://localhost:5000/api/customer/order-product/${orderData}`,{
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({paymentMethod, stocks})
    })
    const data = await res.json()
    if(!data?.success)
      setMessage(data?.message)
    else
      navigate("/order-confirmation-card", {
        state: {
          orderDetails: data?.orderData,
          deliveryDetails: data?.deliveryData,
          message: data?.message
        }
      })
  }
  return (
    <>
      <Link to="/"><button>back</button></Link>
      <select onChange={addPaymentMethod} value={paymentMethod}>
        <option disabled value="">Payment method</option>
        {
          paymentType.map((item, index) => (
            <option value={item} key={index}>{item}</option>
          ))
        }
      </select>
      <p>Estimated time {now}</p>
      <input placeholder='Enter Stocks' type='number' onChange={(e) => {setStocks(e.target.value)}}></input>
      <button onClick={buyNow}>Buy Now</button>
      <p>{message}</p>
    </>
  )
}

export default BuyProduct