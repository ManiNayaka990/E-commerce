import React, { useContext, useEffect } from 'react'
import { SellerContext } from '../../context/seller/sellerContext'
import { Link, useNavigate } from 'react-router-dom'

const Profile = () => {
  const {profileData} = useContext(SellerContext)

  const navigate = useNavigate()
      useEffect(() => {
        if (profileData && !profileData.success) {
            navigate("/seller/editProfile")
        }
    }, [profileData, navigate])

  async function logOut(){
      const res = await fetch("http://localhost:5000/api/seller/logout", {
      method: "POST", 
      credentials: "include"
    })
    const data  = await res.json()

    if(data.success){
      navigate("/seller/")
    }
    else{
        window.alert("You are not login yet")
    }
  }

  function editProfile(){
    navigate("/seller/editProfile")
  }

  if (!profileData) { return <p>Loading profile...</p> }  
  if(!profileData.success){
    navigate("/seller/editProfile")
  }
  async function deleteSeller(){
    const res = await fetch("http://localhost:5000/api/seller/delete-seller",{
      method: "DELETE",
      credentials: "include"
    })
    const data = await res.json()
    
    if(data.success)
    {
        window.alert("Seller deleted successfully")
        navigate("/seller/")
    }
    else{
        window.alert(data.message)
    }
  }
  return (
    <>
        <div>
          <div>M cart</div>
          <p>{profileData?.data?.username}</p>
          <Link to={"/seller/home"}>back</Link>
          <button onClick={logOut}>logout</button>
        </div>
        <button onClick={deleteSeller}>Delete Seller</button>
        <div>
          <button onClick={editProfile}>Edit Profile</button>

          <img src={`http://localhost:5000${profileData?.data?.profilePhoto}`} alt='Profile photo'></img>
          <p>Name {profileData.data.firstName + " " + profileData.data.lastName}</p>
          <p>Age {profileData.data.age}</p>
          <p>email {profileData.data.email}</p>
          <p>Total money earned {profileData.data.totalAmount}</p>
          <div>
            <p>Location 📌</p>
            <p>State: {profileData.data?.location?.state}
              District: {profileData.data?.location?.district}
              Pincode: {profileData.data?.location?.pincode}
              City: {profileData.data?.location?.city}
              Street: {profileData.data?.location?.street}
              Village: {profileData.data?.location?.village}
            </p>
          </div>
          <img src={`http://localhost:5000${profileData?.data?.qrCodeImg}`} alt='QR code image'></img>
        </div>
    </>
  )
}

export default Profile