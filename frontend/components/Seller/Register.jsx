import { useState } from 'react'
import { Link, useNavigate} from "react-router-dom"


const Register = () => {
  const [seller, setSeller] = useState({
    username: "",
    password: "", 
    email: ""
  })
  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  async function validateSeller(){
    const response = await fetch("http://localhost:5000/api/seller/register", {
      method: "Post",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify(seller)
    }) 
    const data = await response.json()
    if(data.success == true)
      navigate("/seller/")
    else
      setMessage(data.message)
  }  
  return (
    <>
      <div>
        <h1>Seller Register</h1>
        <p>{message}</p>
        <input type='email' placeholder='Enter Email' value={seller.email} onChange={(e) => {
          setSeller({
            ...seller,
            email: e.target.value
          })
        }}/>
        <input type='text' placeholder='Enter username' value={seller.username} onChange={(e) =>{
          setSeller({
            ...seller,
            username: e.target.value
          })}
        }></input>
        <input type='password' placeholder='Enter password' value = {seller.password} onChange={(e) => {
          setSeller({
            ...seller,
            password: e.target.value
          })
        }}></input>
        <button onClick={validateSeller}>Submit</button>
      </div>
    </>
  )
}

export default Register