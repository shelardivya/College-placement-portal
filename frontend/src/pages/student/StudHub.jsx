import React, { useState, useEffect } from "react";
import {
    Award,
    MessageSquare,
    Plus,
    Calendar,
    Clock,
    MapPin,
    Building,
    Briefcase,
    CheckCircle2,
    User,
    FileText
} from "lucide-react";
import "./StudHub.css";

// Default fallback mock data for Placement Drives
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

// Default fallback mock data for Placement Stories
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

// Default fallback mock data for Student Queries & Responses
const initialStudentQueries = [
    {
        id: 101,
        title: 'Resume not uploading',
        message: 'I tried uploading my resume PDF but it throws an error.',
        status: 'resolved',
        reply: 'Please clear your browser cache and upload a PDF under 5MB. Contact support if it persists.',
        date: '20 Jul 2026'
    },
    {
        id: 102,
        title: 'Profile strength calculation',
        message: 'How is the profile strength percentage calculated?',
        status: 'resolved',
        reply: 'Profile strength score increases as you fill in your academic details, skills, and upload a verified resume.',
        date: '18 Jul 2026'
    },
    {
        id: 103,
        title: 'TCS Drive Eligibility Requirements',
        message: 'Am I eligible for TCS drive with 65% aggregate?',
        status: 'resolved',
        reply: 'TCS requires a minimum of 60% across 10th, 12th, and Graduation with no active backlogs.',
        date: '15 Jul 2026'
    },
    {
        id: 104,
        title: 'Interview slot rescheduling request',
        message: 'Can I reschedule my interview slot for Infosys drive?',
        status: 'resolved',
        reply: 'Slot rescheduling requests are approved by placement officers on a case-by-case basis.',
        date: '12 Jul 2026'
    }
];

export default function StudHub() {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [showDriveDetails, setShowDriveDetails] = useState(false);

    // Sync drives from localStorage
    const [drives] = useState(() => {
        const stored = localStorage.getItem("placement_drives");
        return stored ? JSON.parse(stored) : initialDrives;
    });

    // Filter drives targeted to this student
    const studentEmail = (loggedInUser.email || "").toLowerCase().trim();
    const studentFilteredDrives = drives.filter(drive => {
        const target = (drive.targetStudent || "").toLowerCase().trim();
        if (target === "" || target === "all") {
            return true;
        }
        return target === studentEmail;
    });

    const activeDrives = studentFilteredDrives.filter(d => d.status === 'open' || d.status === 'upcoming');
    const getParsedDate = (dateStr) => {
        try {
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? new Date("9999-12-31") : d;
        } catch (e) {
            return new Date("9999-12-31");
        }
    };
    activeDrives.sort((a, b) => getParsedDate(a.date) - getParsedDate(b.date));
    const nextEvent = activeDrives[0];

    // Stories state
    const [stories] = useState(() => {
        const stored = localStorage.getItem("placement_stories");
        return stored ? JSON.parse(stored) : initialStories;
    });

    // Queries state
    const [queries, setQueries] = useState(() => {
        const stored = localStorage.getItem("student_queries");
        return stored && JSON.parse(stored).length > 0 ? JSON.parse(stored) : initialStudentQueries;
    });

    // Sync queries back to localStorage
    useEffect(() => {
        localStorage.setItem("student_queries", JSON.stringify(queries));
    }, [queries]);

    // Query Form state
    const [querySubject, setQuerySubject] = useState("");
    const [queryMessage, setQueryMessage] = useState("");

    const handleRaiseQuery = (e) => {
        e.preventDefault();
        if (!querySubject.trim() || !queryMessage.trim()) return;

        const newQuery = {
            id: Date.now(),
            title: querySubject,
            message: queryMessage,
            status: 'pending',
            reply: 'Your query has been submitted. Admin team will respond shortly.',
            date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
        };

        setQueries(prev => [newQuery, ...prev]);
        setQuerySubject("");
        setQueryMessage("");
    };

    // Segmented filter tab and separate pagination states for Query Responses
    const [queryResponseTab, setQueryResponseTab] = useState('all'); // 'all' or 'resolved'
    const [allQueriesPage, setAllQueriesPage] = useState(1);
    const [resolvedQueriesPage, setResolvedQueriesPage] = useState(1);
    const QUERIES_PER_PAGE = 2;

    const allQueriesList = queries.length > 0 ? queries : initialStudentQueries;
    const resolvedQueriesList = allQueriesList.filter(q => q.status === 'resolved');

    const currentQueriesList = queryResponseTab === 'all' ? allQueriesList : resolvedQueriesList;
    const currentPageNum = queryResponseTab === 'all' ? allQueriesPage : resolvedQueriesPage;

    const totalQueryPages = Math.ceil(currentQueriesList.length / QUERIES_PER_PAGE) || 1;

    const paginatedQueryResponses = currentQueriesList.slice(
        (currentPageNum - 1) * QUERIES_PER_PAGE,
        currentPageNum * QUERIES_PER_PAGE
    );

    const handlePageChange = (newPage) => {
        if (queryResponseTab === 'all') {
            setAllQueriesPage(newPage);
        } else {
            setResolvedQueriesPage(newPage);
        }
    };

    const handleToggleResolveQuery = (queryId) => {
        setQueries(prev => {
            const source = prev.length > 0 ? prev : initialStudentQueries;
            return source.map(q => {
                if (q.id === queryId) {
                    return { ...q, status: q.status === 'resolved' ? 'pending' : 'resolved' };
                }
                return q;
            });
        });
    };

    return (
        <div className="studhub-container">
            {/* Stud Hub Welcome Banner */}
            <div className="studhub-banner">
                <div className="studhub-banner-text">
                    <h2>Stud Hub <span>🚀</span></h2>
                    <p>Stay updated with placement stories, upcoming campus drives, and raise your queries — all in one place.</p>
                </div>
                <div className="welcome-date-badge">
                    <span>📅 {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
            </div>

            {/* Two-column layout */}
            <div className="studhub-grid">
                {/* Left column */}
                <div className="studhub-left">
                    {/* 1. Placement Success Stories */}
                    <div className="sh-panel">
                        <div className="sh-panel-header">
                            <div className="sh-panel-title-group">
                                <Award size={18} className="sh-panel-icon" />
                                <h3 className="sh-panel-title">Placement Success Stories</h3>
                            </div>
                            <span className="sh-count-badge">{stories.length} Stories</span>
                        </div>

                        {stories.length === 0 ? (
                            <div className="sh-empty-state">
                                <Award size={36} style={{ color: '#cbd5e1', marginBottom: '8px' }} />
                                <p>No placement stories published yet.</p>
                                <span>Check back soon!</span>
                            </div>
                        ) : (
                            <div className="sh-stories-list">
                                {stories.map((story) => (
                                    <div key={story.id} className="sh-story-card">
                                        <div className="sh-story-top">
                                            <img
                                                src={story.avatar}
                                                alt={story.name}
                                                className="sh-story-avatar"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                            <div className="sh-story-info">
                                                <h4 className="sh-story-name">{story.name}</h4>
                                                <span
                                                    className="sh-company-badge"
                                                    style={{ backgroundColor: story.companyColor || '#eff6ff', color: story.companyTextColor || '#2563eb' }}
                                                >
                                                    {story.company}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="sh-story-body">
                                            <p className="sh-role-line" style={{ color: story.companyTextColor || '#2563eb' }}>
                                                {story.role}
                                            </p>
                                            <p className="sh-story-quote">
                                                &ldquo;{story.storyText || `Secured a ${story.role} role at ${story.company}.`}&rdquo;
                                            </p>
                                            <div className="sh-story-footer">
                                                <span className="sh-package-tag">💰 {story.packageAmt || 'Not Disclosed'}</span>
                                                <span className="sh-date-tag">📅 {story.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 2. Raise a Query */}
                    <div className="sh-panel sh-query-panel">
                        <div className="sh-panel-header">
                            <div className="sh-panel-title-group">
                                <MessageSquare size={18} className="sh-panel-icon" />
                                <h3 className="sh-panel-title">Raise a Query</h3>
                            </div>
                        </div>
                        <p className="sh-panel-subtitle">Have a question? Submit it below and our admin team will respond shortly.</p>

                        <form onSubmit={handleRaiseQuery} className="sh-query-form">
                            <div className="sh-form-group">
                                <label className="sh-form-label">Query Subject <span style={{ color: '#ef4444' }}>*</span></label>
                                <input
                                    type="text"
                                    className="sh-form-input"
                                    placeholder="e.g. TCS Drive Eligibility, Resume Upload Issue"
                                    value={querySubject}
                                    onChange={(e) => setQuerySubject(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="sh-form-group">
                                <label className="sh-form-label">Description <span style={{ color: '#ef4444' }}>*</span></label>
                                <textarea
                                    className="sh-form-textarea"
                                    placeholder="Describe your query in detail..."
                                    rows={4}
                                    value={queryMessage}
                                    onChange={(e) => setQueryMessage(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="sh-submit-btn">
                                <Plus size={16} />
                                Submit Query
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right column */}
                <div className="studhub-right">
                    {/* 3. Campus Placement Drives Widget */}
                    <div className="sh-panel campus-event-panel">
                        <div className="campus-drives-header">
                            <h3 className="event-panel-title">Campus Placement Drives</h3>
                        </div>
                        
                        <div className="next-event-card">
                            <div className="event-card-header-row">
                                <div className="event-icon-box">
                                    <Calendar className="event-purple-icon" size={20} />
                                </div>
                                <h2 className="event-company-title">{nextEvent ? `${nextEvent.company} Drive` : "Google Drive"}</h2>
                            </div>
                            
                            <div className="event-details-card-box">
                                {/* 1. DATE */}
                                <div className="event-detail-row">
                                    <div className="event-detail-icon-wrapper">
                                        <Calendar size={16} />
                                    </div>
                                    <div className="detail-item-content">
                                        <span className="detail-field-label">DATE</span>
                                        <div className="detail-badge-box">
                                            {nextEvent ? nextEvent.date : "20 Jul 2026"}
                                        </div>
                                    </div>
                                </div>

                                {/* 2. TIME */}
                                <div className="event-detail-row">
                                    <div className="event-detail-icon-wrapper">
                                        <Clock size={16} />
                                    </div>
                                    <div className="detail-item-content">
                                        <span className="detail-field-label">TIME</span>
                                        <div className="detail-badge-box">
                                            {nextEvent ? (nextEvent.time.includes("Onwards") ? nextEvent.time : `${nextEvent.time} Onwards`) : "10:00 AM Onwards"}
                                        </div>
                                    </div>
                                </div>

                                {/* 3. LOCATION */}
                                <div className="event-detail-row">
                                    <div className="event-detail-icon-wrapper">
                                        <MapPin size={16} />
                                    </div>
                                    <div className="detail-item-content">
                                        <span className="detail-field-label">LOCATION</span>
                                        <div className="detail-badge-box">
                                            {nextEvent ? nextEvent.location : "Bangalore"}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded items when View Details is clicked */}
                                {showDriveDetails && (
                                    <>
                                        {/* 4. VENUE */}
                                        <div className="event-detail-row">
                                            <div className="event-detail-icon-wrapper">
                                                <Building size={16} />
                                            </div>
                                            <div className="detail-item-content">
                                                <span className="detail-field-label">VENUE</span>
                                                <div className="detail-badge-box">
                                                    {nextEvent ? nextEvent.venue || "Seminar Hall A" : "Seminar Hall A"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 5. JOB ROLE */}
                                        <div className="event-detail-row">
                                            <div className="event-detail-icon-wrapper">
                                                <Briefcase size={16} />
                                            </div>
                                            <div className="detail-item-content">
                                                <span className="detail-field-label">JOB ROLE</span>
                                                <div className="detail-badge-box">
                                                    {nextEvent ? nextEvent.role || "SDE Intern" : "SDE Intern"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 6. DRIVE STATUS */}
                                        <div className="event-detail-row">
                                            <div className="event-detail-icon-wrapper">
                                                <CheckCircle2 size={16} />
                                            </div>
                                            <div className="detail-item-content">
                                                <span className="detail-field-label">DRIVE STATUS</span>
                                                <div>
                                                    <span className={`drive-status-pill badge-${(nextEvent?.status || 'open').toLowerCase()}`}>
                                                        {(nextEvent?.status || 'OPEN').toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 7. TARGET AUDIENCE */}
                                        <div className="event-detail-row">
                                            <div className="event-detail-icon-wrapper">
                                                <User size={16} />
                                            </div>
                                            <div className="detail-item-content">
                                                <span className="detail-field-label">TARGET AUDIENCE</span>
                                                <div className="detail-badge-box">
                                                    {nextEvent ? (nextEvent.targetStudent === 'All' || !nextEvent.targetStudent ? 'All Students' : nextEvent.targetStudent) : "All Students"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 8. ABOUT DRIVE */}
                                        <div className="event-detail-row full-width-row">
                                            <div className="event-detail-icon-wrapper">
                                                <FileText size={16} />
                                            </div>
                                            <div className="detail-item-content full-width-content">
                                                <span className="detail-field-label">ABOUT DRIVE</span>
                                                <div className="detail-about-box">
                                                    {nextEvent?.about || "Google is conducting an on-campus recruitment drive for the SDE Intern role."}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                className="btn-toggle-drive-details"
                                onClick={() => setShowDriveDetails(!showDriveDetails)}
                            >
                                {showDriveDetails ? "Hide Details" : "View Details"}
                            </button>
                        </div>
                    </div>

                    {/* 4. Query Responses Panel */}
                    <div className="sh-panel query-responses-panel">
                        <div className="sh-panel-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <div className="sh-panel-title-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MessageSquare size={18} style={{ color: '#2563eb' }} />
                                <h3 className="sh-panel-title" style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Query Responses</h3>
                            </div>
                            <span className="sh-count-badge" style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '700' }}>
                                {allQueriesList.length} Queries
                            </span>
                        </div>

                        {/* Segmented Filter Pills (Image 2) */}
                        <div className="query-filter-segment">
                            <div className="query-segment-container">
                                <button
                                    type="button"
                                    className={`query-segment-btn ${queryResponseTab === 'all' ? 'active' : ''}`}
                                    onClick={() => setQueryResponseTab('all')}
                                >
                                    All Queries ({allQueriesList.length})
                                </button>
                                <button
                                    type="button"
                                    className={`query-segment-btn ${queryResponseTab === 'resolved' ? 'active' : ''}`}
                                    onClick={() => setQueryResponseTab('resolved')}
                                >
                                    Resolved ({resolvedQueriesList.length})
                                </button>
                            </div>
                        </div>

                        {/* Query Cards List */}
                        <div className="query-responses-list">
                            {paginatedQueryResponses.length > 0 ? (
                                paginatedQueryResponses.map((query) => (
                                    <div key={query.id} className="query-response-card">
                                        <div className="query-card-header-line">
                                            <h4 className="query-card-title">{query.title || query.subject || 'Student Query'}</h4>
                                            <button
                                                type="button"
                                                className={`query-status-pill-btn ${query.status === 'resolved' ? 'resolved' : 'pending'}`}
                                                onClick={() => handleToggleResolveQuery(query.id)}
                                                title="Click to resolve query"
                                            >
                                                <CheckCircle2 size={13} />
                                                {query.status === 'resolved' ? 'Resolved' : 'Query Resolved'}
                                            </button>
                                        </div>

                                        {/* Admin Reply Box (Green Box from Image 1) */}
                                        <div className="admin-reply-box">
                                            <span className="reply-header-label">ADMIN REPLY:</span>
                                            <p className="reply-text-content">
                                                {query.reply || query.adminReply || "Please clear your browser cache and upload a PDF under 5MB. Contact support if it persists."}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="sh-empty-state">
                                    <p>No {queryResponseTab === 'resolved' ? 'resolved' : ''} queries found.</p>
                                </div>
                            )}
                        </div>

                        {/* Independent Pagination Control */}
                        <div className="stories-pagination-footer" style={{ paddingBottom: '20px' }}>
                            <button
                                type="button"
                                className="stories-nav-btn"
                                onClick={() => handlePageChange(Math.max(currentPageNum - 1, 1))}
                                disabled={currentPageNum === 1}
                            >
                                &larr; Prev
                            </button>

                            <span className="stories-page-info">
                                Page {currentPageNum} of {totalQueryPages}
                            </span>

                            <button
                                type="button"
                                className="stories-nav-btn"
                                onClick={() => handlePageChange(Math.min(currentPageNum + 1, totalQueryPages))}
                                disabled={currentPageNum === totalQueryPages}
                            >
                                Next &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
