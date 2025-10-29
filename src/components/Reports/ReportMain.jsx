import React, { useState } from 'react'
import ReportAuth from './ReportAuth'
import ReportFilter from './ReportFilter'

const ReportMain = () => {
    const [studentData, setStudentData] = useState([])
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    console.log(isAuthenticated)
    
  return (
    <div>
        {!isAuthenticated && <ReportAuth  data={studentData} setData={setStudentData} setIsAuthenticated={setIsAuthenticated} />}
        {isAuthenticated && (
            <>
                <ReportFilter data={studentData} setData={setStudentData} />
            </>
        )}
    </div>
  )
}

export default ReportMain