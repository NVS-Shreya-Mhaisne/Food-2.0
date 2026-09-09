import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../Components/Context/StoreContext';
import axios from "axios";

const Verify = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const success = searchParams.get("success")
    const orderID = searchParams.get("orderId")
    const { url, token } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = async () => {
        const response = await axios.post(url + "/api/order/verify", { success, orderId: orderID });
        if (response.data.success) {
            navigate("/myorders");
        } else {
            navigate("/")
        }
    }

    useEffect(() => {
        if (token) verifyPayment();
    }, [token]);


    return (
        <div className='w-[85%] sm:w-[80%] mx-auto py-24 min-h-[60vh] flex items-center justify-center'>
            <div className="w-20 h-20 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
        </div>
    )
}

export default Verify

