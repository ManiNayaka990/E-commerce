import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const AddProduct = () => {
  const navigate = useNavigate()

  const [newProduct, addProduct] = useState({
    pName: "",
    price: "",
    description: "",
    stocks: "",
    categoryName: "",
    categoryType: ""
  })

  const [photos, setPhotos] = useState([])

  function handlePhotoChange(e) {
    setPhotos((previousPhotos) => [
      ...previousPhotos,
      ...Array.from(e.target.files)
    ])
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData()

    formData.append("pName", newProduct.pName)
    formData.append("price", newProduct.price)
    formData.append("description", newProduct.description)
    formData.append("stocks", newProduct.stocks)
    formData.append("categoryName", newProduct.categoryName)
    formData.append("categoryType", newProduct.categoryType)

    photos.forEach((photo) => {
      formData.append("product-photos", photo)
    })

    const res = await fetch(
      "http://localhost:5000/api/seller/add-product",
      {
        method: "POST",
        body: formData,
        credentials: "include"
      }
    )

    const data = await res.json()

    if (data.success) {
      window.alert(data.message)
      navigate("/seller/home")
    } else {
      window.alert(data.message)
    }
  }

  return (
    <>
      <div>
        <h1>Add Product</h1>

        <Link to="/seller/home">Back</Link>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Product name"
            value={newProduct.pName}
            onChange={(event) =>
              addProduct({
                ...newProduct,
                pName: event.target.value
              })
            }
          />

          {/* Category Name */}
          <select
            value={newProduct.categoryName}
            onChange={(event) =>
              addProduct({
                ...newProduct,
                categoryName: event.target.value,
                categoryType: ""
              })
            }
          >
            <option value="" disabled>
              Select Category Name
            </option>

            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Beauty & Personal Care">
              Beauty & Personal Care
            </option>
            <option value="Sports & Fitness">
              Sports & Fitness
            </option>
            <option value="Books">Books</option>
            <option value="Toys & Games">Toys & Games</option>
            <option value="Grocery">Grocery</option>
            <option value="Automotive">Automotive</option>
            <option value="Computer & Accessories">
              Computer & Accessories
            </option>
          </select>

          {/* Category Type */}
          <select
            value={newProduct.categoryType}
            onChange={(event) =>
              addProduct({
                ...newProduct,
                categoryType: event.target.value
              })
            }
          >
            <option value="" disabled>
              Select Category Type
            </option>

            <option value="Mobiles">Mobiles</option>
            <option value="Laptops">Laptops</option>
            <option value="Headphones">Headphones</option>
            <option value="Cameras">Cameras</option>

            <option value="Men's Clothing">
              Men's Clothing
            </option>
            <option value="Women's Clothing">
              Women's Clothing
            </option>
            <option value="Shoes">Shoes</option>
            <option value="Watches">Watches</option>

            <option value="Furniture">Furniture</option>
            <option value="Kitchen Appliances">
              Kitchen Appliances
            </option>
            <option value="Home Decor">Home Decor</option>

            <option value="Skincare">Skincare</option>
            <option value="Hair Care">Hair Care</option>
            <option value="Makeup">Makeup</option>

            <option value="Gym Equipment">
              Gym Equipment
            </option>
            <option value="Sportswear">Sportswear</option>
            <option value="Cricket">Cricket</option>
            <option value="Football">Football</option>

            <option value="Programming">
              Programming
            </option>
            <option value="Academic">Academic</option>
            <option value="Fiction">Fiction</option>

            <option value="Toys">Toys</option>
            <option value="Board Games">Board Games</option>

            <option value="Snacks">Snacks</option>
            <option value="Beverages">Beverages</option>

            <option value="Car Accessories">
              Car Accessories
            </option>
            <option value="Bike Accessories">
              Bike Accessories
            </option>
          </select>

          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(event) =>
              addProduct({
                ...newProduct,
                price: event.target.value
              })
            }
          />

          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(event) =>
              addProduct({
                ...newProduct,
                description: event.target.value
              })
            }
          />

          <input
            type="number"
            placeholder="Stocks"
            value={newProduct.stocks}
            onChange={(event) =>
              addProduct({
                ...newProduct,
                stocks: event.target.value
              })
            }
          />

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
          />

          <p>{photos.length} photo(s) selected</p>

          <button type="submit">
            Add Product
          </button>

        </form>
      </div>
    </>
  )
}

export default AddProduct