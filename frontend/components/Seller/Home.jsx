import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <>
      <div>
        <h1>Logo</h1>
        <div>notification</div>
        <Link to={"/seller/profile"}>
          <div>Profile</div>
        </Link>
        
      </div>
    </>
  )
}

export default Home