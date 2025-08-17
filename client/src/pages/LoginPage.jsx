import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom';




const Loginpage = () => {

    const [currentState, setCurrentState] = useState("signup")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [bio, setBio] = useState("")
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();


    const onSubmitHandler = (event) => {
        event.preventDefault();


        if (currentState === 'signup' && !isDataSubmitted) {
            setIsDataSubmitted(true);
            return;
        }


        login(currentState === 'signup' ? 'signup' : 'login', { fullName, email, password, bio });
    };



    return (
        <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly
        backdrop-blur-2xl max-sm:flex-col'>

            {/* ----left------ */}

            <img src={assets.logo_big} alt="logo" className='W-[min(30vw, 250px)]' />


            {/* ------right------ */}

            <form onSubmit={onSubmitHandler} className='border-2 border-gray-500 text-white bg-white/8 p-6 flex flex-col gap-6 rounded-lg shadow-lg' >
                <h2 className='font-medium text-3xl flex justify-between items-center'>{currentState}

                    {isDataSubmitted && <img onClick={() => navigate('/login')} src={assets.arrow_icon} alt="icon" className='w-6  cursor-pointer' />}

                </h2>

                {currentState === "signup" && !isDataSubmitted && (

                    <input onChange={(e) => setFullName(e.target.value)} value={fullName} type="text" placeholder='FullName'
                        required className='p-2 border border-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-indigo-50' />
                )}

                {!isDataSubmitted && (
                    <>

                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" placeholder='Email'
                            required className='p-2 border border-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-indigo-50' />

                        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='password'
                            required className='p-2 border border-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-indigo-500' />


                    </>
                )}

                {currentState === "signup" && isDataSubmitted && (



                    <textarea onChange={(e) => { setBio(e.target.value) }} value={bio} rows={4}
                        className='p-2 border border-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-indigo-500'
                        placeholder='Provide short bio' required>

                    </textarea>
                )}

                <button type='submit' className='py-3 bg-gradient-to-r  to-violet-600 text-white rounded-md cursor-pointer'>
                    {currentState === "signup" ? "Create Acount" : "Login now"}
                </button>

                <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <input type="checkbox" />

                    <p>Agree to the terms of use and privacy policy.</p>

                </div>

                <div className='flex flex-col gap-2'>
                    {currentState === "signup" ? (
                        <p className='text-sm text-gray-500 '>Already have account? <span className='font-medium text-violet-500
                        cursor-pointer' onClick={() => { setCurrentState("login"); setIsDataSubmitted(false) }}>Login here</span></p>

                    ) : (<p className='text-sm text-gray-500 '>Create a account? <span className='font-medium text-violet-500
                    cursor-pointer'onClick={() => { setCurrentState("signup") }}>Click here</span></p>)}

                </div>



            </form>




        </div>
    )
}
export default Loginpage