import React from 'react'
import NavBar from '../components/layouts/NavBar'
import Footer from '../components/layouts/Footer'
import { Outlet } from 'react-router'

const BaseLayout = () => {
  return (
    <div className='bg-gray-900'>
        <NavBar />
        <Outlet className='py-5'/>
        <Footer />
    </div>
  )
}

export default BaseLayout