import React, { useState, useEffect, useRef } from "react";
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
    X,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import './QueriesStories.css';

export default function QueriesStories() {
    // Toast notification state
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [showToast, setShowToast] = useState(false);

    const triggerToast = (msg, type = "success") => {
        setToastMessage(msg);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };
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
            status: 'resolved'
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
            status: 'resolved'
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
            status: 'resolved'
        }
    ];

    // React States for student queries and pagination
    const [queries, setQueries] = useState(() => {
        const stored = localStorage.getItem("student_queries");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                return parsed.map(q => q.status === 'in-progress' ? { ...q, status: 'resolved' } : q);
            } catch (e) {
                return initialQueries;
            }
        }
        return initialQueries;
    });

    useEffect(() => {
        localStorage.setItem("student_queries", JSON.stringify(queries));
    }, [queries]);

    const [querySearch, setQuerySearch] = useState('');
    const [queryFilter, setQueryFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2; // Show 2 queries per page

    // States for View and Reply Modals
    const [viewingQuery, setViewingQuery] = useState(null);
    const [replyingQuery, setReplyingQuery] = useState(null);
    const [replyText, setReplyText] = useState('');

    const handleSendReply = (e) => {
        e.preventDefault();
        if (!replyingQuery) return;
        setQueries(prevQueries => prevQueries.map(q => {
            if (q.id === replyingQuery.id) {
                return {
                    ...q,
                    status: 'resolved',
                    reply: replyText
                };
            }
            return q;
        }));
        triggerToast("Reply sent to student query successfully!", "success");
        setReplyingQuery(null);
        setReplyText('');
    };

    // Helper calculations for status counts
    const totalQueriesCount = queries.length;
    const pendingCount = queries.filter(q => q.status === 'pending').length;
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
            logo: 'https://www.google.com/s2/favicons?domain=google.com&sz=128',
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
            logo: 'https://www.google.com/s2/favicons?domain=amazon.com&sz=128',
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
            logo: 'https://www.google.com/s2/favicons?domain=tcs.com&sz=128',
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
            logo: 'https://www.google.com/s2/favicons?domain=infosys.com&sz=128',
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
            logo: 'https://www.google.com/s2/favicons?domain=cognizant.com&sz=128',
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
            logo: 'https://www.google.com/s2/favicons?domain=wipro.com&sz=128',
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

    // Modal states for adding/editing/deleting placement drives
    const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
    const [editingDrive, setEditingDrive] = useState(null);
    const [deletingDrive, setDeletingDrive] = useState(null);
    const [driveForm, setDriveForm] = useState({
        company: '',
        role: '',
        location: '',
        date: '',
        time: '',
        venue: 'Seminar Hall A',
        status: 'open',
        targetStudent: 'All Students (Selected for Everyone)',
        customTarget: ''
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
            targetStudent: 'All Students (Selected for Everyone)',
            customTarget: ''
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
            targetStudent: drive.targetStudent || 'All Students (Selected for Everyone)',
            customTarget: drive.customTarget || ''
        });
        setIsDriveModalOpen(true);
    };

    const confirmDeleteDrive = () => {
        if (!deletingDrive) return;
        const updatedDrives = drives.filter(d => d.id !== deletingDrive.id);
        setDrives(updatedDrives);
        setDeletingDrive(null);
        triggerToast("Placement drive deleted successfully!", "success");
    };

    const handleSaveDrive = (e) => {
        e.preventDefault();
        if (!driveForm.company || !driveForm.role) {
            return;
        }

        const logoUrl = `https://www.google.com/s2/favicons?domain=${driveForm.company.toLowerCase().replace(/\s+/g, '')}.com&sz=128`;

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
            triggerToast("Placement drive updated successfully!", "success");
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
            triggerToast("Placement drive created successfully!", "success");
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

    const fileInputRef = useRef(null);

    // Form state for publishing student success stories
    const [storyForm, setStoryForm] = useState({
        studentName: '',
        companyName: '',
        jobRole: '',
        package: '',
        storyText: '',
        photo: ''
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                triggerToast("Photo size exceeds 5MB limit", "error");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setStoryForm(prev => ({ ...prev, photo: reader.result }));
                triggerToast("Photo attached successfully!", "success");
            };
            reader.readAsDataURL(file);
        }
    };

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
            avatar: storyForm.photo || avatarUrl,
            company: storyForm.companyName,
            companyColor: '#eff6ff',
            companyTextColor: '#2563eb',
            role: storyForm.jobRole,
            packageAmt: storyForm.package ? (storyForm.package.toLowerCase().includes('lpa') ? storyForm.package : `${storyForm.package} LPA`) : '6.0 LPA',
            storyText: storyForm.storyText || `Secured a ${storyForm.jobRole} role at ${storyForm.companyName}.`,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };

        setStories([newStory, ...stories]);
        triggerToast("Placement story published successfully!", "success");

        // Reset form inputs after publishing
        setStoryForm({
            studentName: '',
            companyName: '',
            jobRole: '',
            package: '',
            storyText: '',
            photo: ''
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
                                            <button className="text-action-btn" onClick={() => setViewingQuery(query)}>View</button>
                                            <button className="text-action-btn primary-action" onClick={() => { setReplyingQuery(query); setReplyText(query.reply || ''); }}>Reply</button>
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
                            <div className="upload-photo-zone" onClick={() => fileInputRef.current?.click()}>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handlePhotoChange}
                                />
                                {storyForm.photo ? (
                                    <div className="photo-preview-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                        <img
                                            src={storyForm.photo}
                                            alt="Preview"
                                            style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6366f1' }}
                                        />
                                        <span className="upload-label" style={{ marginTop: '4px', color: '#10b981', fontSize: '0.7rem' }}>Photo Attached</span>
                                        <button
                                            type="button"
                                            style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.65rem', cursor: 'pointer', marginTop: '2px', textDecoration: 'underline' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setStoryForm(prev => ({ ...prev, photo: '' }));
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={24} className="upload-cloud-icon" />
                                        <span className="upload-label">Upload Photo</span>
                                        <span className="upload-subtext">PNG, JPG (Max 5MB)</span>
                                    </>
                                )}
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
            <div className="qs-row qs-row-bottom" style={{ marginTop: '24px' }}>

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
                                    <th>Venue</th>
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
                                                        src={drive.logo?.includes('clearbit') ? `https://www.google.com/s2/favicons?domain=${drive.company.toLowerCase().replace(/\s+/g, '')}.com&sz=128` : drive.logo}
                                                        alt={drive.company}
                                                        style={{
                                                            width: '28px',
                                                            height: '28px',
                                                            objectFit: 'contain',
                                                            borderRadius: '6px',
                                                            background: '#f8fafc',
                                                            border: '1px solid #e2e8f0',
                                                            padding: '2px',
                                                            flexShrink: 0
                                                        }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <span
                                                        className="logo-initial"
                                                        style={{ display: 'none' }}
                                                    >
                                                        {drive.company.charAt(0)}
                                                    </span>
                                                    <span className="table-bold-text">{drive.company}</span>
                                                </div>
                                            </td>
                                            <td>{drive.role}</td>
                                            <td>{drive.location}</td>
                                            <td>{drive.venue || 'Seminar Hall A'}</td>
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
                                                    <button className="action-icon-btn delete" onClick={() => setDeletingDrive(drive)}>
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="empty-state-text">No active placement drives found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="table-card-footer" style={{ paddingTop: '12px', marginBottom: 'auto' }}>
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
                <div className="qs-panel placement-stories-card">
                    <div className="qs-panel-header">
                        <div>
                            <h3 className="panel-title">Published Placement Stories</h3>
                            <p className="panel-subtitle">Manage and edit published placement stories.</p>
                        </div>
                    </div>

                    {/* Vertical Stack of Story Cards */}
                    <div className="stories-vertical-list">
                        {paginatedStories.map((story) => (
                            <div key={story.id} className="story-card-item">
                                <div className="story-card-header-row">
                                    <div className="story-student-profile">
                                        <img
                                            src={story.avatar}
                                            alt={story.name}
                                            className="story-avatar-img"
                                        />
                                        <div className="story-student-meta">
                                            <div className="name-company-row">
                                                <h4 className="story-student-fullname">{story.name}</h4>
                                                <span
                                                    className="story-company-pill"
                                                    style={{
                                                        backgroundColor: story.companyColor || '#f3e8ff',
                                                        color: story.companyTextColor || '#8b5cf6'
                                                    }}
                                                >
                                                    {story.company}
                                                </span>
                                            </div>
                                            <span
                                                className="story-role-title"
                                                style={{ color: story.companyTextColor || '#8b5cf6' }}
                                            >
                                                {story.role}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="story-package-badge">{story.packageAmt}</span>
                                </div>

                                <div className="story-quote-card">
                                    "{story.storyText || `Secured a ${story.role} role at ${story.company}.`}"
                                </div>

                                <div className="story-card-footer-row">
                                    <span className="story-publish-date">
                                        <Calendar size={13} /> Published on {story.date}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Pagination Control */}
                    <div className="stories-pagination-footer">
                        <button
                            className="stories-nav-btn"
                            onClick={() => setStoryPage(prev => Math.max(prev - 1, 1))}
                            disabled={storyPage === 1}
                        >
                            &larr; Prev
                        </button>

                        <span className="stories-page-info">
                            Page {storyPage} of {totalStoryPages || 1}
                        </span>

                        <button
                            className="stories-nav-btn"
                            onClick={() => setStoryPage(prev => Math.min(prev + 1, totalStoryPages))}
                            disabled={storyPage === totalStoryPages || totalStoryPages === 0}
                        >
                            Next &rarr;
                        </button>
                    </div>
                </div>

            </div>

            {/* Add / Edit Placement Drive Modal */}
            {isDriveModalOpen && (
                <div className="qs-modal-overlay" onClick={() => setIsDriveModalOpen(false)}>
                    <div className="qs-modal-content drive-form-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="qs-modal-header">
                            <div>
                                <h4 className="modal-title">{editingDrive ? "Edit Placement Drive" : "Add New Placement Drive"}</h4>
                                <p className="modal-subtitle">Configure schedule, venue, and target students for this placement drive.</p>
                            </div>
                            <button className="qs-close-btn" onClick={() => setIsDriveModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleSaveDrive} className="qs-modal-form">
                            <div className="qs-form-grid">
                                <div className="qs-form-group">
                                    <label className="form-label">Company Name *</label>
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
                                    <label className="form-label">Job Role *</label>
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
                                    <label className="form-label">Location *</label>
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
                                    <label className="form-label">Date *</label>
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
                                    <label className="form-label">Time *</label>
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
                                    <label className="form-label">Venue *</label>
                                    <input
                                        type="text"
                                        required
                                        className="form-input-control"
                                        value={driveForm.venue}
                                        onChange={(e) => setDriveForm({ ...driveForm, venue: e.target.value })}
                                        placeholder="Seminar Hall A"
                                    />
                                </div>
                                <div className="qs-form-group">
                                    <label className="form-label">Status *</label>
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
                                    <label className="form-label">Target Student *</label>
                                    <select
                                        className="form-input-control"
                                        value={driveForm.targetStudent}
                                        onChange={(e) => setDriveForm({ ...driveForm, targetStudent: e.target.value })}
                                    >
                                        <option value="All Students (Selected for Everyone)">All Students (Selected for Everyone)</option>
                                        <option value="student@portal.edu">student@portal.edu (Default Student)</option>
                                        <option value="priya@college.edu.in">priya@college.edu.in (Priya Sharma)</option>
                                        <option value="rahul@college.edu.in">rahul@college.edu.in (Rahul Patil)</option>
                                        <option value="sneha@college.edu.in">sneha@college.edu.in (Sneha Jadhav)</option>
                                    </select>
                                </div>
                                <div className="qs-form-group full-width">
                                    <label className="form-label">Or Type Specific Student Name / Interview Target Manually</label>
                                    <input
                                        type="text"
                                        className="form-input-control"
                                        value={driveForm.customTarget || ''}
                                        onChange={(e) => setDriveForm({ ...driveForm, customTarget: e.target.value })}
                                        placeholder="e.g. Sneha Jadhav (BCA)"
                                    />
                                </div>
                            </div>
                            <div className="qs-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" className="qs-cancel-btn" onClick={() => setIsDriveModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary-purple" style={{ backgroundColor: '#2563eb' }}>
                                    <Plus size={16} /> {editingDrive ? "Update Drive" : "Add Drive"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Placement Drive Confirmation Modal */}
            {deletingDrive && (
                <div className="qs-modal-overlay" onClick={() => setDeletingDrive(null)}>
                    <div className="qs-delete-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-modal-icon-bg">
                            <Trash2 size={22} />
                        </div>
                        <h4 className="delete-modal-title">Delete Placement Drive</h4>
                        <p className="delete-modal-desc">
                            Are you sure you want to delete the drive for <strong>{deletingDrive.company}</strong>? This action cannot be undone.
                        </p>
                        <div className="delete-modal-actions">
                            <button type="button" className="btn-delete-cancel" onClick={() => setDeletingDrive(null)}>
                                Cancel
                            </button>
                            <button type="button" className="btn-delete-confirm" onClick={confirmDeleteDrive}>
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Student Query Details Modal */}
            {viewingQuery && (
                <div className="qs-modal-overlay" onClick={() => setViewingQuery(null)}>
                    <div className="qs-modal-content view-query-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="qs-modal-header">
                            <div>
                                <h4 className="modal-title">Student Query Details</h4>
                                <p className="modal-subtitle">Submitted by {viewingQuery.name}</p>
                            </div>
                            <button className="qs-close-btn" onClick={() => setViewingQuery(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="query-modal-body">
                            <div className="modal-user-profile-row">
                                <div className="query-user-profile">
                                    <div
                                        className="query-avatar-circle"
                                        style={{
                                            backgroundColor:
                                                viewingQuery.colorClass === 'blue' ? '#dbeafe' :
                                                    viewingQuery.colorClass === 'purple' ? '#e9d5ff' :
                                                        viewingQuery.colorClass === 'green' ? '#a7f3d0' :
                                                            viewingQuery.colorClass === 'orange' ? '#fed7aa' : '#e0e7ff',
                                            color:
                                                viewingQuery.colorClass === 'blue' ? '#1e40af' :
                                                    viewingQuery.colorClass === 'purple' ? '#581c87' :
                                                        viewingQuery.colorClass === 'green' ? '#047857' :
                                                            viewingQuery.colorClass === 'orange' ? '#c2410c' : '#4f46e5'
                                        }}
                                    >
                                        {viewingQuery.avatar}
                                    </div>
                                    <div className="query-user-info">
                                        <span className="query-username">{viewingQuery.name}</span>
                                        <span className="query-userdept">{viewingQuery.course}</span>
                                    </div>
                                </div>
                                <span className={`query-status-tag status-${viewingQuery.status}`}>
                                    {viewingQuery.status}
                                </span>
                            </div>

                            <div className="modal-field-section">
                                <span className="modal-field-label">SUBJECT</span>
                                <h4 className="modal-subject-title">{viewingQuery.title}</h4>
                            </div>

                            <div className="modal-field-section">
                                <span className="modal-field-label">QUERY DESCRIPTION</span>
                                <div className="modal-description-box">
                                    {viewingQuery.message}
                                </div>
                            </div>

                            <div className="modal-date-row">
                                <Calendar size={13} style={{ marginRight: '6px' }} />
                                <span>Submitted on {viewingQuery.date}</span>
                            </div>

                            <div className="qs-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <button className="qs-cancel-btn" onClick={() => setViewingQuery(null)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reply to Query Modal */}
            {replyingQuery && (
                <div className="qs-modal-overlay" onClick={() => setReplyingQuery(null)}>
                    <div className="qs-modal-content reply-query-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="qs-modal-header">
                            <div>
                                <h4 className="modal-title">Reply to Query</h4>
                                <p className="modal-subtitle">Replying to {replyingQuery.name}</p>
                            </div>
                            <button className="qs-close-btn" onClick={() => setReplyingQuery(null)}>
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSendReply} className="query-modal-body">
                            <div className="modal-field-section">
                                <span className="modal-field-label">STUDENT'S QUERY</span>
                                <div className="modal-description-box">
                                    <h5 className="reply-preview-title">{replyingQuery.title}</h5>
                                    <p className="reply-preview-text">{replyingQuery.message}</p>
                                </div>
                            </div>

                            <div className="modal-field-section">
                                <label className="form-label" style={{ fontWeight: '600', fontSize: '0.82rem', color: '#334155' }}>
                                    Admin Response Message *
                                </label>
                                <textarea
                                    className="form-textarea-control"
                                    rows={4}
                                    placeholder="Type your official response to the student here..."
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    required
                                    style={{ marginTop: '6px', width: '100%', boxSizing: 'border-box' }}
                                ></textarea>
                            </div>

                            <div className="qs-modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                                <button type="button" className="qs-cancel-btn" onClick={() => setReplyingQuery(null)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary-purple" style={{ backgroundColor: '#2563eb' }}>
                                    Send Reply
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* TOAST NOTIFICATION COMPONENT */}
            {showToast && (
                <div className={`toast-notification ${toastType}`}>
                    <div className="toast-content">
                        {toastType === 'success' ? (
                            <CheckCircle2 className="toast-icon" size={18} />
                        ) : (
                            <XCircle className="toast-icon" size={18} />
                        )}
                        <span>{toastMessage}</span>
                    </div>
                    <div className="toast-progress-bar"></div>
                </div>
            )}
        </div>
    );
}