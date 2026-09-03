import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Customer from '../routes/Customer'
import Seller from '../routes/Seller'
import Controller from '../routes/Controller'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Customer />} />
        <Route path='/seller/*' element={<Seller />} />
        <Route path='/controller/*' element={<Controller />} />
      </Routes>
    </BrowserRouter>
  )
}