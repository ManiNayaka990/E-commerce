import React, {useContext} from 'react'
import { SellerContext } from '../../context/seller/sellerContext'
import { Link } from 'react-router-dom'

const ProductCards = () => {
  const { productData } = useContext(SellerContext)
  return (
    <>
      {
        productData?.data?.map(item => (
          <div key={item?._id}>
            <Link to={`/seller/product-details/${item._id}`}
                  state={{product: item}}
            >
              <img
                src={`http://localhost:5000${item?.photos?.[0]}`}
                alt={item?.pName} style={{width: "200px"}} 
              />
              <p>{item?.pName}</p>
              <p>Category Type {item?.category?.categoryType}</p>
              <p>Category Name { item?.category?.categoryName}</p>
              <p>Price { item?.price} </p>
              <p>Stocks { item?.stocks}</p>
            </Link>
            </div>
          
        ))
      }
      
    </>
)
}

export default ProductCards