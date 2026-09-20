import React, { useContext, useEffect, useState } from "react"
import { CustomerContext } from "../../context/customer/CustomerContext"
import { useParams, Link, Route, useNavigate } from "react-router-dom"

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getProduct, product, addToWishList, setOrder } = useContext(CustomerContext)

  const [index, setIndex] = useState(0)

  useEffect(() => {
    getProduct(id)
  }, [id])

  function prev() {
    if (index > 0) {
      setIndex(index - 1)
    }
  }

  function next() {
    if (index < product?.photos?.length - 1) {
      setIndex(index + 1)
    }
  }

  if (!product) {
    return <p>Loading product...</p>
  }

  return (
    <>
      <div key={product?._id}>
        <h1>Product Details</h1>

        <Link to="/">
          Back
        </Link>
        <br />
        <button onClick={() => {addToCart(product?._id)}}>Add to cart</button>
        <button onClick={() => {addToWishList(product?._id)}}>Like</button>
        <br />

        <button onClick={prev} disabled={index === 0}>
          Prev
        </button>

        <button
          onClick={next}
          disabled={index === product.photos.length - 1}
        >
          Next
        </button>

        <br />

        <img
          src={`http://localhost:5000${product.photos?.[index]}`}
          alt="product"  style={{width: "300px"}}
        />

        <p>{product.pName}</p>

        <p>
          Category Type: {product?.category?.categoryType}
        </p>

        <p>
          Category Name: {product?.category?.categoryName}
        </p>

        <p>Price: {product?.price}</p>

        <p>Stocks: {product?.stocks}</p>

        <p>Description: {product?.description}</p>
        <button onClick={() => {
          setOrder(product?._id)
          navigate("/buy-product")
          }}>Buy now</button>
        <div>
          <h3>Review</h3>

          {product?.reviews?.length === 0 ? (
            <p>No Reviews</p>
          ) : (
            product?.reviews?.map((review) => (
              <div key={review._id}>
                <img
                  src={`http://localhost:5000${review?.customerId?.profilePhoto}`}
                  alt="profile" style={{width: "50px"}}
                />

                <p>{review?.rating}</p>
                <p>{review?.customerId?.username}</p>
                <p>{review?.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default ProductDetails