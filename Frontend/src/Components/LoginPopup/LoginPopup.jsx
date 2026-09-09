import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { StoreContext } from '../Context/StoreContext'

const LoginPopup = ({ setshowLogin }) => {

    const { url, setToken } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Login")
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/user/login"
        } else {
            newUrl += "/api/user/register"
        }

        const response = await axios.post(newUrl, data);
        if (response.data.success) {
            setToken(response.data.token);
            localStorage.setItem("token", response.data.token);
            setshowLogin(false)
        }
        else {
            alert(response.data.message);
        }
    }

    return (
        <div className='fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'>
            <form onSubmit={onLogin} className='bg-white dark:bg-[#2b1f1d] w-full max-w-sm rounded-3xl shadow-2xl p-7 flex flex-col gap-5 text-sm animate-fadeIn border border-gray-150 dark:border-[#3a2b27]'>
                <div className='flex justify-between items-center text-text-dark dark:text-[#f4f1ea]'>
                    <h2 className="font-serif text-2xl font-bold">{currState}</h2>
                    <img className="w-4 h-4 cursor-pointer hover:opacity-70 transition-opacity" onClick={() => setshowLogin(false)} src={assets.cross_icon} alt="Close" />
                </div>
                <div className="flex flex-col gap-3.5">
                    {currState === "Login" ? null :
                        <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required className="w-full border border-gray-200 dark:border-[#4a3833] bg-white dark:bg-[#352723] focus:border-primary outline-none px-4 py-2.5 rounded-lg text-sm transition-colors text-text-dark dark:text-[#e5e0d8] dark:placeholder-[#777]" />}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required className="w-full border border-gray-200 dark:border-[#4a3833] bg-white dark:bg-[#352723] focus:border-primary outline-none px-4 py-2.5 rounded-lg text-sm transition-colors text-text-dark dark:text-[#e5e0d8] dark:placeholder-[#777]" />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required className="w-full border border-gray-200 dark:border-[#4a3833] bg-white dark:bg-[#352723] focus:border-primary outline-none px-4 py-2.5 rounded-lg text-sm transition-colors text-text-dark dark:text-[#e5e0d8] dark:placeholder-[#777]" />
                </div>
                <button type='submit' className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-sm cursor-pointer mt-1">
                    {currState === "Sign Up" ? "Create account" : "Login"}
                </button>
                <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-[#a09a8e]">
                    <input type="checkbox" required className="mt-0.5 accent-primary" />
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>
                {currState === "Login" ?
                    <p className="text-xs text-gray-600 dark:text-[#a09a8e] text-center">Create a new Account? <span className="text-primary font-semibold cursor-pointer hover:underline" onClick={() => setCurrState("Sign Up")}>Click here</span></p> :
                    <p className="text-xs text-gray-600 dark:text-[#a09a8e] text-center">Already have an account? <span className="text-primary font-semibold cursor-pointer hover:underline" onClick={() => setCurrState("Login")}>Login here</span></p>}
            </form>
        </div>
    )
}

export default LoginPopup

