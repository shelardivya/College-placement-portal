import React, { useState, useEffect } from 'react';
import { getAdminStudentAnalyticsDashboard, getTopSkillsAnalytics, getPlacementCgpaAnalytics, getDepartmentAnalytics, getAllTopPlacedStudents, addTopPlacedStudent } from '../../auth/authService';
import {
    Users,
    TrendingUp,
    Trophy,
    Wallet,
    Coffee,
    Search,
    Plus,
    X,
    ChevronDown,
    Check
} from 'lucide-react';
import './StudentAnalytics.css';
import bannerIcons from '../../assets/banner_icons.png';

// Inline SVGs for company logos
const COMPANY_LOGOS = {
    Amazon: (
        <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: '8px', overflow: 'visible', flexShrink: 0 }}>
            <path d="M13.2 13.1c0 1.2-.7 1.8-1.7 1.8-.7 0-1.2-.4-1.2-1.1 0-1.1.9-1.5 2.9-1.5v.8zm2.6 2.3c-.1-.6-.1-1.8-.1-2.5V9.7c0-1.8-1.1-2.7-3.1-2.7-1.7 0-3.1.9-3.4 2l1.1.4c.2-.7.9-1.2 1.9-1.2 1.1 0 1.5.5 1.5 1.4v.6c-2.4.1-4.2.7-4.2 2.7 0 1.3 8 2.2 2.1 2.2 1.2 0 2-.6 2.4-1.3h.1c.1.5.3.9.7 1.2l1-.6z" fill="#000000" />
            <path d="M5.3 19.3c3.4 2 8 2.5 12 1.6.8-.2 1.5-.5 2.2-1 .3-.2.3-.7-.1-.8-.7-.2-1.5-.1-2.2.1-3.2.7-6.9.4-10-1.2-.4-.2-.7 0-.7.3v1z" fill="#ff9900" />
        </svg>
    ),
    Microsoft: (
        <svg viewBox="0 0 23 23" width="16" height="16" style={{ marginRight: '8px', flexShrink: 0 }}>
            <rect x="0" y="0" width="10.5" height="10.5" fill="#f25022" />
            <rect x="11.5" y="0" width="10.5" height="10.5" fill="#7fba00" />
            <rect x="0" y="11.5" width="10.5" height="10.5" fill="#00a4ef" />
            <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#ffb900" />
        </svg>
    ),
    Apple: (
        <svg viewBox="0 0 170 170" width="16" height="16" fill="#000000" style={{ marginRight: '8px', flexShrink: 0 }}>
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.9-14.36-6.07-2.73-2.22-6.49-6.67-11.28-13.37-5.61-7.8-10.28-16.73-13.98-26.8-3.7-10.07-5.56-19.82-5.56-29.24 0-14.6 3.63-26.6 10.89-35.97 7.26-9.37 16.57-14.06 27.93-14.06 4.96 0 10.59 1.45 16.89 4.36 6.3 2.9 10.84 4.36 13.62 4.36 2.03 0 6.38-1.39 13.06-4.16 6.68-2.78 12.21-4.04 16.58-3.78 15.34.88 26.9 6.64 34.66 17.27-12.28 7.5-18.29 17.72-18.02 30.65.3 10.15 4.14 18.57 11.53 25.26 7.39 6.69 16.14 10.35 26.27 10.99-2.3 6.64-5.34 13.06-9.13 19.26zm-20.28-94.88c0-9.92 3.5-18.51 10.5-25.76 7-7.25 15.31-11.02 24.93-11.3 0.28 9.92-3.3 18.56-10.74 25.92-7.44 7.36-15.72 11.08-24.69 11.14z" />
        </svg>
    ),
};

// calculates the SVG arc path for each segment of the donut chart
function getDonutSegments(data, cx = 50, cy = 50, r = 38, innerR = 24) {
    let cumulativePercent = 0;
    const gap = 1.5; // gap in degrees between segments

    return data.map((item) => {
        const startPercent = cumulativePercent;
        cumulativePercent += item.percentage;

        const startAngle = (startPercent / 100) * 360 - 90 + gap / 2;
        const endAngle = (cumulativePercent / 100) * 360 - 90 - gap / 2;

        const toRad = (deg) => (deg * Math.PI) / 180;

        const x1 = cx + r * Math.cos(toRad(startAngle));
        const y1 = cy + r * Math.sin(toRad(startAngle));
        const x2 = cx + r * Math.cos(toRad(endAngle));
        const y2 = cy + r * Math.sin(toRad(endAngle));
        const ix1 = cx + innerR * Math.cos(toRad(startAngle));
        const iy1 = cy + innerR * Math.sin(toRad(startAngle));
        const ix2 = cx + innerR * Math.cos(toRad(endAngle));
        const iy2 = cy + innerR * Math.sin(toRad(endAngle));

        const largeArc = item.percentage > 50 ? 1 : 0;

        const d = [
            `M ${x1} ${y1}`,
            `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
            `L ${ix2} ${iy2}`,
            `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1}`,
            'Z',
        ].join(' ');

        return { ...item, d };
    });
}

// main component
export default function StudentAnalytics() {
    const [analyticsStats, setAnalyticsStats] = useState({
        placedStudents: 0,
        placementRate: 0,
        highestPackage: 0,
        averagePackage: 0
    });

    const [departmentData, setDepartmentData] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [cgpaData, setCgpaData] = useState([]);
    const [maxStudents, setMaxStudents] = useState(40);
    const [skillsData, setSkillsData] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getAdminStudentAnalyticsDashboard();
                if (response.data) {
                    setAnalyticsStats(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch admin student analytics:", error);
            }
        };

        const fetchDepartmentData = async () => {
            try {
                const res = await getDepartmentAnalytics();
                if (res.data) {
                    setTotalStudents(res.data.totalStudents || 0);
                    const colors = ['#1e3a6e', '#6c8dd6', '#06b6d4', '#a5b4fc', '#e2e8f0', '#f59e0b', '#10b981'];
                    if (res.data.departments && Array.isArray(res.data.departments)) {
                        const mapped = res.data.departments.map((d, index) => ({
                            label: d.department,
                            count: d.count,
                            percentage: res.data.totalStudents ? (d.count / res.data.totalStudents) * 100 : 0,
                            color: colors[index % colors.length]
                        }));
                        setDepartmentData(mapped);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch department analytics", e);
            }
        };

        const fetchCgpaData = async () => {
            try {
                const res = await getPlacementCgpaAnalytics();
                if (res.data && Array.isArray(res.data)) {
                    const mapped = res.data.map(c => ({
                        range: c.range,
                        students: c.count
                    }));
                    setCgpaData(mapped);
                    const maxCount = Math.max(...mapped.map(d => d.students), 0);
                    setMaxStudents(Math.ceil((maxCount + 10) / 10) * 10); // round up to nearest 10
                }
            } catch (e) {
                console.error("Failed to fetch CGPA analytics", e);
            }
        };

        const fetchSkillsData = async () => {
            try {
                const res = await getTopSkillsAnalytics();
                if (res.data && Array.isArray(res.data)) {
                    const colors = ['#1e3a6e', '#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e'];
                    
                    // Assuming 'count' is the percentage or we can just use count as a rough percentage for the UI bar width
                    const mapped = res.data.map((s, index) => ({
                        skill: s.skill,
                        percentage: s.count,
                        color: colors[index % colors.length]
                    }));
                    setSkillsData(mapped);
                }
            } catch (e) {
                console.error("Failed to fetch skills analytics", e);
            }
        };

        fetchStats();
        fetchDepartmentData();
        fetchCgpaData();
        fetchSkillsData();

        const fetchTopStudents = async () => {
            try {
                const response = await getAllTopPlacedStudents();
                if (response.data && Array.isArray(response.data)) {
                    const mapped = response.data.map((s, index) => {
                        const nameParts = (s.studentName || '').trim().split(' ');
                        let initials = 'ST';
                        if (nameParts.length >= 2) {
                            initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
                        } else if (nameParts[0]) {
                            initials = nameParts[0].substring(0, 2).toUpperCase();
                        }
                        return {
                            id: s.id,
                            rank: index + 1,
                            name: s.studentName,
                            initials: initials,
                            branch: 'CS', // Hardcoded fallback if not in API
                            passingYear: '2026', // Hardcoded fallback if not in API
                            cgpa: s.cgpa || '9.0',
                            lpa: s.packageLpa || '12',
                            skill: s.skills || 'Full Stack',
                            skillColor: '#f3e8ff',
                            skillTextColor: '#a855f7',
                            company: s.companyName,
                            companyColor: '#c2410c'
                        };
                    });
                    setStudentsList(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch top placed students", error);
            }
        };
        fetchTopStudents();
    }, []);

    const segments = getDonutSegments(departmentData);

    const [studentsList, setStudentsList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const [formData, setFormData] = useState({
        name: '',
        branch: 'CS',
        passingYear: '2026',
        cgpa: '',
        lpa: '',
        skill: '',
        company: ''
    });

    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.cgpa || !formData.lpa || !formData.company) return;

        try {
            const payload = {
                studentName: formData.name,
                companyName: formData.company,
                packageLpa: parseFloat(formData.lpa) || 12,
                cgpa: parseFloat(formData.cgpa) || 9.0,
                skills: formData.skill || 'Full Stack'
            };

            const response = await addTopPlacedStudent(payload);
            const savedStudent = response.data || payload;

            const nameParts = (savedStudent.studentName || '').trim().split(' ');
            let initials = 'ST';
            if (nameParts.length >= 2) {
                initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
            } else if (nameParts[0]) {
                initials = nameParts[0].substring(0, 2).toUpperCase();
            }

            const newStudent = {
                id: savedStudent.id || Date.now(),
                rank: studentsList.length + 1,
                name: savedStudent.studentName,
                initials: initials,
                branch: formData.branch || 'CS',
                passingYear: formData.passingYear || '2026',
                cgpa: savedStudent.cgpa,
                lpa: savedStudent.packageLpa,
                skill: savedStudent.skills || 'Full Stack',
                skillColor: '#f3e8ff',
                skillTextColor: '#a855f7',
                company: savedStudent.companyName,
                companyColor: '#2563eb'
            };

            setStudentsList([newStudent, ...studentsList.map((s, idx) => ({ ...s, rank: idx + 2 }))]);
            setIsModalOpen(false);
            setFormData({
                name: '',
                branch: 'CS',
                passingYear: '2026',
                cgpa: '',
                lpa: '',
                skill: '',
                company: ''
            });
            setToastMessage('Student added successfully!');
            setToastType('success');
        } catch (error) {
            console.error("Failed to add top placed student", error);
            setToastMessage('Failed to add student. Please try again.');
            setToastType('error');
        }
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 4000);
    };

    const filteredStudents = studentsList.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (student.branch && student.branch.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (student.passingYear && student.passingYear.toString().includes(searchQuery))
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Reset to page 1 whenever search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="analytics-page-wrapper">

            {/* analytics banner */}
            <div className="analytics-banner">
                <div className="analytics-banner-text">
                    <span className="banner-badge">System Insights</span>
                    <h1 className="analytics-page-title">Student Analytics</h1>
                    <p className="analytics-page-subtitle">Track placements, CGPA distribution and skill trends</p>
                </div>
                <div className="analytics-banner-icons">
                    <img
                        src={bannerIcons}
                        alt="briefcase magnifying glass document"
                        className="banner-illustration"
                    />
                </div>
            </div>

            {/* stat cards section */}
            <section className="stats-grid">
                <div className="stat-card theme-blue">
                    <div className="stat-text-group">
                        <span className="stat-label">Placed Students</span>
                        <h3 className="stat-value">{analyticsStats.placedStudents}</h3>
                        <span className="stat-subtext">Total placed this year</span>
                    </div>
                    <div className="stat-icon-container bg-light-blue">
                        <Users size={22} />
                    </div>
                </div>

                <div className="stat-card theme-green">
                    <div className="stat-text-group">
                        <span className="stat-label">Placement Rate</span>
                        <h3 className="stat-value">{analyticsStats.placementRate}%</h3>
                        <span className="stat-subtext">% of eligible students placed</span>
                    </div>
                    <div className="stat-icon-container bg-light-green">
                        <TrendingUp size={22} />
                    </div>
                </div>

                <div className="stat-card theme-orange">
                    <div className="stat-text-group">
                        <span className="stat-label">Highest Package</span>
                        <h3 className="stat-value">{analyticsStats.highestPackage.toLocaleString()}</h3>
                        <span className="stat-subtext">Top package offered</span>
                    </div>
                    <div className="stat-icon-container bg-light-orange">
                        <Trophy size={22} />
                    </div>
                </div>

                <div className="stat-card theme-purple">
                    <div className="stat-text-group">
                        <span className="stat-label">Average Package</span>
                        <h3 className="stat-value">{analyticsStats.averagePackage.toLocaleString()}</h3>
                        <span className="stat-subtext">Average package offered</span>
                    </div>
                    <div className="stat-icon-container bg-light-purple">
                        <Wallet size={22} />
                    </div>
                </div>
            </section>

            {/* department wise distribution section */}
            <section className="charts-row">
                <div className="chart-card">
                    <div className="chart-card-header">
                        <h3 className="chart-title">Department Wise Distribution</h3>
                    </div>

                    <div className="dept-chart-body">

                        {/* SVG Donut Chart */}
                        <div className="donut-wrapper">
                            <svg viewBox="0 0 100 100" className="donut-svg">
                                {segments.map((seg, i) => (
                                    <path
                                        key={i}
                                        d={seg.d}
                                        fill={seg.color}
                                        className="donut-segment"
                                    />
                                ))}
                                {/* Center Label */}
                                <text x="50" y="46" textAnchor="middle" className="donut-center-number">
                                    {totalStudents}
                                </text>
                                <text x="50" y="55" textAnchor="middle" className="donut-center-label">
                                    Students
                                </text>
                            </svg>
                        </div>

                        {/* Legend */}
                        <div className="dept-legend">
                            {departmentData.map((dept, i) => (
                                <div key={i} className="legend-item">
                                    <span
                                        className="legend-dot"
                                        style={{ backgroundColor: dept.color }}
                                    ></span>
                                    <span className="legend-label">{dept.label}</span>
                                    <span className="legend-count">
                                        {dept.count}
                                    </span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/*Placement by cgpa bar chart card*/}
                <div className='chart-card'>
                    <div className='chart-card-header'>
                        <h3 className='chart-title'>
                            Placement by CGPA
                        </h3>
                    </div>

                    <div className='bar-chart-wrapper'>
                        <svg viewBox="0 0 280 180" className="bar-chart-svg">

                            {/* y-axis grid lines and labels */}
                            {[0, 10, 20, 30, 40].map((val) => {
                                const y = 20 + ((maxStudents - val) / maxStudents) * 120;
                                return (
                                    <g key={val}>
                                        <line
                                            x1="36" y1={y}
                                            x2="270" y2={y}
                                            stroke="#f1f5f9" strokeWidth="1"
                                        />
                                        <text x="30" y={y + 4} textAnchor="end" className="bar-axis-text">
                                            {val}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* bars with value labels and x-axis labels */}
                            {cgpaData.map((item, i) => {
                                const barWidth = 32;
                                const gap = 15;
                                const x = 44 + i * (barWidth + gap);
                                const barHeight = (item.students / maxStudents) * 120;
                                const y = 20 + (120 - barHeight);
                                return (
                                    <g key={i}>
                                        <rect
                                            x={x} y={y}
                                            width={barWidth} height={barHeight}
                                            rx="4" ry="4"
                                            className="bar-rect"
                                        />
                                        <text
                                            x={x + barWidth / 2} y={y - 5}
                                            textAnchor="middle"
                                            className="bar-value-text"
                                        >
                                            {item.students}
                                        </text>
                                        <text
                                            x={x + barWidth / 2} y="158"
                                            textAnchor="middle"
                                            className="bar-axis-text"
                                        >
                                            {item.range}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* y-axis title */}
                            <text
                                x="-90" y="10"
                                transform="rotate(-90)"
                                textAnchor="middle"
                                className="bar-axis-title"
                            >
                                No. of Students
                            </text>

                            {/* x-axis title */}
                            <text x="153" y="175" textAnchor="middle" className="bar-axis-title">
                                CGPA Range
                            </text>

                        </svg>

                    </div>

                </div>

                {/* top skills in demand card */}
                <div className="chart-card">
                    <div className="chart-card-header">
                        <h3 className="chart-title">Top Skills in Demand</h3>
                    </div>

                    <div className="skills-chart-body">

                        {/* skill rows */}
                        <div className="skills-rows">
                            {skillsData.map((item, i) => (
                                <div key={i} className="skill-row">
                                    <span className="skill-name">{item.skill}</span>
                                    <div className="skill-bar-track">
                                        <div
                                            className="skill-bar-fill"
                                            style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                                        ></div>
                                    </div>
                                    <span className="skill-percentage" style={{ color: item.color }}>{item.percentage}%</span>
                                </div>
                            ))}
                        </div>

                        {/* x-axis percentage markers */}
                        <div className="skills-x-axis">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                        </div>

                        {/* x-axis title */}
                        <p className="skills-x-title">Demand Percentage</p>

                    </div>
                </div>
            </section>

            {/* Top Placed Students Section */}
            <div className="students-table-card">
                <div className="table-card-header">
                    <div className="table-title-group">
                        <h3 className="table-card-title">Top Placed Students</h3>
                        <span className="table-title-badge">Leaderboard</span>
                    </div>
                    <div className="table-header-actions">
                        {!isSearchOpen ? (
                            <button
                                className="table-search-toggle-btn"
                                onClick={() => setIsSearchOpen(true)}
                                title="Search"
                            >
                                <Search size={18} />
                            </button>
                        ) : (
                            <div className="table-search-expanded">
                                <Search size={16} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search student..."
                                    className="table-search-input-expanded"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <button
                                    className="search-clear-btn"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setIsSearchOpen(false);
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                        <button
                            className="add-student-btn"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Plus size={16} /> Add Top Placed Student
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="students-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>STUDENT NAME</th>
                                <th>BRANCH</th>
                                <th>PASSING YEAR</th>
                                <th>CGPA</th>
                                <th>LPA</th>
                                <th>SKILLS</th>
                                <th>COMPANY</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedStudents.map((student) => (
                                <tr key={student.rank}>
                                    <td>
                                        <span className={`rank-badge rank-${student.rank}`}>
                                            {student.rank}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="student-profile-cell">
                                            <div className="student-avatar">{student.initials}</div>
                                            <span className="student-name">{student.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="branch-pill">{student.branch}</span>
                                    </td>
                                    <td>
                                        <span className="year-pill">{student.passingYear}</span>
                                    </td>
                                    <td>
                                        <span className="cgpa-text">{student.cgpa}</span>
                                        <span className="cgpa-max">/10</span>
                                    </td>
                                    <td className="lpa-text">
                                        {student.lpa} LPA
                                    </td>
                                    <td>
                                        <span
                                            className="skill-pill"
                                            style={{
                                                backgroundColor: student.skillColor,
                                                color: student.skillTextColor
                                            }}
                                        >
                                            {student.skill}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="company-logo-cell">
                                            {COMPANY_LOGOS[student.company] || <Coffee size={16} color="#86efac" style={{ marginRight: '8px', fill: '#86efac', flexShrink: 0 }} />}
                                            <span
                                                className="company-text"
                                                style={{ color: student.companyColor || '#1e293b' }}
                                            >
                                                {student.company}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="table-card-footer">
                    {totalPages > 1 && (
                        <div className="table-pagination">
                            <button 
                                className="pagination-btn arrow-btn" 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                &larr;
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button 
                                    key={i + 1} 
                                    className={`pagination-btn num-btn ${currentPage === i + 1 ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                className="pagination-btn arrow-btn" 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                &rarr;
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Top Placed Student Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h3 className="modal-title">Add Top Placed Student</h3>
                                <p className="modal-subtitle">Enter details to feature student on the Leaderboard</p>
                            </div>
                            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddStudent} className="modal-form">
                            <div className="form-group">
                                <label className="form-label">
                                    Student Full Name <span className="required-star">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. Priya Sharma"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">
                                        Branch <span className="required-star">*</span>
                                    </label>
                                    <div className="select-wrapper">
                                        <select
                                            className="form-select"
                                            value={formData.branch}
                                            onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                            required
                                        >
                                            <option value="CS">CS</option>
                                            <option value="IT">IT</option>
                                            <option value="BCA">BCA</option>
                                            <option value="MCA">MCA</option>
                                        </select>
                                        <ChevronDown size={16} className="select-chevron" />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Passing Year <span className="required-star">*</span>
                                    </label>
                                    <div className="select-wrapper">
                                        <select
                                            className="form-select"
                                            value={formData.passingYear}
                                            onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                                            required
                                        >
                                            <option value="2024">2024</option>
                                            <option value="2025">2025</option>
                                            <option value="2026">2026</option>
                                        </select>
                                        <ChevronDown size={16} className="select-chevron" />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">
                                        CGPA (out of 10) <span className="required-star">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. 9.4"
                                        value={formData.cgpa}
                                        onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Package (LPA) <span className="required-star">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. 28"
                                        value={formData.lpa}
                                        onChange={(e) => setFormData({ ...formData, lpa: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Primary Skill</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. Full Stack, Data Science, Back"
                                        value={formData.skill}
                                        onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Company Name <span className="required-star">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. Amazon, Microsoft, Apple"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-submit"
                                >
                                    <Plus size={16} /> Add to Leaderboard
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Toast */}
            {showToast && (
                <div className={`toast-notification ${toastType}`}>
                    <div className="toast-icon-bg" style={{ backgroundColor: toastType === 'error' ? '#fee2e2' : '#dcfce7', color: toastType === 'error' ? '#ef4444' : '#22c55e' }}>
                        {toastType === 'error' ? <X size={16} /> : <Check size={16} />}
                    </div>
                    <span className="toast-text">{toastMessage}</span>
                    <button className="toast-close-btn" onClick={() => setShowToast(false)}>
                        <X size={14} />
                    </button>
                </div>
            )}

        </div>
    );
}
