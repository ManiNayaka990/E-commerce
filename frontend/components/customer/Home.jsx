import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CustomerContext } from '../../context/customer/CustomerContext'

function Home() {
  const {
    loginStatus,
    products,
    searchProduct,
    addToCart,
    addToWishList,
    getProductOnSearch
  } = useContext(CustomerContext)

  const navigate = useNavigate()

  const [category, setCategory] = useState("all")
  const [search, setSearchValue] = useState("")

  async function logOut() {
    const res = await fetch("http://localhost:5000/api/customer/logout", {
      method: "POST",
      credentials: "include"
    })

    const data = await res.json()

    if (data.success) {
      window.alert("Logout Successfully")
      navigate("/login")
    }
    else {
      window.alert(data.message)
    }
  }

  async function handleMenuChange(e) {
    const value = e.target.value

    if (value === "")
      return

    if (!loginStatus) {
      window.alert("Login required")
      navigate("/login")
      return
    }

    switch (value) {
      case "profile":
        navigate("/profile")
        break

      case "orders":
        navigate("/my-orders")
        break

      case "wishlist":
        navigate("/wishlist")
        break

      case "cart":
        navigate("/cart")
        break

      case "logout":
        logOut()
        break
    }
  }

  function setSearchData(e) {
    const value = e.target.value

    setSearchValue(value)

    if (value.trim() === "") {
      return
    }

    getProductOnSearch(category, value)
  }

  // Show search results when searching,
  // otherwise show all products
  const displayProducts =
    search.trim() === "" ? products : searchProduct

  return (
    <>
      <h1>Logo</h1>

      <Link to={"/cart"}>
        Cart
      </Link>

      <select
        defaultValue={"all"}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option disabled value="all">
          Filter By
        </option>

        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
        <option value="Home & Kitchen">Home & Kitchen</option>
        <option value="Beauty & Personal Care">
          Beauty & Personal Care
        </option>
        <option value="Sports & Fitness">Sports & Fitness</option>
        <option value="Books">Books</option>
        <option value="Toys & Games">Toys & Games</option>
        <option value="Grocery">Grocery</option>
        <option value="Automotive">Automotive</option>
        <option value="Computer & Accessories">
          Computer & Accessories
        </option>
      </select>

      <input
        placeholder="Search for products"
        value={search}
        onChange={setSearchData}
      />

      <p>notification</p>

      <Link to={"/profile"}>
        <div>Account</div>
      </Link>

      <select defaultValue="" onChange={handleMenuChange}>
        <option value="" disabled>
          Menu
        </option>

        <option value="profile">My Account</option>
        <option value="orders">My Orders</option>
        <option value="cart">Cart</option>
        <option value="wishlist">Wishlist</option>
        <option value="logout">Logout</option>
      </select>

      <br />

      {
        displayProducts.map((item) => (
          <div key={item._id} style={{display: "inline"}}>

            <Link
              to={`/productDetails/${item._id}`}
              state={{ product: item }}
            >
              <img
                src={`http://localhost:5000${item?.photos?.[0]}`}
                alt={item?.pName}
                style={{ width: "200px" }}
              />

              <p>{item?.pName}</p>

              <p>
                Category Type {item?.category?.categoryType}
              </p>

              <p>
                Category Name {item?.category?.categoryName}
              </p>

              <p>
                Price {item?.price}
              </p>

              <p>
                Stocks {item?.stocks}
              </p>
            </Link>

            <button
              onClick={() => addToWishList(item._id)}
              value={item._id}
            >
              Like
            </button>

            <button
              onClick={() => addToCart(item._id)}
              value={item._id}
            >
              Add To Cart
            </button>

            <br />
          </div>
        ))
      }
    </>
  )
}

export default Home