import { Link } from "react-router-dom";
import Cart from './Cart'
export default function Header(){
    return (
        <>
            <div>
                <h1>M Cart</h1>
                <Link to={"/cart"}>
                    <h2>Cart</h2>
                </Link>
            </div>
        </>
    )
}