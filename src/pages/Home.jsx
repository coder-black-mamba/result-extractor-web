import React from 'react'
import CheckResult from '../components/result_/CheckResult'
import { Link } from 'react-router'

const Home = () => {
  return (
    <div className='min-h-screen'>
        <CheckResult/>
        <div className="my-5">
            <Link className='bg-gray-900/50 p-2 rounded-xl border border-gray-800 hover:bg-gray-800' to="/extract">Result Extractor</Link>
            <Link className='bg-gray-900/50 p-2 rounded-xl border border-gray-800 hover:bg-gray-800' to="/report">Result Report</Link>
        </div>
    </div>
  )
}

export default Home