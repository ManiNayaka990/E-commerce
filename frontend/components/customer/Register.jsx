import { useState } from 'react'
import { Link, useNavigate} from "react-router-dom"


const Register = () => {
  const [user, setUser] = useState({
    username: "",
    password: "", 
    email: ""
  })
  const navigate = useNavigate()
  const [message, setMessage] = useState("")
  async function validateUser(){
    const response = await fetch("http://localhost:5000/api/customer/customer-register", {
      method: "Post",
      credentials: "include",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify(user)
    }) 
    const data = await response.json()
    if(data.success == true)
      navigate("/")
    else
      setMessage(data.message)
  }  
  return (
    <>
      <div>
        <h1>Seller Register</h1>
        <p>{message}</p>
        <input type='email' placeholder='Enter Email' value={user.email} onChange={(e) => {
          setUser({
            ...user,
            email: e.target.value
          })
        }}/>
        <input type='text' placeholder='Enter username' value={user.username} onChange={(e) =>{
          setUser({
            ...user,
            username: e.target.value
          })}
        }></input>
        <input type='password' placeholder='Enter password' value = {user.password} onChange={(e) => {
          setUser({
            ...user,
            password: e.target.value
          })
        }}></input>
        <button onClick={validateUser}>Submit</button>
      </div>
    </>
  )
}

export default Register
