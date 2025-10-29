import React, { useState } from 'react'
import ReportResultViewer from './ReportResultViewer'

const ReportFilter = ({data}) => {
    const [filterdStudentData, setFilterdStudentData] = useState(data)
    // console.log(filterdStudentData)
  return (
    <div>
        <ReportResultViewer data={filterdStudentData} />
        {/* {filterdStudentData.map((student) => (
            <div key={student.roll}>
                <p>{student.name}</p>
                <p>{student['dept/sem/shift']}</p>
                <p>{student.roll}</p>
                <p>{student.reg}</p>
                <p>{student.session}</p>
                <p>{student.semester}</p>
            </div>
        ))} */}
    </div>
  )
}

export default ReportFilter