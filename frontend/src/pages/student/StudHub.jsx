import { useState, useEffect } from "react";
import { getStudentQueries, submitStudentQuery, resolveStudentQuery, getStudentPlacementStories, getStudentPlacementDrives } from '../../auth/authService';
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
    XCircle,
    User
} from "lucide-react";
import "./StudHub.css";

// Default fallback mock data for Placement Drives
const initialDrives = [];

// Default fallback mock data for Placement Stories
const initialStories = [];

// Default fallback mock data for Student Queries & Responses
const initialStudentQueries = [];

export default function StudHub() {
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    const [showDriveDetails, setShowDriveDetails] = useState(false);

    const [drives, setDrives] = useState(initialDrives);

    // Filter drives targeted to this student
    const studentEmail = (loggedInUser.email || "").toLowerCase().trim();
    const studentName = (loggedInUser.fullName || loggedInUser.name || "").toLowerCase().trim();
    const studentFilteredDrives = drives.filter(drive => {
        let targets = drive.targetStudent || [];
        if (typeof targets === 'string') {
            targets = targets.split(',').map(t => t.trim());
        }
        
        const lowerTargets = targets.map(t => typeof t === 'string' ? t.toLowerCase().trim() : '');

        if (lowerTargets.length === 0 || lowerTargets.includes("") || lowerTargets.includes("all")) {
            return true;
        }
        
        const matchEmail = studentEmail !== "" && lowerTargets.some(t => studentEmail.includes(t));
        const matchName = studentName !== "" && lowerTargets.some(t => studentName.includes(t));

        return matchEmail || matchName;
    });

    const activeDrives = studentFilteredDrives.filter(d => d.status === 'open' || d.status === 'upcoming');

    const [stories, setStories] = useState(initialStories);
    const [storiesPage, setStoriesPage] = useState(1);
    const STORIES_PER_PAGE = 2;
    const totalStoriesPages = Math.ceil(stories.length / STORIES_PER_PAGE) || 1;
    const paginatedStories = stories.slice((storiesPage - 1) * STORIES_PER_PAGE, storiesPage * STORIES_PER_PAGE);

    // Drives list & pagination
    let drivesList = initialDrives;
    if (activeDrives.length > 0) {
        drivesList = activeDrives;
    } else if (studentFilteredDrives.length > 0) {
        drivesList = studentFilteredDrives;
    }
    const [drivesPage, setDrivesPage] = useState(1);
    const totalDrivePages = drivesList.length;
    const currentDrive = drivesList.length > 0 ? drivesList[Math.min(drivesPage - 1, drivesList.length - 1)] : null;

    // Queries state
    const [queries, setQueries] = useState(() => {
        const stored = localStorage.getItem("student_queries");
        return stored && JSON.parse(stored).length > 0 ? JSON.parse(stored) : initialStudentQueries;
    });

    useEffect(() => {
        const fetchQueries = async () => {
            try {
                const response = await getStudentQueries();
                if (response.data && Array.isArray(response.data)) {
                    const mappedQueries = response.data.map(q => ({
                        id: q.id,
                        title: q.subject,
                        message: q.description,
                        status: q.status ? q.status.toLowerCase() : 'pending',
                        reply: q.adminReply || '',
                        date: (() => {
                            try {
                                if (!q.createdAt) return new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '');
                                if (Array.isArray(q.createdAt)) {
                                    if (q.createdAt.length >= 5) {
                                        const utcDate = new Date(Date.UTC(q.createdAt[0], q.createdAt[1] - 1, q.createdAt[2], q.createdAt[3], q.createdAt[4]));
                                        return utcDate.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '');
                                    }
                                    return new Date(q.createdAt[0], q.createdAt[1] - 1, q.createdAt[2]).toLocaleDateString();
                                }
                                const dateStr = q.createdAt;
                                const ddMmYyyyMatch = typeof dateStr === 'string' && /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/.exec(dateStr);
                                if (ddMmYyyyMatch) {
                                    const [, day, month, year, hour, minute] = ddMmYyyyMatch;
                                    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
                                    return utcDate.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '');
                                }
                                const parsed = new Date(dateStr);
                                if (Number.isNaN(parsed)) return typeof dateStr === 'string' ? dateStr.split('T')[0] : "Recently";
                                return parsed.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '');
                            } catch {
                                return "Recently";
                            }
                        })()
                    }));
                    // Sort so newest is first
                    mappedQueries.sort((a, b) => b.id - a.id);
                    setQueries(mappedQueries);
                }
            } catch (error) {
                console.error("Failed to fetch student queries:", error);
            }
        };
        fetchQueries();
    }, []);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await getStudentPlacementStories();
                if (response.data && Array.isArray(response.data)) {
                    const mappedStories = response.data.map(story => {
                        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.studentName)}&background=2563eb&color=fff`;
                        return {
                            id: story.id,
                            name: story.studentName,
                            avatar: story.photoPath || avatarUrl,
                            company: story.companyName,
                            companyColor: '#eff6ff',
                            companyTextColor: '#2563eb',
                            role: story.jobRole,
                            packageAmt: story.packageLpa ? `${story.packageLpa} LPA` : 'Not Disclosed',
                            storyText: story.successStory,
                            date: (() => {
                                try {
                                    if (!story.createdAt) return new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '');
                                    if (Array.isArray(story.createdAt)) {
                                        if (story.createdAt.length >= 5) {
                                            const utcDate = new Date(Date.UTC(story.createdAt[0], story.createdAt[1] - 1, story.createdAt[2], story.createdAt[3], story.createdAt[4]));
                                            return utcDate.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '');
                                        }
                                        return new Date(story.createdAt[0], story.createdAt[1] - 1, story.createdAt[2]).toLocaleDateString();
                                    }
                                    const dateStr = story.createdAt;
                                    const ddMmYyyyMatch = typeof dateStr === 'string' && /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/.exec(dateStr);
                                    if (ddMmYyyyMatch) {
                                        const [, day, month, year, hour, minute] = ddMmYyyyMatch;
                                        const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
                                        return utcDate.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '');
                                    }
                                    const parsed = new Date(dateStr);
                                    if (Number.isNaN(parsed)) return typeof dateStr === 'string' ? dateStr.split('T')[0] : "Recently";
                                    return parsed.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', '');
                                } catch {
                                    return "Recently";
                                }
                            })()
                        };
                    });
                    mappedStories.sort((a, b) => b.id - a.id);
                    setStories(mappedStories);
                }
            } catch (error) {
                console.error("Failed to fetch placement stories:", error);
            }
        };

        const fetchDrives = async () => {
            try {
                const response = await getStudentPlacementDrives();
                if (response.data && Array.isArray(response.data)) {
                    const mappedDrives = response.data.map(d => {
                        let targets = [];
                        if (Array.isArray(d.targetStudent)) {
                            targets = [...d.targetStudent];
                        } else if (typeof d.targetStudent === 'string') {
                            targets = d.targetStudent.split(',').map(t => t.trim()).filter(Boolean);
                        }
                        if (d.specificStudentName && d.specificStudentName.trim() !== '') {
                            targets.push(d.specificStudentName.trim());
                        }

                        return {
                            id: d.id,
                            company: d.companyName,
                            role: d.jobRole,
                            location: d.location,
                            date: d.driveDate,
                            time: d.driveTime || 'TBA',
                            venue: d.venue || 'TBA',
                            eligibility: d.eligibilityCriteria || 'Not Specified',
                            status: (d.status || 'Upcoming').toLowerCase(),
                            logoLetter: d.companyName ? d.companyName.charAt(0).toUpperCase() : 'C',
                            logoColor: '#2563eb',
                            targetStudent: targets.length > 0 ? targets : 'all'
                        };
                    });
                    mappedDrives.sort((a, b) => b.id - a.id);
                    setDrives(mappedDrives);
                }
            } catch (error) {
                console.error("Failed to fetch placement drives:", error);
            }
        };

        fetchStories();
        fetchDrives();
    }, []);

    // Sync queries back to localStorage
    useEffect(() => {
        localStorage.setItem("student_queries", JSON.stringify(queries));
    }, [queries]);

    // Query Form state
    const [querySubject, setQuerySubject] = useState("");
    const [queryMessage, setQueryMessage] = useState("");

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

    const handleRaiseQuery = async (e) => {
        e.preventDefault();
        if (!querySubject.trim() || !queryMessage.trim()) return;

        try {
            const payload = {
                subject: querySubject,
                description: queryMessage
            };

            const response = await submitStudentQuery(payload);
            const createdQuery = response.data || { ...payload, id: Date.now(), createdAt: new Date() };

            const newQuery = {
                id: createdQuery.id,
                title: createdQuery.subject,
                message: createdQuery.description,
                status: 'pending',
                reply: 'Your query has been submitted. Admin team will respond shortly.',
                date: new Date(createdQuery.createdAt || new Date()).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
            };

            setQueries(prev => [newQuery, ...prev]);
            setQuerySubject("");
            setQueryMessage("");
            triggerToast("Query submitted successfully! Admin will respond shortly.", "success");
        } catch (error) {
            console.error("Failed to submit query:", error);
            triggerToast("Failed to submit query. Please try again.", "error");
        }
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

    const handleResolveQuery = async (queryId) => {
        try {
            await resolveStudentQuery(queryId);
            setQueries(prev => {
                const updated = prev.map(q => {
                    if (q.id === queryId) {
                        return { ...q, status: 'resolved' };
                    }
                    return q;
                });
                return updated;
            });
            triggerToast("Query marked as resolved!", "success");
        } catch (error) {
            console.error("Failed to resolve query:", error);
            triggerToast("Failed to resolve query.", "error");
        }
    };

    let formattedTime = 'TBA';
    let formattedTarget = 'All Students';

    if (currentDrive) {
        if (currentDrive.time) {
            formattedTime = currentDrive.time.includes("Onwards") ? currentDrive.time : `${currentDrive.time} Onwards`;
        }
        
        if (currentDrive.targetStudent) {
            if (Array.isArray(currentDrive.targetStudent)) {
                formattedTarget = (currentDrive.targetStudent.includes('ALL') || currentDrive.targetStudent.includes('All')) ? 'All Students' : currentDrive.targetStudent.join(', ');
            } else {
                formattedTarget = currentDrive.targetStudent === 'All' ? 'All Students' : currentDrive.targetStudent;
            }
        }
    }

    return (
        <div className="studhub-container">

            <div className="studhub-banner">
                <div className="studhub-banner-text">
                    <h2>Stud Hub <span>🚀</span></h2>
                    <p>Stay updated with placement stories, upcoming campus drives, and raise your queries — all in one place.</p>
                </div>
                <div className="welcome-date-badge">
                    <span>📅 {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
            </div>


            <div className="studhub-grid">

                <div className="studhub-left">

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
                            <>
                                <div className="sh-stories-list">
                                    {paginatedStories.map((story) => (
                                        <div key={story.id} className="sh-story-card">
                                            <div className="sh-story-top">
                                                <img
                                                    src={story.avatar}
                                                    alt={story.name}
                                                    className="sh-story-avatar"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.name)}&background=2563eb&color=fff`;
                                                    }}
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


                                {totalStoriesPages > 1 && (
                                    <div className="sh-pagination-wrapper">
                                        <button
                                            type="button"
                                            className="stories-nav-btn"
                                            onClick={() => setStoriesPage(prev => Math.max(prev - 1, 1))}
                                            disabled={storiesPage === 1}
                                        >
                                            &larr; Prev
                                        </button>
                                        <span className="stories-page-info">
                                            Page {storiesPage} of {totalStoriesPages}
                                        </span>
                                        <button
                                            type="button"
                                            className="stories-nav-btn"
                                            onClick={() => setStoriesPage(prev => Math.min(prev + 1, totalStoriesPages))}
                                            disabled={storiesPage === totalStoriesPages}
                                        >
                                            Next &rarr;
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>


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
                                <label htmlFor="query-subject" className="sh-form-label">Query Subject <span style={{ color: '#ef4444' }}>*</span></label>
                                <input
                                    id="query-subject"
                                    type="text"
                                    className="sh-form-input"
                                    placeholder="e.g. TCS Drive Eligibility, Resume Upload Issue"
                                    value={querySubject}
                                    onChange={(e) => setQuerySubject(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="sh-form-group">
                                <label htmlFor="query-description" className="sh-form-label">Description <span style={{ color: '#ef4444' }}>*</span></label>
                                <textarea
                                    id="query-description"
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


                <div className="studhub-right">

                    <div className="sh-panel campus-event-panel">
                        <div className="campus-drives-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 className="event-panel-title">Campus Placement Drives</h3>
                            <span className="sh-count-badge" style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '700' }}>
                                {totalDrivePages} {totalDrivePages === 1 ? 'Drive' : 'Drives'}
                            </span>
                        </div>
                        
                        {currentDrive ? (
                            <div className="next-event-card">
                                <div className="event-card-header-row">
                                    <div className="event-icon-box">
                                        {currentDrive?.logo ? (
                                            <img
                                                src={currentDrive.logo}
                                                alt={currentDrive.company}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    objectFit: 'contain',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e2e8f0',
                                                    background: '#ffffff',
                                                    padding: '3px'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'block';
                                                }}
                                            />
                                        ) : null}
                                        <Calendar className="event-purple-icon" size={20} style={{ display: currentDrive?.logo ? 'none' : 'block' }} />
                                    </div>
                                    <h2 className="event-company-title">{currentDrive.company} Drive</h2>
                                </div>
                                
                                <div className="event-details-card-box">

                                    <div className="event-detail-row">
                                        <div className="event-detail-icon-wrapper">
                                            <Calendar size={16} />
                                        </div>
                                        <div className="detail-item-content">
                                            <span className="detail-field-label">DATE</span>
                                            <div className="detail-badge-box">
                                                {currentDrive.date || 'TBA'}
                                            </div>
                                        </div>
                                    </div>


                                    <div className="event-detail-row">
                                        <div className="event-detail-icon-wrapper">
                                            <Clock size={16} />
                                        </div>
                                        <div className="detail-item-content">
                                            <span className="detail-field-label">TIME</span>
                                            <div className="detail-badge-box">
                                                {formattedTime}
                                            </div>
                                        </div>
                                    </div>


                                    <div className="event-detail-row">
                                        <div className="event-detail-icon-wrapper">
                                            <MapPin size={16} />
                                        </div>
                                        <div className="detail-item-content">
                                            <span className="detail-field-label">LOCATION</span>
                                            <div className="detail-badge-box">
                                                {currentDrive.location || 'TBA'}
                                            </div>
                                        </div>
                                    </div>


                                    {showDriveDetails && (
                                        <>

                                            <div className="event-detail-row">
                                                <div className="event-detail-icon-wrapper">
                                                    <Building size={16} />
                                                </div>
                                                <div className="detail-item-content">
                                                    <span className="detail-field-label">VENUE</span>
                                                    <div className="detail-badge-box">
                                                        {currentDrive.venue || "TBA"}
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="event-detail-row">
                                                <div className="event-detail-icon-wrapper">
                                                    <Briefcase size={16} />
                                                </div>
                                                <div className="detail-item-content">
                                                    <span className="detail-field-label">JOB ROLE</span>
                                                    <div className="detail-badge-box">
                                                        {currentDrive.role || "TBA"}
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="event-detail-row">
                                                <div className="event-detail-icon-wrapper">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                                <div className="detail-item-content">
                                                    <span className="detail-field-label">DRIVE STATUS</span>
                                                    <div>
                                                        <span className={`drive-status-pill badge-${(currentDrive.status || 'open').toLowerCase()}`}>
                                                            {(currentDrive.status || 'OPEN').toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>


                                            <div className="event-detail-row">
                                                <div className="event-detail-icon-wrapper">
                                                    <User size={16} />
                                                </div>
                                                <div className="detail-item-content">
                                                    <span className="detail-field-label">TARGET AUDIENCE</span>
                                                    <div className="detail-badge-box">
                                                        {formattedTarget}
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


                                {totalDrivePages > 1 && (
                                    <div className="sh-pagination-wrapper" style={{ marginTop: '16px' }}>
                                        <button
                                            type="button"
                                            className="stories-nav-btn"
                                            onClick={() => setDrivesPage(prev => Math.max(prev - 1, 1))}
                                            disabled={drivesPage === 1}
                                        >
                                            &larr; Prev Drive
                                        </button>
                                        <span className="stories-page-info">
                                            Drive {drivesPage} of {totalDrivePages}
                                        </span>
                                        <button
                                            type="button"
                                            className="stories-nav-btn"
                                            onClick={() => setDrivesPage(prev => Math.min(prev + 1, totalDrivePages))}
                                            disabled={drivesPage === totalDrivePages}
                                        >
                                            Next Drive &rarr;
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="no-events-placeholder" style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                                No upcoming campus placement drives.
                            </div>
                        )}
                    </div>


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


                        <div className="query-responses-list">
                            {paginatedQueryResponses.length > 0 ? (
                                paginatedQueryResponses.map((query) => (
                                    <div key={query.id} className="query-response-card">
                                        <div className="query-card-header-line">
                                            <h4 className="query-card-title">{query.title || query.subject || 'Student Query'}</h4>
                                            <div className="query-status-action-wrapper">
                                                {query.status !== 'resolved' && (
                                                    <div className="query-click-popup">
                                                        Click to mark resolved &rarr;
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    className={`query-status-pill-btn ${query.status === 'resolved' ? 'resolved' : 'pending'}`}
                                                    onClick={() => handleResolveQuery(query.id)}
                                                    disabled={query.status === 'resolved'}
                                                    title={query.status === 'resolved' ? 'Resolved' : 'Click to mark query as resolved'}
                                                >
                                                    <CheckCircle2 size={13} />
                                                    {query.status === 'resolved' ? 'Resolved' : 'Query Resolved'}
                                                </button>
                                            </div>
                                        </div>


                                        { (query.reply || query.adminReply) && (
                                            <div className="admin-reply-box">
                                                <span className="reply-header-label">ADMIN REPLY:</span>
                                                <p className="reply-text-content">
                                                    {query.reply || query.adminReply}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="sh-empty-state">
                                    <p>No {queryResponseTab === 'resolved' ? 'resolved' : ''} queries found.</p>
                                </div>
                            )}
                        </div>


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
