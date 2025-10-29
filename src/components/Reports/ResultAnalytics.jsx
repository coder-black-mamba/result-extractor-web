import React, { useMemo } from 'react';

const ResultAnalytics = ({ data }) => {
    const stats = useMemo(() => {
        if (!data || data.length === 0) return null;

        // Count students by department
        const deptCounts = data.reduce((acc, student) => {
            const dept = student['dept/sem/shift']?.split('/')[0] || 'Unknown';
            acc[dept] = (acc[dept] || 0) + 1;
            return acc;
        }, {});

        // Count students by status
        const resultStats = data.reduce((acc, student) => {
            if (!student.result) {
                acc.dropped++;
            } else if (student.result.Status === 'Passed') {
                acc.passed++;
            } else if (student.result.Status === 'Failed') {
                acc.failed++;
            } else {
                acc.dropped++;
            }
            return acc;
        }, { passed: 0, failed: 0, dropped: 0 });

        // Count by semester
        const semesterCounts = data.reduce((acc, student) => {
            const sem = student['dept/sem/shift']?.split('/')[1] || 'Unknown';
            acc[sem] = (acc[sem] || 0) + 1;
            return acc;
        }, {});

        // Calculate percentages
        const total = data.length;
        const passedPercentage = total > 0 ? (resultStats.passed / total) * 100 : 0;
        const failedPercentage = total > 0 ? (resultStats.failed / total) * 100 : 0;
        const droppedPercentage = 100 - passedPercentage - failedPercentage;

        return {
            totalStudents: total,
            deptCounts,
            resultStats,
            semesterCounts,
            passedPercentage,
            failedPercentage,
            droppedPercentage
        };
    }, [data]);

    if (!stats) return null;

    return (
        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg shadow-lg mb-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-white">Result Analytics</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-sm font-medium text-blue-400">Total Students</h3>
                    <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-sm font-medium text-green-400">Passed</h3>
                    <p className="text-2xl font-bold text-white">
                        {stats.resultStats.passed} 
                        <span className="text-sm font-normal text-gray-400 ml-2">
                            ({Math.round(stats.passedPercentage)}%)
                        </span>
                    </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-sm font-medium text-red-400">Failed</h3>
                    <p className="text-2xl font-bold text-white">
                        {stats.resultStats.failed}
                        <span className="text-sm font-normal text-gray-400 ml-2">
                            ({Math.round(stats.failedPercentage)}%)
                        </span>
                    </p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <h3 className="text-sm font-medium text-yellow-400">Dropped</h3>
                    <p className="text-2xl font-bold text-white">
                        {stats.resultStats.dropped}
                        <span className="text-sm font-normal text-gray-400 ml-2">
                            ({Math.round(stats.droppedPercentage)}%)
                        </span>
                    </p>
                </div>
            </div>

            {/* Department Distribution */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-white">Department Distribution</h3>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    {Object.entries(stats.deptCounts).map(([dept, count]) => (
                        <div key={dept} className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-300">{dept || 'Unknown'}</span>
                                <span className="text-gray-400">{count} students</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${(count / stats.totalStudents) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Result Overview and Semester Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Semester Distribution */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Semester Distribution</h3>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        {Object.entries(stats.semesterCounts).map(([sem, count]) => (
                            <div key={sem} className="mb-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-gray-300">Semester {sem || 'N/A'}</span>
                                    <span className="text-gray-400">{count} students</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                                    <div 
                                        className="bg-green-500 h-2.5 rounded-full" 
                                        style={{ width: `${(count / stats.totalStudents) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Result Overview Donut Chart */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-white">Result Overview</h3>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 h-full flex flex-col justify-center">
                        <div className="flex justify-center">
                            <div className="relative w-48 h-48">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    {/* Background circle */}
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#374151" strokeWidth="15" />
                                    
                                    {/* Calculate circumferences and offsets for donut segments */}
                                    {(() => {
                                        const radius = 40;
                                        const circumference = 2 * Math.PI * radius;
                                        
                                        // Calculate segment lengths
                                        const passedLength = (stats.passedPercentage / 100) * circumference;
                                        const failedLength = (stats.failedPercentage / 100) * circumference;
                                        const droppedLength = (stats.droppedPercentage / 100) * circumference;
                                        
                                        return (
                                            <>
                                                {/* Passed segment (green) - starts at top */}
                                                {stats.passedPercentage > 0 && (
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r={radius}
                                                        fill="none"
                                                        stroke="#10b981"
                                                        strokeWidth="15"
                                                        strokeDasharray={`${passedLength} ${circumference - passedLength}`}
                                                        strokeDashoffset={circumference / 4}
                                                        transform="rotate(-90 50 50)"
                                                    />
                                                )}
                                                
                                                {/* Failed segment (red) - continues after passed */}
                                                {stats.failedPercentage > 0 && (
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r={radius}
                                                        fill="none"
                                                        stroke="#ef4444"
                                                        strokeWidth="15"
                                                        strokeDasharray={`${failedLength} ${circumference - failedLength}`}
                                                        strokeDashoffset={circumference / 4 - passedLength}
                                                        transform="rotate(-90 50 50)"
                                                    />
                                                )}
                                                
                                                {/* Dropped segment (yellow) - continues after failed */}
                                                {stats.droppedPercentage > 0 && (
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r={radius}
                                                        fill="none"
                                                        stroke="#f59e0b"
                                                        strokeWidth="15"
                                                        strokeDasharray={`${droppedLength} ${circumference - droppedLength}`}
                                                        strokeDashoffset={circumference / 4 - passedLength - failedLength}
                                                        transform="rotate(-90 50 50)"
                                                    />
                                                )}
                                            </>
                                        );
                                    })()}
                                    
                                    {/* Center text */}
                                    <text
                                        x="50"
                                        y="50"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        className="text-xl font-bold"
                                        fill="#ffffff"
                                    >
                                        {Math.round(stats.passedPercentage)}%
                                    </text>
                                </svg>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-wrap justify-center gap-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-xs text-gray-300">Passed ({stats.resultStats.passed})</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                <span className="text-xs text-gray-300">Failed ({stats.resultStats.failed})</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                <span className="text-xs text-gray-300">Dropped ({stats.resultStats.dropped})</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultAnalytics;