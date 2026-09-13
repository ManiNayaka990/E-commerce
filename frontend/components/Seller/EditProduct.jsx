import React, { useContext, useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { SellerContext } from "../../context/seller/sellerContext"

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const { product, getProductDetails } = useContext(SellerContext)

  const [productData, setProduct] = useState({
    pName: "",
    price: "",
    description: "",
    stocks: "",
    categoryName: "",
    categoryType: ""
  })

  const [photos, setPhotos] = useState([])

  useEffect(() => {
    getProductDetails(id)
  }, [id])

  useEffect(() => {
    if (product?.success && product?.data) {
      setProduct({
        pName: product.data.pName || "",
        price: product.data.price || "",
        description: product.data.description || "",
        stocks: product.data.stocks || "",
        categoryName: product.data.category.categoryName || "",
        categoryType: product.data.category.categoryType || ""
      })
    }
  }, [product])

  function handleChange(e) {
    const { name, value } = e.target

    setProduct((previousData) => ({
      ...previousData,
      [name]: value
    }))
  }

  function handlePhotoChange(e) {
    setPhotos((prevPhotos) => [
      ...prevPhotos,
      ...Array.from(e.target.files)
    ])
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData()

    formData.append("pName", productData.pName)
    formData.append("price", productData.price)
    formData.append("description", productData.description)
    formData.append("stocks", productData.stocks)
    formData.append("categoryName", productData.categoryName)
    formData.append("categoryType", productData.categoryType)
    photos.forEach((photo) => {
      formData.append("product-photos", photo)
    })

    try {
      const response = await fetch(
        `http://localhost:5000/api/seller/updateProduct/${id}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData
        }
      )

      const data = await response.json()

      if (data.success) {
        window.alert(data.message)
        navigate(`/seller/product-details/${id}`)
      } else {
        window.alert(data.message)
      }
    } catch (error) {
      console.error(error)
      window.alert("Something went wrong")
    }
  }

  if (!product) {
    return <p>Loading...</p>
  }

  if (!product.success) {
    return <p>{product.message}</p>
  }

  return (
    <div>
      <h1>Edit Product</h1>
      <Link to={"/seller/home"}>back</Link>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="pName"
          placeholder="Product name"
          value={productData.pName}
          onChange={handleChange}
        />
       <input
            type="text"
            name="categoryName"
            placeholder="Category Name"
            value={ productData?.categoryName}
            onChange={handleChange}
        />
        <input
            type="text"
            name="categoryType"
            placeholder="Category Type"
            value={productData?.categoryType}
            onChange={handleChange}
        /> 

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={productData.price}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={productData.description}
          onChange={handleChange}
        />

        <input
          type="number"
          name="stocks"
          placeholder="Stocks"
          value={productData.stocks}
          onChange={handleChange}
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
        />

        <p>{photos.length} photo(s) selected</p>

        <button type="submit">
          Update Product
        </button>
      </form>
    </div>
  )
}

export default EditProduct