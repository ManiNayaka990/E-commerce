import React from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const MyOrders = () => {
  const [orders, setOrders] = useState([])
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function getOrders() {
      const res = await fetch(
        "http://localhost:5000/api/customer/order-details",
        {
          credentials: "include"
        }
      )

      const data = await res.json()

      console.log(data)

      setOrders(data?.data || [])
    }

    getOrders()
  }, [])

  async function cancelOrder(e) {
    const res = await fetch(
      `http://localhost:5000/api/customer/cancel-order/${e.target.value}`,
      {
        method: "POST",
        credentials: "include"
      }
    )

    const data = await res.json()

    setMessage(data?.message)
  }

  return (
    <>
      <Link to="/">
        <button>Back</button>
      </Link>

      <br />

      <p>{message}</p>

      {
        orders.length === 0 ? (
          <p>No products added yet</p>
        ) : (
          orders.map((item) => {

            // Get this order's delivery date
            const deliveryDate = new Date(
              item.delivery?.deliveryTime
            )

            const today = new Date()

            const difference =
              deliveryDate.getTime() - today.getTime()

            const daysLeft = Math.ceil(
              difference / (1000 * 60 * 60 * 24)
            )

            return (
              <div key={item._id}>

                <Link
                  to={`/productDetails/${item.products[0].product?._id}`}
                >
                  <img
                    src={`http://localhost:5000${item.products[0].product?.photos[0]}`}
                    style={{ width: "50px" }}
                  />

                  <p>
                    {item.products[0].product?.pName}
                  </p>

                  <p>
                    {daysLeft > 0
                      ? `${daysLeft} days left`
                      : daysLeft === 0
                      ? "Arriving today"
                      : "Delivery date passed"}
                  </p>

                  <p>
                    Delivery status:{" "}
                    {item.delivery?.deliveryStatus}
                  </p>
                </Link>

                <button
                  onClick={cancelOrder}
                  value={item._id}
                >
                  Cancel Order
                </button>

                <br />
              </div>
            )
          })
        )
      }
    </>
  )
}

export default MyOrders