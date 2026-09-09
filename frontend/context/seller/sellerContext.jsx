import React, { useEffect, useState } from 'react'
import { createContext } from 'react'

const SellerContext = createContext();
const SellerProvider = ({children}) => {
   const [productData, setData ] = useState(null)
   const [profileData, setProfileData] = useState(null)
   
   useEffect(() => {
        async function getProduct(){
            const res = await fetch("http://localhost:5000/api/seller/",
                {
                    credentials: "include"
                }
            )
            const result = await res.json()

            setData(result)
        }
        getProduct()
   }, [])

   useEffect(() => {
        async function getSeller(){
            const res = await fetch("http://localhost:5000/api/seller/edit-profile-req",
                {
                    credentials: "include"
                }
            )
            const data = await res.json()
            setProfileData(data)
        }
        getSeller()
   }, [])
   return (    
    <>
        <SellerContext.Provider value={{productData, profileData}}>{children}</SellerContext.Provider>
    </>
    )
}


export { SellerContext, SellerProvider }