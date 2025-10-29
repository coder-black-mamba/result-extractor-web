import React from 'react'
import NavBar from '../components/layouts/NavBar'
import Footer from '../components/layouts/Footer'
import { Outlet } from 'react-router'
// import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/react"
const BaseLayout = () => {
  // Speed Analytics Added
  return (
    <div className='bg-gray-900'>
        <NavBar />
        <Outlet className='py-5'/>
        <Footer />
        {/* <Analytics /> */}
        <SpeedInsights />
    </div>
  )
}

export default BaseLayout