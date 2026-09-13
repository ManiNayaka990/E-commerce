import { useState } from 'react'
import { Link, useNavigate} from "react-router-dom"


const Login = () => {
  const [seller, setSeller] = useState({
    username: "",
    password: ""
  })
  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  async function validateSeller(){
    const response = await fetch("http://localhost:5000/api/seller/login", {
      method: "POST",
      credentials: "include",
      headers: {
      "Content-Type": "application/json"
      },
      body: JSON.stringify(seller)
    })
    const data = await response.json()
    if(data.success === true)
      navigate("/seller/home")
    else
      setMessage(data.message)
  }  
  return (
    <>
      <div>
        <h1>
          Seller Login
        </h1>
        <p>{message}</p>
        <input type='text' name='username' placeholder='Enter your username' value={seller.username} onChange={(e) =>{
          setSeller({
            ...seller,
            username: e.target.value
          })}
        }></input>
        <input type='password' name = 'password' placeholder='Enter your password' value = {seller.password} onChange={(e) => {
          setSeller({
            ...seller,
            password: e.target.value
          })
        }}></input>
        <button onClick={validateSeller}>Submit</button>
        <p>If you don't have account <Link to={"/seller/register"}><span>Register</span></Link></p>
      </div>
    </>
  )
}

export default Login