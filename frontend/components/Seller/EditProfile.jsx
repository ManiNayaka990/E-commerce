import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SellerContext } from '../../context/seller/sellerContext'

const EditProfile = () => {
  const navigate = useNavigate()
  const { profileData, getSeller } = useContext(SellerContext)

  const [seller, setSeller] = useState({
    firstName: profileData?.data?.firstName || "",
    lastName: profileData?.data?.lastName || "",
    mobileNumber: profileData?.data?.mobileNumber || "",
    age: profileData?.data?.age || "",
    state: profileData?.data?.location?.state || "",
    pincode: profileData?.data?.location?.pincode || "",
    district: profileData?.data?.location?.district || "",
    city: profileData?.data?.location?.city || "",
    street: profileData?.data?.location?.street || "",
    village: profileData?.data?.location?.village || ""
  })

  const [profilePhoto, setProfilePhoto] = useState(null)
  const [qrCodeImg, setQrCodeImg] = useState(null)

  function handleChange(e) {
    const { name, value } = e.target

    setSeller({
      ...seller,
      [name]: value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData()

    formData.append("firstName", seller.firstName)
    formData.append("lastName", seller.lastName)
    formData.append("mobileNumber", seller.mobileNumber)
    formData.append("age", seller.age)
    formData.append("state", seller.state)
    formData.append("pincode", seller.pincode)
    formData.append("district", seller.district)
    formData.append("city", seller.city)
    formData.append("street", seller.street)
    formData.append("village", seller.village)

    if (profilePhoto) {
      formData.append("profile-photo", profilePhoto)
    }

    if (qrCodeImg) {
      formData.append("qrcode-photo", qrCodeImg)
    }

    const res = await fetch(
      "http://localhost:5000/api/seller/edit-profile",
      {
        method: "PUT",
        credentials: "include",
        body: formData
      }
    )

    const data = await res.json()
    if(data.success){
      await getSeller()
      navigate('/seller/profile')}
    else
      window.alert(data.message)
    console.log(data)
  }

  return (
    <>
      <form onSubmit={handleSubmit}>

        <div>

          <label>
            First Name:
          </label>

          <input
            type="text"
            name="firstName"
            value={seller.firstName}
            onChange={handleChange}
          />

          <br />

          <label>
            Last Name:
          </label>

          <input
            type="text"
            name="lastName"
            value={seller.lastName}
            onChange={handleChange}
          />

          <br />

          <label>
            Mobile Number:
          </label>

          <input
            type="text"
            name="mobileNumber"
            value={seller.mobileNumber}
            onChange={handleChange}
          />

          <br />

          <label>
            Age:
          </label>

          <input
            type="number"
            name="age"
            value={seller.age}
            onChange={handleChange}
          />
          <label>
            State:
          </label>

          <input
            type="text"
            name="state"
            value={seller.state}
            onChange={handleChange}
          />
          <label>
            Pincode:
          </label>

          <input
            type="text"
            name="pincode"
            value={seller.pincode}
            onChange={handleChange}
          />
          <label>
            District:
          </label>

          <input
            type="text"
            name="district"
            value={seller.district}
            onChange={handleChange}
          />
          <label>
            city:
          </label>

          <input
            type="text"
            name="city"
            value={seller.city}
            onChange={handleChange}
          />
          <label>
            Street:
          </label>

          <input
            type="text"
            name="street"
            value={seller.street}
            onChange={handleChange}
          />
          <label>
            Village:
          </label>

          <input
            type="text"
            name="village"
            value={seller.village}
            onChange={handleChange}
          />

          <br />

          <label>
            Profile Photo:
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setProfilePhoto(e.target.files[0])
            }}
          />
          <img src={`http://localhost:5000${profileData?.data?.profilePhoto}`}></img>

          <br />

          <label>
            QR Code Photo:
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setQrCodeImg(e.target.files[0])
            }}
          />
          <img src={`http://localhost:5000${profileData?.data?.qrCodeImg}`}></img>

          <br />

          <button type="submit">
            Update Profile
          </button>

        </div>

      </form>
    </>
  )
}

export default EditProfile