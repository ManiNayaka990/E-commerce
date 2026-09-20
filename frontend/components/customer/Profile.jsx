import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, Route } from "react-router-dom" 
import EditProfile from "./EditProfile"
import { CustomerContext } from "../../context/customer/CustomerContext"
const Profile = () => {
  const navigate = useNavigate()
  const {loginStatus} = useContext(CustomerContext)
  const [profileData, setProfileData] = useState(null)
  useEffect(() =>{
      getData()
    }, [])
  
  async function getData(){
    const res = await fetch("http://localhost:5000/api/customer/profile-data",{
      credentials: "include"
    })
    const data = await res.json()
    if(!data.success)
      navigate("/edit-profile")
    setProfileData(data?.data)
  }
  async function deleteAccount(){
    const res = await fetch("http://localhost:5000/api/customer/delete-account",{
      method: "DELETE",
      credentials: "include"
    })
    const data = await res.json()
    if(data.success){
      window.alert("Account deleted successfully....")
      navigate("/login")
    }
    else{
      window.alert(data?.message)
    }
  }
  async function deleteAccount() {
    const res = await fetch("http://localhost:5000/api/customer/delete-account",{
      credentials: "include",
      method: 'DELETE'
    })
    const data = await res.json()
    if(data?.success){
      window.alert(data?.message)
      navigate("/login")
    }
    else{
      window.alert(data?.message)
    }
  }
  return (
    <>

      <Link to={"/"}>Back</Link><br></br>
      <Link to={"/edit-profile"}>Edit Profile</Link>
      <p>{profileData?.username}</p>
      <h3>Name : {profileData?.firstName} {profileData?.lastname}</h3>
      <p>Mobile Number : {profileData?.mobileNumber}</p>
      <p>Email: {profileData?.email}</p>
      <h3>Location details </h3>
      <p>State : {profileData?.location?.state}</p>
      <p>District : {profileData?.location?.district}</p>
      <p>City : {profileData?.location?.city}</p>
      <p>pincode: {profileData?.location?.pincode}</p>
      <p>Village/Street: {profileData?.location?.street}, {profileData?.location?.village}</p>
      <Link to={"/my-orders"}>My Orders</Link><br></br>
      <Link to={"/cart"}> Cart </Link><br></br>
      <Link to={"/wishList"}>Wish List</Link><br></br>
      <button onClick={deleteAccount}>Delete Account</button>
    </>
  )
}

export default Profile