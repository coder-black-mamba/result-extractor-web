import React, { useState, useEffect } from 'react';

const StudentName = ({ roll }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const password = "SaYeDCSSTL@386";

  useEffect(() => {
    const fetchStudentName = async () => {
      if (!roll) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`https://rpi-cs-basic-student-list.it-is-the-black-mamba.workers.dev/`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ roll, password }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch student name');
        }
        
        const data = await response.json();
        setName(data.name || 'vaya name nai');
      } catch (err) {
        setError(err.message);
        console.error('Error fetching student name:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentName();
  }, [roll]);

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {"somossa ache tor vai"}</div>;
  }

  return <div className="font-medium">{name || 'vaya name nai'} vai , shonen</div>;
};

export default StudentName;