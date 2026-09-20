import React from 'react'
import { useLocation, Link } from 'react-router-dom'

const OrderConfirmation = () => {
  const location = useLocation()
  const {orderDetails, deliveryDetails, message} = location.state || {} 
  const date = new Date(deliveryDetails.deliveryTime)
  const deliveryDate = date.toLocaleDateString()
  const orderedDate = new Date(orderDetails.orderTime)
  const orderOn = orderedDate.toLocaleDateString()
  return (
    <div>
      <Link to='/'><button>Back</button></Link><br></br>
      <p>{message}</p>
      <p>Order Time: {orderOn}</p>
      <p>Expected delivery date: {deliveryDate}</p>
      <p>Payment Method: {deliveryDetails?.paymentMethod}</p>

    </div>
  )
}

export default OrderConfirmation