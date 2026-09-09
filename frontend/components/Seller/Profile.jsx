import React, { useContext } from 'react'
import { SellerContext } from '../../context/seller/sellerContext'
const Profile = () => {

  const {profileData, productData} = useContext(SellerContext)
  console.log(profileData)
  return (
    <>
        Profile
    </>
  )
}

export default Profile