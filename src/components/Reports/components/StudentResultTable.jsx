// src/components/Reports/components/StudentResultTable.jsx
import React from 'react';
import CGPAViewer from './CGPAViewer';
import FailedSubsName from './FailedSubsName';
import SubName from '../../extractor/SubName';
import * as XLSX from 'xlsx';
import { FaFileExcel } from 'react-icons/fa';

const StudentResultTable = ({ data, hasFailed }) => {
  if (!data || data.length === 0) return null;
    const status = (student)=>{
        if( student.result?.Status === 'Drop'){
            return 'Drop';
        }else if(student.result?.Status === 'Failed'){
            return 'Failed';
        }else{
            return 'Passed';
        }
    }

  return (
    <>  

    <div className="overflow-x-auto">
        
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="my-2">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Roll
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name

            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dpt/Sem/Sh
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
             CGPA
            </th> 

          </tr>
        </thead>
        <tbody className=" divide-y divide-gray-200">
          {data.map((student) => (
            <tr key={student.roll} className="items-start">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium align-top">
                {student.roll}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm align-top">
                {student.name || 'N/A'}
                <span className='d-block py-5'>
                    {student.result?.status!="Passed" && <SubName subject={student.result?.["Failed Subs"]} />}
                </span>

              </td>
              
              <td className="px-6 py-4 whitespace-nowrap text-sm align-top">
                {student['dept/sem/shift'] || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap align-top">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  status(student) == "Drop"
                    ? 'bg-red-500 text-white' 
                    : status(student) == "Failed"
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}> 
                {status(student)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2 align-top">
              <p className="flex items-center gap-2">1st : <CGPAViewer CGPA={student.result?.GPA1} /></p>
               <p className="flex items-center gap-2">2nd : <CGPAViewer CGPA={student.result?.GPA2} /></p>
               <p className="flex items-center gap-2">3rd : <CGPAViewer CGPA={student.result?.GPA3} /></p>
               <p className="flex items-center gap-2">4th : <CGPAViewer CGPA={student.result?.GPA4} /></p>
               <p className="flex items-center gap-2">5th : <CGPAViewer CGPA={student.result?.GPA5} /></p>
               <p className="flex items-center gap-2">6th : <CGPAViewer CGPA={student.result?.GPA6} /></p>
              <p className="flex items-center gap-2">7th : <CGPAViewer CGPA={student.result?.GPA7} /></p>
              <p className="flex items-center gap-2">8th : <CGPAViewer CGPA={student.result?.GPA8} /></p>

              </td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default StudentResultTable;