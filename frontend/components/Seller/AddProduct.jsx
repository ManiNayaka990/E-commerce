import React, {useState} from 'react'
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
  async function handleSubmit(e){
    e.preventDefault()

    const formData = new FormData()

    formData.append("pName", newProduct?.pName)
    formData.append("price", newProduct?.price)
    formData.append("description", newProduct?.description )
    formData.append("stocks", newProduct?.stocks)
    formData.append("categoryName", newProduct?.categoryName)
    formData.append("categoryType", newProduct?.categoryType)
    photos.forEach((photo) => {
            formData.append("product-photos", photo)
        })
    
    const res = await fetch("http://localhost:5000/api/seller/add-product",
      {
        method: "POST",
        body: formData,
        credentials: "include"
      }
    )
    const data = await res.json()
    if (data.success) {
        window.alert(data.message)
        navigate(`/seller/home`)
    } else {
        window.alert(data.message)
    }
  }
  return (
    <>
       <div>
            <h1>Add Product</h1>
            <Link to={"/seller/home"}>Back</Link>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Product name"
                    value={ newProduct?.pName}
                    onChange={(event) => addProduct({...newProduct,
                      pName: event.target.value})}
                />
                <input
                    type="text"
                    placeholder="Category Name"
                    value={ newProduct?.categoryName}
                    onChange={(event) => addProduct({...newProduct,
                      categoryName: event.target.value})}
                />
                <input
                    type="text"
                    placeholder="Category Type"
                    value={newProduct?.categoryType}
                    onChange={(event) => addProduct({...newProduct,
                    categoryType: event.target.value})}
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={ newProduct?.price}
                    onChange={(event) => addProduct({...newProduct,
                      price: event.target.value})}
                />

                <textarea
                    placeholder="Description"
                    value={ newProduct?.description}
                    onChange={(event) => addProduct({...newProduct,
                      description: event.target.value})}
                />

                <input
                    type="number"
                    placeholder="Stocks"
                    value={ newProduct?.stocks}
                   onChange={(event) => addProduct({...newProduct,
                      stocks: event.target.value})}
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