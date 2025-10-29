import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'

const ReportAuth = ({data,setData,setIsAuthenticated}) => {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const response = await fetch('https://rpi-cs-all.it-is-the-black-mamba.workers.dev/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            })
            const result = await response.json()

            // console.log(result)
            if (result.error) {
                setError(result.error)
                setIsAuthenticated(false)
            } else {
                setData(result)
                setIsAuthenticated(true)
            }
        } catch (error) {
            setError('Something went wrong')
            setIsAuthenticated(false)
        } finally {
            setLoading(false)
            setPassword('')
        }
    }

    if (loading) {
        return (
            <div className='min-h-screen bg-gray-900 text-white container mx-auto'>
                <div className='max-w-md mx-auto p-6'>
                    <h1 className='text-2xl font-bold mb-6'>Loading...</h1>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='min-h-screen bg-gray-900 text-white container mx-auto'>
                <div className='max-w-md mx-auto p-6'>
                    <h1 className='text-2xl font-bold mb-6'>Error</h1>
                    <p className='text-red-500'>{error}</p>
                <button onClick={() => setError('')} className='block text-center px-3 py-2 mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded'>Try Again</button>
                </div>
            </div>
        )
    }

  return (
    <div className='min-h-screen bg-gray-900 text-white container mx-auto'>
        <div className='max-w-md mx-auto p-6'>
            <h1 className='text-2xl font-bold mb-6'>Enter Password</h1>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='w-full p-2 border border-gray-700 rounded mb-4' />
            <button onClick={handleSubmit} className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded'>Submit</button>
        </div>
    </div>
  )
}

export default ReportAuth