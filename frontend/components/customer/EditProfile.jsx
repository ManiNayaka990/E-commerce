
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CustomerContext } from '../../context/customer/CustomerContext'

const EditProfile = () => {
  const navigate = useNavigate()
  const { loginStatus } = useContext(CustomerContext)

  const [profileData, setProfileData] = useState({})
  
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    age: "",
    state: "",
    pincode: "",
    district: "",
    city: "",
    street: "",
    village: ""
  })

useEffect(() => {
  if (!loginStatus) {
    navigate('/login')
    return
  }

  async function getData() {
    try {
      const res = await fetch(
        "http://localhost:5000/api/customer/profile-data",
        {
          method: "GET",
          credentials: "include"
        }
      )

      const data = await res.json()

      if (data.success) {
        setProfileData(data.data)
      } else {
        window.alert(data.message)
      }
    } catch (error) {
      console.error("Error getting profile:", error)
    }
  }

  getData()
}, [loginStatus, navigate])

  useEffect(() => {
    if (profileData && Object.keys(profileData).length > 0) {
      setUser({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        mobileNumber: profileData.mobileNumber || "",
        age: profileData.age || "",
        state: profileData.location?.state || "",
        pincode: profileData.location?.pincode || "",
        district: profileData.location?.district || "",
        city: profileData.location?.city || "",
        street: profileData.location?.street || "",
        village: profileData.location?.village || ""
      })
    }
  }, [profileData])

  function handleChange(e) {
    const { name, value } = e.target

    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData()
    
    formData.append("firstName", user.firstName)
    formData.append("lastName", user.lastName)
    formData.append("mobileNumber", user.mobileNumber)
    formData.append("age", user.age)
    formData.append("state", user.state)
    formData.append("pincode", user.pincode)
    formData.append("district", user.district)
    formData.append("city", user.city)
    formData.append("street", user.street)
    formData.append("village", user.village)
    console.log(formData.get("firstName"))
    console.log(Object.fromEntries(formData))
    try {
      const res = await fetch(
        "http://localhost:5000/api/customer/edit-profile",
        {
          method: "POST",
          credentials: "include",
          body: formData
        }
      )

      const data = await res.json()

      if (data.success) {
        navigate('/profile')
      } else {
        window.alert(data.message)
      }

    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <button><Link to={"/profile"}>Back</Link></button>
        <p>Edit data only which you want</p>

        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
        />

        <br />

        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
        />

        <br />

        <label>Mobile Number:</label>
        <input
          type="text"
          name="mobileNumber"
          value={user.mobileNumber}
          onChange={handleChange}
        />

        <br />

        <label>Age:</label>
        <input
          type="number"
          name="age"
          value={user.age}
          onChange={handleChange}
        />

        <br />

        <label>State:</label>
        <input
          type="text"
          name="state"
          value={user.state}
          onChange={handleChange}
        />

        <br />

        <label>Pincode:</label>
        <input
          type="text"
          name="pincode"
          value={user.pincode}
          onChange={handleChange}
        />

        <br />

        <label>District:</label>
        <input
          type="text"
          name="district"
          value={user.district}
          onChange={handleChange}
        />

        <br />

        <label>City:</label>
        <input
          type="text"
          name="city"
          value={user.city}
          onChange={handleChange}
        />

        <br />

        <label>Street:</label>
        <input
          type="text"
          name="street"
          value={user.street}
          onChange={handleChange}
        />

        <br />

        <label>Village:</label>
        <input
          type="text"
          name="village"
          value={user.village}
          onChange={handleChange}
        />

        <br />

        <button type="submit">
          Update Profile
        </button>

      </div>
    </form>
  )
}

export default EditProfile

