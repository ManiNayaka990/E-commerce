import React, {useState, useEffect, createContext} from "react"
const SellerContext = createContext()
const SellerProvider = ({ children }) => {
    const [productData, setData] = useState(null)
    const [profileData, setProfileData] = useState(null)
    const [product, setProduct] = useState(null)
    useEffect(() => {
        getProduct()
    }, [])
    async function getProduct() {
        const res = await fetch(
                "http://localhost:5000/api/seller/",
                {
                    credentials: "include"
                }
            )

            const result = await res.json()
            console.log(result)
            setData(result)
    }
    async function getSeller() {
            const res = await fetch(
                "http://localhost:5000/api/seller/edit-profile-req",
                {
                    credentials: "include"
                }
            )

            const data = await res.json()

            setProfileData(data)
        }
    useEffect(() => {
        getSeller()
    }, [])
    
    async function getProductDetails(id) {
        const res = await fetch(`http://localhost:5000/api/seller/productData/${id}`,
            {
                credentials: "include"
            }
        )
        const data = await res.json()
        setProduct(data)
    }
    
    return (
        <SellerContext.Provider value={{ productData, profileData, getSeller, getProduct,
            getProductDetails,
            setProduct, product
         }}>
            {children}
        </SellerContext.Provider>
    )
}

export {SellerProvider, SellerContext}