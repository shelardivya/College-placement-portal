import React, { useState, useEffect } from "react";
import {
    Search,
    MoreVertical,
    Calendar,
    Upload,
    Plus,
    Edit2,
    Trash2,
    Clock,
    ChevronLeft,
    ChevronRight,
    X
} from 'lucide-react';
import './QueriesStories.css';

export default function QueriesStories() {
    // 1. Initial Mock data for Student Queries
    const initialQueries = [
        {
            id: 1,
            name: 'Rahul Patil',
            course: 'B.Sc Computer Science',
            avatar: 'RP',
            colorClass: 'blue',
            title: 'Resume not uploading',
            message: 'I am unable to upload my resume. It shows error please help me resolve this issue.',
            date: '2 May 2025',
            status: 'pending'
        },
        {
            id: 2,
            name: 'Sneha Jadhav',
            course: 'BCA',
            avatar: 'SJ',
            colorClass: 'purple',
            title: 'Profile strength calculation',
            message: 'How is profile strength calculated? I want to improve my score.',
            date: '1 May 2025',
            status: 'in-progress'
        },
        {
            id: 3,
            name: 'Aditya More',
            course: 'B.Sc IT',
            avatar: 'AM',
            colorClass: 'green',
            title: 'TCS Drive Eligibility',
            message: 'Am I eligible for the TCS drive? Please confirm my eligibility.',
            date: '30 Apr 2025',
            status: 'resolved'
        },
        {
            id: 4,
            name: 'Priya Deshmukh',
            course: 'B.Com',
            avatar: 'PD',
            colorClass: 'orange',
            title: 'Documents required',
            message: 'Please provide the list of documents required for placement registration.',
            date: '29 Apr 2025',
            status: 'pending'
        }
    ];

    // React States for student queries and pagination
    const [queries, setQueries] = useState(() => {
        const stored = localStorage.getItem("student_queries");
        return stored ? JSON.parse(stored) : initialQueries;
    });

    useEffect(() => {
        localStorage.setItem("student_queries", JSON.stringify(queries));
    }, [queries]);

    const [querySearch, setQuerySearch] = useState('');
    const [queryFilter, setQueryFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2; // Show 2 queries per page

    // Helper calculations for status counts
    const totalQueriesCount = queries.length;
    const pendingCount = queries.filter(q => q.status === 'pending').length;
    const inProgressCount = queries.filter(q => q.status === 'in-progress').length;
    const resolvedCount = queries.filter(q => q.status === 'resolved').length;

    // Reset pagination to page 1 on search or filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [querySearch, queryFilter]);

    // Filter student queries based on search keyword and selected status pill
    const filteredQueries = queries.filter(q => {
        const matchesSearch = q.name.toLowerCase().includes(querySearch.toLowerCase()) ||
            q.title.toLowerCase().includes(querySearch.toLowerCase()) ||
            q.message.toLowerCase().includes(querySearch.toLowerCase());
        const matchesStatus = queryFilter === 'all' || q.status === queryFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination calculations
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const paginatedQueries = filteredQueries.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredQueries.length / itemsPerPage);

    // Mock Data for Placement Drives
    const initialDrives = [
        {
            id: 1,
            company: 'Google',
            logo: 'https://logo.clearbit.com/google.com',
            role: 'SDE Intern',
            location: 'Bangalore',
            date: '20 Jul 2026',
            time: '10:00 AM',
            status: 'open',
            venue: 'Seminar Hall A',
            about: 'Google is conducting an on-campus recruitment drive for the SDE Intern role.',
            targetStudent: 'All'
        },
        {
            id: 2,
            company: 'Amazon',
            logo: 'https://logo.clearbit.com/amazon.com',
            role: 'Backend Developer',
            location: 'Hyderabad',
            date: '25 Jul 2026',
            time: '11:30 AM',
            status: 'upcoming',
            venue: 'Seminar Hall A',
            about: 'Amazon is conducting an on-campus recruitment drive for the Backend Developer role.',
            targetStudent: 'All'
        },
        {
            id: 3,
            company: 'TCS',
            logo: 'https://logo.clearbit.com/tcs.com',
            role: 'System Engineer',
            location: 'Pune',
            date: '30 Jul 2026',
            time: '09:00 AM',
            status: 'closed',
            venue: 'Seminar Hall B',
            about: 'TCS is conducting a mass campus recruitment drive for System Engineers.',
            targetStudent: 'All'
        },
        {
            id: 4,
            company: 'Infosys',
            logo: 'https://logo.clearbit.com/infosys.com',
            role: 'Full Stack Developer',
            location: 'Mysore',
            date: '05 Aug 2026',
            time: '02:00 PM',
            status: 'upcoming',
            venue: 'Seminar Hall A',
            about: 'Infosys is conducting an on-campus drive for the Full Stack Developer role.',
            targetStudent: 'All'
        },
        {
            id: 5,
            company: 'Cognizant',
            logo: 'https://logo.clearbit.com/cognizant.com',
            role: 'QA Engineer',
            location: 'Chennai',
            date: '12 Aug 2026',
            time: '10:00 AM',
            status: 'upcoming',
            venue: 'Online / MS Teams',
            about: 'Cognizant is conducting a virtual campus drive for the QA Engineer role.',
            targetStudent: 'All'
        },
        {
            id: 6,
            company: 'Wipro',
            logo: 'https://logo.clearbit.com/wipro.com',
            role: 'System Associate',
            location: 'Kochi',
            date: '18 Aug 2026',
            time: '11:00 AM',
            status: 'upcoming',
            venue: 'Placement Cell Lab 2',
            about: 'Wipro is conducting an on-campus drive for System Associates.',
            targetStudent: 'All'
        }
    ];

    // Mock Data for Published Placement Stories
    const initialStories = [
        {
            id: 1,
            name: 'Nithisha Yadav',
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
            company: 'Thoughtworks',
            companyColor: '#f3e8ff',
            companyTextColor: '#8b5cf6',
            role: 'Software Engineer',
            packageAmt: '8.5 LPA',
            storyText: 'Secured a Software Engineer role at Thoughtworks. The preparation drives helped me refine my technical skills.',
            date: '10 Apr 2025'
        },
        {
            id: 2,
            name: 'Prabhat Pundeer',
            avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
            company: 'Snabbits',
            companyColor: '#fffbeb',
            companyTextColor: '#d97706',
            role: 'SDE Intern',
            packageAmt: '6.0 LPA',
            storyText: 'Delighted to join Snabbits as an SDE Intern. Grateful to the control center mentors for guidance.',
            date: '8 Apr 2025'
        },
        {
            id: 3,
            name: 'Deepak Kumar',
            avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
            company: 'Mindstix',
            companyColor: '#eff6ff',
            companyTextColor: '#2563eb',
            role: 'Full Stack Developer',
            packageAmt: '12.0 LPA',
            storyText: 'Landed a Full Stack Developer role at Mindstix. Consistent project building was key to cracking the interviews.',
            date: '5 Apr 2025'
        }
    ];

    // State for placement drives and pagination
    const [drives, setDrives] = useState(() => {
        const stored = localStorage.getItem("placement_drives");
        return stored ? JSON.parse(stored) : initialDrives;
    });

    useEffect(() => {
        localStorage.setItem("placement_drives", JSON.stringify(drives));
    }, [drives]);

    // Modal states for adding/editing placement drives
    const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
    const [editingDrive, setEditingDrive] = useState(null);
    const [driveForm, setDriveForm] = useState({
        company: '',
        role: '',
        location: '',
        date: '',
        time: '',
        venue: '',
        status: 'open',
        targetStudent: 'All'
    });

    const handleOpenAddDrive = () => {
        setEditingDrive(null);
        setDriveForm({
            company: '',
            role: '',
            location: '',
            date: '',
            time: '',
            venue: 'Seminar Hall A',
            status: 'open',
            targetStudent: 'All'
        });
        setIsDriveModalOpen(true);
    };

    const handleOpenEditDrive = (drive) => {
        setEditingDrive(drive);
        setDriveForm({
            company: drive.company || '',
            role: drive.role || '',
            location: drive.location || '',
            date: drive.date || '',
            time: drive.time || '',
            venue: drive.venue || 'Seminar Hall A',
            status: drive.status || 'open',
            targetStudent: drive.targetStudent || 'All'
        });
        setIsDriveModalOpen(true);
    };

    const handleDeleteDrive = (driveId) => {
        if (window.confirm("Are you sure you want to delete this placement drive?")) {
            const updatedDrives = drives.filter(d => d.id !== driveId);
            setDrives(updatedDrives);
        }
    };

    const handleSaveDrive = (e) => {
        e.preventDefault();
        if (!driveForm.company || !driveForm.role) {
            return;
        }

        const logoUrl = `https://logo.clearbit.com/${driveForm.company.toLowerCase().replace(/\s+/g, '')}.com`;

        if (editingDrive) {
            // Update existing
            const updatedDrives = drives.map(d => {
                if (d.id === editingDrive.id) {
                    return {
                        ...d,
                        company: driveForm.company,
                        logo: logoUrl,
                        role: driveForm.role,
                        location: driveForm.location,
                        date: driveForm.date,
                        time: driveForm.time,
                        venue: driveForm.venue,
                        status: driveForm.status,
                        targetStudent: driveForm.targetStudent
                    };
                }
                return d;
            });
            setDrives(updatedDrives);
        } else {
            // Add new
            const newDrive = {
                id: Date.now(),
                company: driveForm.company,
                logo: logoUrl,
                role: driveForm.role,
                location: driveForm.location,
                date: driveForm.date,
                time: driveForm.time,
                venue: driveForm.venue,
                status: driveForm.status,
                targetStudent: driveForm.targetStudent
            };
            setDrives([newDrive, ...drives]);
        }

        setIsDriveModalOpen(false);
    };

    const [driveSearch, setDriveSearch] = useState('');
    const [drivePage, setDrivePage] = useState(1);
    const drivesPerPage = 5; // Show 5 drives per table page

    // State for published placement stories and pagination
    const [stories, setStories] = useState(() => {
        const stored = localStorage.getItem("placement_stories");
        return stored ? JSON.parse(stored) : initialStories;
    });

    useEffect(() => {
        localStorage.setItem("placement_stories", JSON.stringify(stories));
    }, [stories]);

    const [storyPage, setStoryPage] = useState(1);
    const storiesPerPage = 2; // Show 2 stories per carousel slide page

    // Reset drives page to 1 when search query changes
    useEffect(() => {
        setDrivePage(1);
    }, [driveSearch]);

    // Filter drives list based on company name or role search
    const filteredDrives = drives.filter(d =>
        d.company.toLowerCase().includes(driveSearch.toLowerCase()) ||
        d.role.toLowerCase().includes(driveSearch.toLowerCase())
    );

    // Drives pagination calculations
    const indexOfLastDrive = drivePage * drivesPerPage;
    const indexOfFirstDrive = indexOfLastDrive - drivesPerPage;
    const paginatedDrives = filteredDrives.slice(indexOfFirstDrive, indexOfLastDrive);
    const totalDrivePages = Math.ceil(filteredDrives.length / drivesPerPage);

    // Stories pagination calculations
    const indexOfLastStory = storyPage * storiesPerPage;
    const indexOfFirstStory = indexOfLastStory - storiesPerPage;
    const paginatedStories = stories.slice(indexOfFirstStory, indexOfLastStory);
    const totalStoryPages = Math.ceil(stories.length / storiesPerPage);

    // Form state for publishing student success stories
    const [storyForm, setStoryForm] = useState({
        studentName: '',
        companyName: '',
        jobRole: '',
        package: '',
        storyText: ''
    });

    // Handle form submission to publish stories
    const handlePublishStory = (e) => {
        e.preventDefault();
        if (!storyForm.studentName || !storyForm.companyName || !storyForm.jobRole) {
            return;
        }

        const randomId = Math.floor(Math.random() * 50) + 1;
        const isBoy = Math.random() > 0.5;
        const avatarUrl = `https://randomuser.me/api/portraits/${isBoy ? 'men' : 'women'}/${randomId}.jpg`;

        const newStory = {
            id: Date.now(),
            name: storyForm.studentName,
            avatar: avatarUrl,
            company: storyForm.companyName,
            companyColor: '#eff6ff',
            companyTextColor: '#2563eb',
            role: storyForm.jobRole,
            packageAmt: storyForm.package || 'Not Disclosed',
            storyText: storyForm.storyText || `Secured a ${storyForm.jobRole} role at ${storyForm.companyName}.`,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };

        setStories([newStory, ...stories]);

        // Reset form inputs after publishing
        setStoryForm({
            studentName: '',
            companyName: '',
            jobRole: '',
            package: '',
            storyText: ''
        });
    };

    return (
        <div className="queries-stories-container">
            {/* Grid wrapper to place cards side by side */}
            <div className="qs-row">

                {/* 1. Student Queries Card */}
                <div className="qs-panel queries-card">
                    <div className="qs-panel-header">
                        <div>
                            <h3 className="panel-title">Student Queries</h3>
                            <p className="panel-subtitle">View and resolve queries submitted by students.</p>
                        </div>
                        <div className="header-controls">
                            <select
                                className="status-select-dropdown"
                                value={queryFilter}
                                onChange={(e) => setQueryFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                            <div className="qs-search-bar-wrapper">
                                <Search size={16} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search queries..."
                                    className="search-input-box"
                                    value={querySearch}
                                    onChange={(e) => setQuerySearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filter Pills */}
                    <div className="pills-wrapper">
                        <button className={`pill-btn all-pill ${queryFilter === 'all' ? 'active' : ''}`} onClick={() => setQueryFilter('all')}>
                            All ({totalQueriesCount})
                        </button>
                        <button className={`pill-btn pending-pill ${queryFilter === 'pending' ? 'active' : ''}`} onClick={() => setQueryFilter('pending')}>
                            Pending ({pendingCount})
                        </button>
                        <button className={`pill-btn progress-pill ${queryFilter === 'in-progress' ? 'active' : ''}`} onClick={() => setQueryFilter('in-progress')}>
                            In Progress ({inProgressCount})
                        </button>
                        <button className={`pill-btn resolved-pill ${queryFilter === 'resolved' ? 'active' : ''}`} onClick={() => setQueryFilter('resolved')}>
                            Resolved ({resolvedCount})
                        </button>
                    </div>

                    {/* Queries List */}
                    <div className="queries-list-scroll">
                        {paginatedQueries.length > 0 ? (
                            paginatedQueries.map((query) => (
                                <div key={query.id} className="query-item-card">
                                    <div className="query-user-profile">
                                        <div
                                            className="query-avatar-circle"
                                            style={{
                                                backgroundColor:
                                                    query.colorClass === 'blue' ? '#dbeafe' :
                                                        query.colorClass === 'purple' ? '#e9d5ff' :
                                                            query.colorClass === 'green' ? '#a7f3d0' :
                                                                query.colorClass === 'orange' ? '#fed7aa' : '#e0e7ff',
                                                color:
                                                    query.colorClass === 'blue' ? '#1e40af' :
                                                        query.colorClass === 'purple' ? '#581c87' :
                                                            query.colorClass === 'green' ? '#047857' :
                                                                query.colorClass === 'orange' ? '#c2410c' : '#4f46e5'
                                            }}
                                        >
                                            {query.avatar}
                                        </div>
                                        <div className="query-user-info">
                                            <span className="query-username">{query.name}</span>
                                            <span className="query-userdept">{query.course}</span>
                                        </div>
                                    </div>
                                    <div className="query-message-body">
                                        <h5 className="query-subject">{query.title}</h5>
                                        <p className="query-text">{query.message}</p>
                                    </div>
                                    <div className="query-meta-actions">
                                        <span className="query-date-info">
                                            <Calendar size={13} style={{ marginRight: '4px' }} /> {query.date}
                                        </span>
                                        <span className={`query-status-tag status-${query.status}`}>
                                            {query.status}
                                        </span>
                                        <div className="action-links-group">
                                            <button className="text-action-btn">View</button>
                                            <button className="text-action-btn primary-action">Reply</button>
                                            <button className="icon-menu-btn"><MoreVertical size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="empty-state-text">No matching student queries found.</p>
                        )}
                    </div>

                    {/* Centered Pagination controls block */}
                    <div className="table-card-footer">
                        <div className="pagination-wrapper">
                            <button
                                className="pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                &larr;
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                <button
                                    key={pageNum}
                                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            <button
                                className="pagination-btn"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || totalPages === 0}
                            >
                                &rarr;
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Publish Story Form Panel */}
                <div className="qs-panel publish-story-card">
                    <div className="qs-panel-header">
                        <div>
                            <h3 className="panel-title">Create Placement Story</h3>
                            <p className="panel-subtitle">Add and publish success stories of placed students.</p>
                        </div>
                    </div>

                    <form onSubmit={handlePublishStory} className="publish-form-body">
                        {/* Upper Row containing upload photo dashed card and name/company inputs */}
                        <div className="form-upper-row">
                            <div className="upload-photo-zone">
                                <Upload size={24} className="upload-cloud-icon" />
                                <span className="upload-label">Upload Photo</span>
                                <span className="upload-subtext">PNG, JPG (Max 5MB)</span>
                            </div>
                            <div className="inputs-block">
                                <div className="form-group-field">
                                    <label className="field-label">Student Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter student name"
                                        className="form-input-control"
                                        value={storyForm.studentName}
                                        onChange={(e) => setStoryForm({ ...storyForm, studentName: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-field">
                                    <label className="field-label">Company Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter company name"
                                        className="form-input-control"
                                        value={storyForm.companyName}
                                        onChange={(e) => setStoryForm({ ...storyForm, companyName: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Split inputs for Role and Package */}
                        <div className="form-grid-row">
                            <div className="form-group-field">
                                <label className="field-label">Job Role</label>
                                <input
                                    type="text"
                                    placeholder="Enter job role"
                                    className="form-input-control"
                                    value={storyForm.jobRole}
                                    onChange={(e) => setStoryForm({ ...storyForm, jobRole: e.target.value })}
                                />
                            </div>
                            <div className="form-group-field">
                                <label className="field-label">Package</label>
                                <input
                                    type="text"
                                    placeholder="Enter package (e.g. 6 LPA)"
                                    className="form-input-control"
                                    value={storyForm.package}
                                    onChange={(e) => setStoryForm({ ...storyForm, package: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Full width Success Story textarea field */}
                        <div className="form-group-field full-width">
                            <label className="field-label">Success Story</label>
                            <textarea
                                placeholder="Write the student's success story..."
                                className="form-textarea-control"
                                rows={4}
                                value={storyForm.storyText}
                                onChange={(e) => setStoryForm({ ...storyForm, storyText: e.target.value })}
                            ></textarea>
                        </div>

                        {/* Submit button aligned to right */}
                        <div className="form-submit-row">
                            <button type="submit" className="btn-primary-purple">Publish Story</button>
                        </div>
                    </form>
                </div>

            </div> {/* End of top qs-row */}

            {/* Second row layout containing Manage Placement Drives and Published Placement Stories side by side */}
            <div className="qs-row" style={{ marginTop: '24px' }}>

                {/* 3. Manage Placement Drives Panel */}
                <div className="qs-panel placement-drives-card">
                    <div className="qs-panel-header">
                        <div>
                            <h3 className="panel-title">Manage Placement Drives</h3>
                            <p className="panel-subtitle">Add, edit and manage all placement drives.</p>
                        </div>
                        <div className="header-actions-group">
                            <div className="qs-search-bar-wrapper">
                                <Search size={16} className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search drives..."
                                    className="search-input-box"
                                    value={driveSearch}
                                    onChange={(e) => setDriveSearch(e.target.value)}
                                />
                            </div>
                            <button className="btn-add-drive" onClick={handleOpenAddDrive}>
                                <Plus size={15} style={{ marginRight: '6px' }} />
                                Add New Drive
                            </button>
                        </div>
                    </div>

                    {/* Placement Drives List Table */}
                    <div className="qs-table-wrapper">
                        <table className="qs-drives-table">
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Job Role</th>
                                    <th>Location</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedDrives.length > 0 ? (
                                    paginatedDrives.map((drive) => (
                                        <tr key={drive.id}>
                                            <td>
                                                <div className="company-logo-cell">
                                                    <img
                                                        src={drive.logo}
                                                        alt={drive.company}
                                                        className="logo-initial"
                                                        style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                                                    />
                                                    <span className="table-bold-text">{drive.company}</span>
                                                </div>
                                            </td>
                                            <td>{drive.role}</td>
                                            <td>{drive.location}</td>
                                            <td>
                                                <span className="icon-text-cell">
                                                    <Calendar size={13} />
                                                    {drive.date}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="icon-text-cell">
                                                    <Clock size={13} />
                                                    {drive.time}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`drive-status-badge badge-${drive.status}`}>
                                                    {drive.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="actions-button-row">
                                                    <button className="action-icon-btn edit" onClick={() => handleOpenEditDrive(drive)}>
                                                        <Edit2 size={15} />
                                                    </button>
                                                    <button className="action-icon-btn delete" onClick={() => handleDeleteDrive(drive.id)}>
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="empty-state-text">No active placement drives found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-card-footer" style={{ marginTop: 'auto', paddingTop: '12px' }}>
                        <div className="pagination-wrapper">
                            <button
                                className="pagination-btn"
                                onClick={() => setDrivePage(prev => Math.max(prev - 1, 1))}
                                disabled={drivePage === 1}
                            >
                                &larr;
                            </button>

                            {Array.from({ length: totalDrivePages }, (_, i) => i + 1).map(pageNum => (
                                <button
                                    key={pageNum}
                                    className={`pagination-btn ${drivePage === pageNum ? 'active' : ''}`}
                                    onClick={() => setDrivePage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            <button
                                className="pagination-btn"
                                onClick={() => setDrivePage(prev => Math.min(prev + 1, totalDrivePages))}
                                disabled={drivePage === totalDrivePages || totalDrivePages === 0}
                            >
                                &rarr;
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4. Published Placement Stories Panel */}
                <div className="qs-panel placement-stories-card" style={{ position: 'relative' }}>
                    <div className="qs-panel-header">
                        <div>
                            <h3 className="panel-title">Published Placement Stories</h3>
                            <p className="panel-subtitle">Manage and edit published placement stories.</p>
                        </div>
                    </div>

                    {/* Stories Carousel grid layout */}
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '12px' }}>
                        {/* Carousel Left navigation trigger arrow */}
                        <button
                            className="action-icon-btn"
                            onClick={() => setStoryPage(prev => Math.max(prev - 1, 1))}
                            disabled={storyPage === 1}
                            style={{
                                border: '1px solid #e2e8f0',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#ffffff',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                cursor: storyPage === 1 ? 'not-allowed' : 'pointer',
                                padding: 0,
                                opacity: storyPage === 1 ? 0.3 : 1,
                                transition: 'opacity 0.2s ease'
                            }}
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className="stories-cards-row">
                            {paginatedStories.map((story) => (
                                <div key={story.id} className="story-single-card">
                                    <div className="story-card-top">
                                        <img
                                            src={story.avatar}
                                            alt={story.name}
                                            className="story-student-avatar"
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <span
                                            className="story-company-tag"
                                            style={{
                                                backgroundColor: story.companyColor,
                                                color: story.companyTextColor
                                            }}
                                        >
                                            {story.company}
                                        </span>
                                    </div>
                                    <div className="story-card-body">
                                        <h4 className="story-student-name">{story.name}</h4>
                                        <p className="story-student-role" style={{ color: story.companyTextColor, margin: '2px 0 0 0', fontWeight: '700', fontSize: '0.8rem' }}>
                                            {story.role}
                                        </p>
                                        <p className="story-role-desc" style={{ marginTop: '8px', lineHeight: '1.4', fontSize: '0.75rem', color: '#64748b' }}>
                                            "{story.storyText || `Secured a ${story.role} role at ${story.company}.`}"
                                        </p>
                                        <span className="story-package-tag">{story.packageAmt}</span>
                                        <span className="story-publish-date-inline">
                                            <Calendar size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                            Published on {story.date}
                                        </span>
                                    </div>
                                    <div className="story-card-footer">
                                        <button className="story-action-btn edit">Edit</button>
                                        <button className="story-action-btn delete">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Carousel Right navigation trigger arrow */}
                        <button
                            className="action-icon-btn"
                            onClick={() => setStoryPage(prev => Math.min(prev + 1, totalStoryPages))}
                            disabled={storyPage === totalStoryPages}
                            style={{
                                border: '1px solid #e2e8f0',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#ffffff',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                cursor: storyPage === totalStoryPages ? 'not-allowed' : 'pointer',
                                padding: 0,
                                opacity: storyPage === totalStoryPages ? 0.3 : 1,
                                transition: 'opacity 0.2s ease'
                            }}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

            </div>

            {/* Modal rendering */}
            {isDriveModalOpen && (
                <div className="qs-modal-overlay" onClick={() => setIsDriveModalOpen(false)}>
                    <div className="qs-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="qs-modal-header">
                            <h4>{editingDrive ? "Edit Placement Drive" : "Add New Placement Drive"}</h4>
                            <button className="qs-close-btn" onClick={() => setIsDriveModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveDrive} className="qs-modal-form">
                            <div className="qs-form-grid">
                                <div className="qs-form-group">
                                    <label>Company Name *</label>
                                    <input
                                        type="text"
                                        required
                                        className="form-input-control"
                                        value={driveForm.company}
                                        onChange={(e) => setDriveForm({ ...driveForm, company: e.target.value })}
                                        placeholder="e.g. TCS"
                                    />
                                </div>
                                <div className="qs-form-group">
                                    <label>Job Role *</label>
                                    <input
                                        type="text"
                                        required
                                        className="form-input-control"
                                        value={driveForm.role}
                                        onChange={(e) => setDriveForm({ ...driveForm, role: e.target.value })}
                                        placeholder="e.g. System Engineer"
                                    />
                                </div>
                                <div className="qs-form-group">
                                    <label>Location *</label>
                                    <input
                                        type="text"
                                        required
                                        className="form-input-control"
                                        value={driveForm.location}
                                        onChange={(e) => setDriveForm({ ...driveForm, location: e.target.value })}
                                        placeholder="e.g. Pune"
                                    />
                                </div>
                                <div className="qs-form-group">
                                    <label>Date *</label>
                                    <input
                                        type="text"
                                        required
                                        className="form-input-control"
                                        value={driveForm.date}
                                        onChange={(e) => setDriveForm({ ...driveForm, date: e.target.value })}
                                        placeholder="e.g. 30 Jul 2026"
                                    />
                                </div>
                                <div className="qs-form-group">
                                    <label>Time *</label>
                                    <input
                                        type="text"
                                        required
                                        className="form-input-control"
                                        value={driveForm.time}
                                        onChange={(e) => setDriveForm({ ...driveForm, time: e.target.value })}
                                        placeholder="e.g. 09:00 AM"
                                    />
                                </div>
                                <div className="qs-form-group">
                                    <label>Venue *</label>
                                    <input
                                        type="text"
                                        required
                                        className="form-input-control"
                                        value={driveForm.venue}
                                        onChange={(e) => setDriveForm({ ...driveForm, venue: e.target.value })}
                                        placeholder="e.g. Seminar Hall A"
                                    />
                                </div>
                                <div className="qs-form-group">
                                    <label>Status *</label>
                                    <select
                                        className="form-input-control"
                                        value={driveForm.status}
                                        onChange={(e) => setDriveForm({ ...driveForm, status: e.target.value })}
                                    >
                                        <option value="open">Open</option>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                                <div className="qs-form-group">
                                    <label>Target Student Email (Leave as 'All' for everyone)</label>
                                    <select
                                        className="form-input-control"
                                        value={driveForm.targetStudent}
                                        onChange={(e) => setDriveForm({ ...driveForm, targetStudent: e.target.value })}
                                    >
                                        <option value="All">All Students</option>
                                        <option value="student@portal.edu">student@portal.edu (Default Student)</option>
                                        <option value="priya@college.edu.in">priya@college.edu.in (Priya Sharma)</option>
                                        <option value="rahul@college.edu.in">rahul@college.edu.in (Rahul Patil)</option>
                                        <option value="sneha@college.edu.in">sneha@college.edu.in (Sneha Jadhav)</option>
                                        {/* Dynamic profiles */}
                                        {(() => {
                                            try {
                                                const profiles = JSON.parse(localStorage.getItem("registered_profiles") || "[]");
                                                return profiles.map(p => (
                                                    <option key={p.email} value={p.email}>{p.email} ({p.fullName})</option>
                                                ));
                                            } catch (err) {
                                                return null;
                                            }
                                        })()}
                                    </select>
                                </div>
                            </div>
                            <div className="qs-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" className="qs-cancel-btn" onClick={() => setIsDriveModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary-purple">
                                    {editingDrive ? "Update Drive" : "Add Drive"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}