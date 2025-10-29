import React from 'react'

const CGPAViewer = ({CGPA}) => {

    const CGPAColor = () => {
        if(CGPA >= 3.8){
            return "text-green-700"
        }else if(CGPA >= 3.6){
            return "text-green-600"
        }else if(CGPA >= 3.4){
            return "text-yellow-600"
        }else if(CGPA >= 3.2){
            return "text-yellow-500"
        }else if(CGPA >= 3.0){
            return "text-orange-500"
        }else if(CGPA >= 2){
            return "text-red-300" 
        }else if(CGPA =="-"){
            return "text-gray-400"
        }else{
            return "bg-red-100 rounded text-red-700"
        }
    }
  return (
    <div>
        <p className={`text-center px-1 ${CGPAColor()}`}> {CGPA}</p>
    </div>
  )
}

export default CGPAViewer