

import { SUBJECT_AND_CODES } from "../../assets/SUB_CODES";

const SubName = ({ subject }) => {
  // If no subject or it's a placeholder, return null
  if (!subject || subject === "-") return null;


  // Split the subject string into individual codes
  const subjectCodes = subject
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
    
  return (
    <div className="col-span-12 p-3 text-sm text-gray-300">
      <div className="font-medium text-rose-300 mb-1">Failed Subjects:</div>
      <div className="space-y-1">
        {subjectCodes.map((code, index) => {
          const subjectInfo = SUBJECT_AND_CODES[code.slice(0, 5)];
          return (
            <div key={index} className="flex items-start">
              <span className="text-rose-400/80 font-mono mr-2">{code}:</span>
              {subjectInfo ? (
                <span>
                  {subjectInfo[0]} <span className="text-gray-500 text-xs">({subjectInfo[1]})</span>
                </span>
              ) : (
                <span className="text-yellow-500">Subject not found</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubName;