import React, { useEffect, useState, useContext } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { SellerContext } from '../../context/seller/sellerContext'
const ProductDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const { product, getProductDetails } = useContext(SellerContext)

    const [index, setIndex] = useState(0)

    useEffect(() => {
        setIndex(0)
        getProductDetails(id)
    }, [id])
    if (!product) {
        return <p>Loading product...</p>
    }
    if (!product?.success) {
        return <p>{product?.message}</p>
    }

    const productDetails = product?.data

    function prev() {
        if (index !== 0) {
            setIndex(index - 1)
        }
    }

    function next() {
        if (index < productDetails?.photos?.length - 1) {
            setIndex(index + 1)
        }
    }
    async function deleteProduct(){
        const res = await fetch(`http://localhost:5000/api/seller/delete-product/${productDetails._id}`,{
            method: "DELETE",
            credentials: "include"
        })
        const data = await res.json()
        console.log(data)
        if(data.success)
        {
            window.alert("Product deleted successfully")
            navigate("/seller/home")
        }
        else{
            window.alert(data.message)
        }
    }
    return (
        <>
        <div key={productDetails?._id}>
            <h1>Product Details</h1>

            <Link to="/seller/home">
                Back
            </Link>

            <Link to={`/seller/edit-product/${productDetails?._id}`}>
                <button>Edit Product</button>
            </Link>

            <button onClick={prev}>Prev</button>
            <button onClick={next}>Next</button>

            <img
                src={`http://localhost:5000${productDetails?.photos?.[index]}`}
                alt="product photos"
            />

            <p>{productDetails?.pName}</p>
            <p>Category Type {productDetails?.category?.categoryType}</p>
            <p>Category Name {productDetails?.category?.categoryName}</p>
            <p>Price {productDetails?.price}</p>
            <p>Stocks {productDetails?.stocks}</p>
            <p>Description {productDetails?.description}</p>

            <div>
                <h3>Review</h3>

                {productDetails?.reviews?.length === 0 ? (
                    <p>No Reviews</p>
                ) : (
                    productDetails?.reviews?.map(review => (
                        <div key={review._id}>
                            <img
                                src={`http://localhost:5000${review?.customerId?.profilePhoto}`}
                                alt="profile photo"
                            />

                            <p>{review?.rating}</p>
                            <p>{review?.customerId?.username}</p>
                            <p>{review?.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
        <button onClick={deleteProduct}>Delete Product</button>
        </>
    )
}
export default ProductDetails