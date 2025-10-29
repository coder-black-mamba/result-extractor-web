import React from 'react'
import NavBar from '../components/layouts/NavBar'
import Footer from '../components/layouts/Footer'
import { Outlet } from 'react-router'
import { Analytics } from '@vercel/analytics/next';

const BaseLayout = () => {
  return (
    <div className='bg-gray-900'>
        <NavBar />
        <Outlet className='py-5'/>
        <Footer />
        <Analytics />
    </div>
  )
}

export default BaseLayout