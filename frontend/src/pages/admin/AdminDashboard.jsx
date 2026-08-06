import { motion, AnimatePresence } from 'framer-motion';

import { useState, useEffect, useRef } from 'react';
import './AdminDashboard.css';
import StudentAnalytics from './StudentAnalytics';
import QueriesStories from './QueriesStories';
import { createJobPosting, getDrafts, getDraftById, publishDraft, getAdminProfile, updateAdminProfile, getAdminRecentPosts, changePassword, getAdminApplicantsMatching, getAdminNotifications, markAllAdminNotificationsAsRead, getAdminUnreadCount, getAdminStudentAnalyticsDashboard } from '../../auth/authService';
import {
    GraduationCap,
    Bell,
    Briefcase,
    Users,
    FileText,
    Plus,
    Search,
    ChevronDown,
    X,
    User,
    Lock,
    LogOut,
    Calendar,
    Eye,
    EyeOff,
    Edit3,
} from 'lucide-react';



/** Parses a DD/MM/YYYY date string + 12-hour time string into a timestamp for sorting. */
function parseDateStr(dateStr, timeStr) {
    if (!dateStr) return 0;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return new Date(dateStr).getTime() || 0;
    const numDay = Number.parseInt(parts[0], 10);
    const numMonth = Number.parseInt(parts[1], 10);
    const numYear = Number.parseInt(parts[2], 10);
    if (!numDay || !numMonth || !numYear) return 0;

    let numHours = 0;
    let numMinutes = 0;

    if (timeStr) {
        const match = /^(\d{1,2}):(\d{1,2})\s*([AP]M)$/i.exec(timeStr);
        if (match) {
            const [, rawH, rawM, ampm] = match;
            let h = Number.parseInt(rawH, 10);
            const m = Number.parseInt(rawM, 10);
            const upperAmPm = ampm.toUpperCase();
            if (upperAmPm === 'PM' && h < 12) h += 12;
            if (upperAmPm === 'AM' && h === 12) h = 0;
            numHours = h;
            numMinutes = m;
        }
    }
    const utcDate = new Date(Date.UTC(numYear, numMonth - 1, numDay, numHours, numMinutes));
    return utcDate.getTime();
}

/*Converts a backend notification's raw date/time fields into localised display strings. */
function localizeNotification(notif) {
    if (!notif.createdDate || !notif.createdTime) return notif;
    const [day, month, year] = notif.createdDate.split('/');
    const match = /^(\d{1,2}):(\d{1,2})\s*([AP]M)$/i.exec(notif.createdTime);
    if (!day || !month || !year || !match) return notif;
    const [, rawH, rawM, ampm] = match;
    const numYear = Number.parseInt(year, 10);
    const numMonth = Number.parseInt(month, 10);
    const numDay = Number.parseInt(day, 10);
    let h = Number.parseInt(rawH, 10);
    const m = Number.parseInt(rawM, 10);
    const upperAmPm = ampm.toUpperCase();
    if (upperAmPm === 'PM' && h < 12) h += 12;
    if (upperAmPm === 'AM' && h === 12) h = 0;
    const utcDate = new Date(Date.UTC(numYear, numMonth - 1, numDay, h, m));
    notif.displayDate = utcDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    notif.displayTime = utcDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return notif;
}

/*Converts a YYYY-MM-DD deadline from the date-picker into the DD-MM-YYY */
function formatApiDeadline(deadline) {
    if (!deadline) return '2026-08-24';
    if (/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
        return deadline;
    }
    const parts = deadline.split('-');
    if (parts.length === 3) {
        const [first, month, last] = parts;
        if (first.length === 2 && last.length === 4) {
            return `${last}-${month}-${first}`;
        }
    }
    return deadline;
}

/** Formats a YYYY-MM-DD or ISO deadline string into a human-readable DD Mmm YYYY format. */
function formatDeadline(dateStr) {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return dateStr;
    }
}

/** Sanitizes string input for DOM storage compliance (S8475). */
function sanitizeStorageString(val) {
    if (val === null || val === undefined) return '';
    let str = String(val);
    try {
        if (str.includes('%')) {
            str = decodeURIComponent(str);
        }
    } catch {
        // Fallback
    }
    const cleanStr = str.replace(/<[^>]*>?/g, '').replace(/[<>'"]/g, '').trim();
    return cleanStr;
}



/** Updates the admin_profiles list in localStorage so that the password autofill stays in sync. */
function updateAdminPasswordInStorage(adminEmail, newPassword) {
    const rawData = localStorage.getItem('admin_profiles');
    let adminProfiles = [];
    if (rawData) {
        try {
            const parsed = JSON.parse(rawData);
            if (Array.isArray(parsed)) adminProfiles = parsed;
        } catch {
            adminProfiles = [];
        }
    }
    const cleanEmail = sanitizeStorageString(adminEmail).toLowerCase();
    const cleanPass = sanitizeStorageString(newPassword);
    let adminFound = false;
    const updatedAdmins = adminProfiles.map(p => {
        const pEmail = sanitizeStorageString(p.email).toLowerCase();
        const pPass = sanitizeStorageString(p.password);
        if (pEmail && pEmail === cleanEmail) {
            adminFound = true;
            return { email: cleanEmail, password: cleanPass };
        }
        return { email: pEmail, password: pPass };
    });
    if (!adminFound && cleanEmail) {
        updatedAdmins.push({ email: cleanEmail, password: cleanPass });
    }
    localStorage.setItem('admin_profiles', JSON.stringify(updatedAdmins));
}

/** Returns a favicon-based company logo element with a fallback initial letter. */
function getCompanyLogo(company) {
    const domainMap = {
        'google': 'google.com', 'microsoft': 'microsoft.com', 'amazon': 'amazon.com',
        'infosys': 'infosys.com', 'tcs': 'tcs.com', 'wipro': 'wipro.com',
        'cognizant': 'cognizant.com', 'ibm': 'ibm.com', 'accenture': 'accenture.com',
        'capgemini': 'capgemini.com', 'deloitte': 'deloitte.com', 'oracle': 'oracle.com',
        'sap': 'sap.com', 'meta': 'meta.com', 'apple': 'apple.com', 'uber': 'uber.com',
        'flipkart': 'flipkart.com', 'zoho': 'zoho.com', 'freshworks': 'freshworks.com',
    };
    const lower = company.toLowerCase().trim();
    const domain = domainMap[lower] || `${lower.replace(/\s+/g, '')}.com`;
    const logoUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    return (
        <div style={{ position: 'relative', width: '28px', height: '28px', flexShrink: 0 }}>
            <img
                src={logoUrl}
                alt={company}
                style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', padding: '2px', display: 'block' }}
                onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                }}
            />
            <div className="company-logo default-logo" style={{ display: 'none', position: 'absolute', top: 0, left: 0, width: '28px', height: '28px' }}>
                {company.charAt(0).toUpperCase()}
            </div>
        </div>
    );
}

/** Pure helper: filters and sorts the applicants list based on current search/filter state. */
function filterAndSortApplicants(applicants, searchTerm, filterBy, filterDate, filterCompany) {
    let result = [...applicants];

    if (searchTerm.trim() !== '') {
        const lower = searchTerm.toLowerCase();
        result = result.filter(app =>
            app.name.toLowerCase().includes(lower) ||
            app.company.toLowerCase().includes(lower)
        );
    }

    const filterByLower = filterBy.toLowerCase();
    if (filterByLower === 'by company name') {
        if (filterCompany.trim() !== '') {
            result = result.filter(app =>
                app.company.toLowerCase().includes(filterCompany.toLowerCase())
            );
        }
        result.sort((a, b) => a.company.localeCompare(b.company));
    } else if (filterByLower === 'by date') {
        if (filterDate) {
            result = result.filter(app => app.date === filterDate);
        }
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
        result.sort((a, b) => b.match - a.match);
    }

    return result;
}


// --- Sub-components extracted to keep cognitive complexity low for SonarQube ---  

function AdminHeader({
    activeTab,
    setActiveTab,
    unreadCount,
    isProfileOpen,
    setIsProfileOpen,
    adminProfile,
    setIsNotificationSidebarOpen,
    setProfileTab,
    setIsEditingProfile,
    setValidationError,
    setIsProfileModalOpen,
    onNavigate
}) {
    return (
        <header className='admin-header'>
            <div className={activeTab === 'analytics' || activeTab === 'queries' ? 'analytics-header-container' : 'header-container'}>
                <div className='logo-section' style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <GraduationCap className='logo-icon' size={28} style={{ color: '#2563eb' }} />
                    <span className='college-name' style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2563eb' }}>Campus_Hire</span>
                </div>

                <nav className='navbar-menu-list' style={{ display: 'flex', gap: '24px', alignItems: 'center', margin: '0 auto' }}>
                    {[
                        { id: 'dashboard', label: 'Dashboard' },
                        { id: 'analytics', label: 'Student Analytics' },
                        { id: 'queries', label: 'Queries & Stories' }
                    ].map(item => (
                        <button
                            type="button"
                            key={item.id}
                            className={`navbar-menu-btn ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                color: activeTab === item.id ? '#2563eb' : '#64748b',
                                fontWeight: activeTab === item.id ? '600' : '500',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                padding: '8px 0',
                                position: 'relative',
                                transition: 'color 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <span>{item.label}</span>
                            {activeTab === item.id && (
                                <span style={{
                                    position: 'absolute',
                                    bottom: '-6px',
                                    left: 0,
                                    right: 0,
                                    height: '2px',
                                    backgroundColor: '#2563eb',
                                    borderRadius: '2px'
                                }} />
                            )}
                        </button>
                    ))}
                </nav>

                <div className='header-right'>
                    <span className='role-badge'>Admin</span>

                    <button
                        type="button"
                        className='notification-wrapper'
                        aria-label="Notifications"
                        onClick={() => {
                            setIsNotificationSidebarOpen(true);
                            setIsProfileOpen(false);
                        }}
                        style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                    >
                        <motion.div style={{ display: 'flex' }} whileHover={{ rotate: [0, -15, 15, -15, 15, 0] }} transition={{ duration: 0.5 }}>
                            <Bell className='bell-icon' size={22} />
                        </motion.div>
                        {unreadCount > 0 && (
                            <motion.span
                                className='notification-badge'
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                style={{ width: '16px', height: '16px', borderRadius: '50%', right: '-2px', top: '-2px', fontSize: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {unreadCount}
                            </motion.span>
                        )}
                    </button>

                    <div className='user-profile-container'>
                        <button
                            type="button"
                            className={`user-avatar ${isProfileOpen ? 'active' : ''}`}
                            aria-label="User profile menu"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            style={{ border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                            {adminProfile.name ? adminProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'}
                        </button>

                        {isProfileOpen && (
                            <>
                                <button type="button" className='profile-dropdown-backdrop' aria-label="Close profile menu" onClick={() => setIsProfileOpen(false)} style={{ border: 'none', padding: 0 }} />
                                <div className='profile-dropdown-menu'>
                                    <div className='profile-header'>
                                        <span className='profile-avatar-large'>
                                            {adminProfile.name ? adminProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AD'}
                                        </span>
                                        <div className='profile-meta-info'>
                                            <span className='profile-name'>{adminProfile.name}</span>
                                            <span className='profile-email'>{adminProfile.email}</span>
                                        </div>
                                    </div>

                                    <div className='profile-divider' />

                                    <div className='profile-options-list'>
                                        <button type="button" className='profile-option-btn' onClick={() => { setIsProfileOpen(false); setProfileTab('edit'); setIsEditingProfile(false); setValidationError(false); setIsProfileModalOpen(true); }}>
                                            <User size={16} />
                                            <span>View Profile</span>
                                        </button>

                                        <button type="button" className='profile-option-btn' onClick={() => { setIsProfileOpen(false); setProfileTab('password'); setValidationError(false); setIsProfileModalOpen(true); }}>
                                            <Lock size={16} />
                                            <span>Change Password</span>
                                        </button>

                                        <div className='profile-divider' />

                                        <button type="button" className='profile-option-btn logout-btn' onClick={() => {
                                            setIsProfileOpen(false);
                                            localStorage.removeItem("token");
                                            localStorage.removeItem("user");
                                            localStorage.removeItem("role");
                                            onNavigate('login');
                                        }}>
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

function formatGrowthText(stats, fieldName) {
    if (!stats) return 'Loading...';
    const val = stats[fieldName];
    if (val === undefined || val === null) return 'Loading...';
    const prefix = val >= 0 ? '+' : '';
    return `${prefix}${val}% from last month`;
}

function AdminStatsGrid({ dashboardStats }) {
    return (
        <section className='stats-grid'>
            <motion.div className='stat-card'
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}>
                <div className='stat-icon-wrapper blue-icon'>
                    <FileText size={20} />
                </div>
                <div className='stat-details'>
                    <span className='stat-label'>Active Posting</span>
                    <h3 className='stat-value'>{dashboardStats ? dashboardStats.totalActivePosts : '-'}</h3>
                    <span className='stat-trend'>
                        <span className='trend-subtext'>
                            {formatGrowthText(dashboardStats, 'activePostsGrowth')}
                        </span>
                    </span>
                </div>
            </motion.div>

            <motion.div className='stat-card'
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}>
                <div className='stat-icon-wrapper green-icon'>
                    <Users size={20} />
                </div>
                <div className='stat-details'>
                    <span className='stat-label'>Total Students</span>
                    <h3 className='stat-value'>{dashboardStats ? dashboardStats.totalStudents : '-'}</h3>
                    <span className='stat-trend'>
                        <span className='trend-subtext'>
                            {formatGrowthText(dashboardStats, 'studentGrowth')}
                        </span>
                    </span>
                </div>
            </motion.div>

            <motion.div className='stat-card'
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}>
                <div className='stat-icon-wrapper purple-icon'>
                    <Briefcase size={20} />
                </div>
                <div className='stat-details'>
                    <span className='stat-label'>Resume Received</span>
                    <h3 className='stat-value'>{dashboardStats ? dashboardStats.totalResumeReceived : '-'}</h3>
                    <span className='stat-trend'>
                        <span className='trend-subtext'>
                            {formatGrowthText(dashboardStats, 'resumeGrowth')}
                        </span>
                    </span>
                </div>
            </motion.div>
        </section>
    );
}

function RecentPostingsCard({
    drafts,
    paginatedDrafts,
    draftsCurrentPage,
    totalDraftsPages,
    setDraftsCurrentPage,
    handleEditDraft,
    handlePublishDraft,
    paginatedRecentPosts,
    jobsCurrentPage,
    totalJobsPages,
    setJobsCurrentPage,
    setValidationError,
    setIsSidebarOpen
}) {
    return (
        <div className='lower-left-column'>
            <motion.div className='card-box posting-management-card'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}>
                <div className='card-box-header'>
                    <h4>Placement Posting Management</h4>
                    <button type="button" className='btn-primary' onClick={() => { setValidationError(false); setIsSidebarOpen(true); }}>
                        <Plus size={16} />
                        Create New Job Posting
                    </button>
                </div>

                <div className='drafts-list'>
                    <div className='drafts-section-header'>
                        <h5>Saved Drafts ({drafts.length})</h5>
                    </div>

                    {paginatedDrafts && paginatedDrafts.length > 0 ? (
                        paginatedDrafts.map(draft => (
                            <div key={draft.id} className='draft-item'>
                                <div className='draft-info'>
                                    <span className='badge-draft'>Draft</span>
                                    <div>
                                        <h6>{draft.title}</h6>
                                        <p className='draft-company'>{draft.company} • Saved {draft.lastSaved}</p>
                                    </div>
                                </div>

                                <div className='draft-actions'>
                                    <button
                                        type="button"
                                        className='btn-resume-draft'
                                        onClick={() => handleEditDraft(draft.id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className='btn-publish-draft'
                                        onClick={() => handlePublishDraft(draft.id)}
                                    >
                                        Publish
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '12px 0' }}>No drafts saved.</p>
                    )}

                    {totalDraftsPages > 1 && (
                        <div className='pagination-controls' style={{ marginTop: '12px', gap: '6px', justifyContent: 'center' }}>
                            <button
                                type="button"
                                className='btn-pagination'
                                disabled={draftsCurrentPage === 1}
                                onClick={() => setDraftsCurrentPage(prev => Math.max(prev - 1, 1))}
                                title="Previous Page"
                            >
                                &larr;
                            </button>

                            {Array.from({ length: totalDraftsPages }, (_, i) => i + 1).map(pageNum => (
                                <button
                                    key={pageNum}
                                    type="button"
                                    className={`btn-page-number ${draftsCurrentPage === pageNum ? 'active' : ''}`}
                                    onClick={() => setDraftsCurrentPage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            ))}

                            <button
                                type="button"
                                className='btn-pagination'
                                disabled={draftsCurrentPage === totalDraftsPages || totalDraftsPages === 0}
                                onClick={() => setDraftsCurrentPage(prev => Math.min(prev + 1, totalDraftsPages))}
                                title="Next Page"
                            >
                                &rarr;
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            <motion.div className='card-box recent-postings-card'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}>
                <div className='card-box-header'>
                    <h4>Recent Postings</h4>
                </div>

                <div className='postings-list'>
                    {paginatedRecentPosts && paginatedRecentPosts.length > 0 ? (
                        paginatedRecentPosts.map((post, index) => (
                            <motion.div key={post.id || `${post.companyName || 'post'}-${post.jobRole || index}`} className='posting-card-item'
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08, type: "spring", stiffness: 300, damping: 24 }}>

                                <div className='posting-card-logo-wrap'>
                                    {post.companyName ? (
                                        <img
                                            src={post.logoUrl || `https://www.google.com/s2/favicons?domain=${post.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com&sz=128`}
                                            alt={post.companyName}
                                            style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className='posting-logo-fallback'>
                                            <Briefcase size={18} />
                                        </div>
                                    )}
                                </div>

                                <div className='posting-card-body'>
                                    <h5 className='posting-card-title'>{post.companyName}</h5>
                                    <div className='posting-info-rows'>
                                        {post.location && (
                                            <div className='posting-info-row'>
                                                <span className='posting-info-icon'>📍</span>
                                                <span className='posting-info-label'>Location</span>
                                                <span className='posting-info-sep'>:</span>
                                                <span className='posting-info-value'>{post.location}</span>
                                            </div>
                                        )}
                                        <div className='posting-info-row'>
                                            <span className='posting-info-icon'>👤</span>
                                            <span className='posting-info-label'>Job Role</span>
                                            <span className='posting-info-sep'>:</span>
                                            <span className='posting-info-value'>{post.jobRole}</span>
                                        </div>
                                        {post.deadline && (
                                            <div className='posting-info-row'>
                                                <span className='posting-info-icon'>📅</span>
                                                <span className='posting-info-label'>Deadline</span>
                                                <span className='posting-info-sep'>:</span>
                                                <span className='posting-info-value posting-info-deadline'>{formatDeadline(post.deadline)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className='posting-card-status'>
                                    {post.status?.toLowerCase() === 'expired' ? (
                                        <span className='badge-expired'>Expired</span>
                                    ) : (
                                        <span className='badge-active'>{post.status || 'Active'}</span>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className='no-postings'>No recent postings found.</div>
                    )}
                </div>

                <div className='pagination-controls'>
                    <button
                        type="button"
                        className='btn-pagination'
                        disabled={jobsCurrentPage === 1}
                        onClick={() => setJobsCurrentPage(prev => prev - 1)}
                    >
                        Previous
                    </button>
                    <span className='pagination-info'>
                        Page {jobsCurrentPage} of {totalJobsPages || 1}
                    </span>
                    <button
                        type="button"
                        className='btn-pagination'
                        disabled={jobsCurrentPage === totalJobsPages || totalJobsPages === 0}
                        onClick={() => setJobsCurrentPage(prev => prev + 1)}
                    >
                        Next
                    </button>
                </div>

            </motion.div>
        </div>
    );
}

function ApplicantsMatchingCard({
    searchTerm,
    setSearchTerm,
    filterBy,
    isFilterDropdownOpen,
    setIsFilterDropdownOpen,
    handleFilterByChange,
    filterDate,
    setFilterDate,
    isDatePickerOpen,
    setIsDatePickerOpen,
    datePickerRef,
    calDate,
    handlePrevMonth,
    handleNextMonth,
    firstDayIndex,
    totalDays,
    filterCompany,
    setFilterCompany,
    paginatedApplicants,
    applicantsCurrentPage,
    totalApplicantsPages,
    setApplicantsCurrentPage
}) {
    return (
        <div className='lower-right-column'>
            <motion.div className='card-box applicants-card'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}>
                <div className='card-box-header search-filter-header'>
                    <h4>Applicants Matching Your Requirements</h4>
                    <div className="search-filter-row">
                        <div className="search-box-wrapper">
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button type="button" className="search-btn">
                                <Search size={16} />
                            </button>
                        </div>

                        <div className="custom-dropdown-container">
                            <span className="filter-label">Filter by</span>
                            <button
                                type="button"
                                className="dropdown-btn"
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                            >
                                {filterBy} <ChevronDown size={14} />
                            </button>
                            {isFilterDropdownOpen && (
                                <div className="dropdown-menu">
                                    <button
                                        type="button"
                                        className="dropdown-item"
                                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                                        onClick={() => handleFilterByChange('By Date')}
                                    >
                                        By Date
                                    </button>
                                    <button
                                        type="button"
                                        className="dropdown-item"
                                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                                        onClick={() => handleFilterByChange('By Company Name')}
                                    >
                                        By Company Name
                                    </button>
                                </div>
                            )}
                        </div>

                        {filterBy === 'By Date' && (
                            <div className="custom-date-picker-container" ref={datePickerRef}>
                                <button
                                    type="button"
                                    className="date-picker-trigger"
                                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                >
                                    {filterDate ? formatDeadline(filterDate) : 'Select Date...'}
                                    <Calendar size={14} style={{ marginLeft: '8px' }} />
                                </button>

                                {isDatePickerOpen && (
                                    <div className="custom-calendar-popup">
                                        <div className="calendar-header">
                                            <button type="button" onClick={handlePrevMonth}>&lt;</button>
                                            <span>{calDate.toLocaleString('default', { month: 'long' })} {calDate.getFullYear()}</span>
                                            <button type="button" onClick={handleNextMonth}>&gt;</button>
                                        </div>
                                        <div className="calendar-weekdays">
                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                                <span key={d}>{d}</span>
                                            ))}
                                        </div>
                                        <div className="calendar-days">
                                            {new Array(firstDayIndex).fill(0).map((_, i) => (
                                                <span key={`blank-slot-${calDate.getFullYear()}-${calDate.getMonth()}-${i}`} className="empty-day"></span>
                                            ))}

                                            {new Array(totalDays).fill(0).map((_, i) => {
                                                const day = i + 1;
                                                const dateStr = `${calDate.getFullYear()}-${String(calDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                const isSelected = filterDate === dateStr;
                                                return (
                                                    <button
                                                        key={dateStr}
                                                        type="button"
                                                        className={`calendar-day-btn ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => {
                                                            setFilterDate(dateStr);
                                                            setIsDatePickerOpen(false);
                                                        }}
                                                    >
                                                        {day}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="calendar-footer">
                                            <button type="button" className="calendar-clear-btn" onClick={() => { setFilterDate(''); setIsDatePickerOpen(false); }}>Clear</button>
                                            <button type="button" className="calendar-today-btn" onClick={() => {
                                                const today = new Date();
                                                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                                                setFilterDate(todayStr);
                                                setIsDatePickerOpen(false);
                                            }}>Today</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {filterBy === 'By Company Name' && (
                            <input
                                type="text"
                                className="filter-company-input"
                                placeholder="Enter company name..."
                                value={filterCompany}
                                onChange={(e) => setFilterCompany(e.target.value)}
                            />
                        )}
                    </div>
                </div>

                <div className='applicants-list'>
                    {paginatedApplicants.map((app, index) => (
                        <motion.div key={app.id || `${app.name || 'applicant'}-${index}`} className='applicant-item'
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08, type: "spring", stiffness: 300, damping: 24 }}>

                            <div className='applicant-top'>
                                {getCompanyLogo(app.company)}

                                <div className='applicant-details'>
                                    <h5>{app.company}</h5>

                                    <span className='applicant-name'>👤{app.name}</span>
                                    <span className='applicant-education'>{app.degree} - {app.branch}</span>
                                    <div className='applicant-tags'>
                                        <span className='tag-cgpa'>{app.cgpa}CGPA</span>
                                        <span className='tag-passout'>{app.year}</span>
                                        <span className='tag-date'>📅 {app.date ? formatDeadline(app.date) : ''}</span>
                                    </div>
                                </div>

                                <div className='match-status'>
                                    <span className='match-percent'>
                                        {app.match}% Match
                                    </span>

                                    <div className='progress-bar-bg'>
                                        <div className='progress-bar-fill'
                                            style={{ width: `${app.match}%` }}>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className='pagination-controls'>
                    <button
                        type="button"
                        className='btn-pagination'
                        disabled={applicantsCurrentPage === 1}
                        onClick={() => setApplicantsCurrentPage(prev => prev - 1)}
                    >
                        Previous
                    </button>
                    <span className='pagination-info'>
                        Page {applicantsCurrentPage} of {totalApplicantsPages || 1}
                    </span>
                    <button
                        type="button"
                        className='btn-pagination'
                        disabled={applicantsCurrentPage === totalApplicantsPages || totalApplicantsPages === 0}
                        onClick={() => setApplicantsCurrentPage(prev => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

function AddJobModal({
    setIsSidebarOpen,
    handlePostJob,
    newJob,
    setNewJob,
    handleInputChange,
    validationError,
    handleSaveDraft,
    modalDatePickerRef,
    isModalDatePickerOpen,
    setIsModalDatePickerOpen,
    modalCalDate,
    handleModalPrevMonth,
    handleModalNextMonth,
    modalFirstDayIndex,
    modalTotalDays
}) {
    return (
        <div
            className='modal-overlay'
            aria-label="Close job modal backdrop"
            onClick={(e) => { if (e.target === e.currentTarget) setIsSidebarOpen(false); }}
        >
            <div className='add-job-modal'>
                <div className='modal-header'>
                    <h4>Add Job Posting</h4>
                    <button type="button" className='close-btn' onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <form className='modal-form' onSubmit={handlePostJob}>
                    <div className='form-group'>
                        <label htmlFor="job-company-name">Company Name</label>
                        <input type="text"
                            id="job-company-name"
                            name='companyName'
                            placeholder='Enter Company Name'
                            value={newJob.companyName}
                            onChange={handleInputChange}
                            className={validationError && !newJob.companyName ? 'error-input' : ''}
                            required />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="job-location">Location</label>
                        <input type="text"
                            id="job-location"
                            name='location'
                            placeholder='e.g. Bangalore, India (or Remote)'
                            value={newJob.location}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="job-requirements">Job Requirements</label>
                        <textarea
                            id="job-requirements"
                            name='jobRequirements'
                            placeholder='Enter job requirements'
                            value={newJob.jobRequirements}
                            onChange={handleInputChange}
                            rows={3}>
                        </textarea>
                    </div>

                    <div className='form-group'>
                        <label htmlFor="job-role-overview">Job Role Overview</label>
                        <textarea
                            id="job-role-overview"
                            name="jobRoleOverview"
                            placeholder='Enter job role overview'
                            value={newJob.jobRoleOverview}
                            onChange={handleInputChange}
                            rows={3}
                            className={validationError && !newJob.jobRoleOverview ? 'error-input' : ''}
                            required>
                        </textarea>
                    </div>

                    <div className='form-section-title'>Eligibility Criteria</div>

                    <div className='form-row'>
                        <div className='form-group half-width'>
                            <label htmlFor="job-degree">Degree</label>
                            <select id="job-degree" name="degree" value={newJob.degree} onChange={handleInputChange}>
                                <option value="">Select degree</option>
                                <option value="BCA">BCA</option>
                                <option value="MCA">MCA</option>
                                <option value="BSC Cs">BSC Cs</option>
                                <option value="IT">IT</option>
                            </select>
                        </div>

                        <div className='form-group half-width'>
                            <label htmlFor="job-branch">Branch</label>
                            <select id="job-branch" name="branch" value={newJob.branch} onChange={handleInputChange}>
                                <option value="">Select branch</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Computer Applications">Computer Applications</option>
                            </select>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='form-group half-width'>
                            <label htmlFor="job-min-cgpa">Min CGPA</label>
                            <input
                                type="text"
                                id="job-min-cgpa"
                                name="minCgpa"
                                placeholder="Enter minimum CGPA"
                                value={newJob.minCgpa}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className='form-group half-width'>
                            <label htmlFor="job-passing-year">Passing Year</label>
                            <select id="job-passing-year" name="passingYear" value={newJob.passingYear} onChange={handleInputChange}>
                                <option value="">Select Passing Year</option>
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                            </select>
                        </div>
                    </div>

                    <div className='form-row'>
                        <div className='form-group half-width'>
                            <label htmlFor="job-experience">Experience</label>
                            <select id="job-experience" name="experience" value={newJob.experience} onChange={handleInputChange}>
                                <option value="">Select experience</option>
                                <option value="Fresher">Fresher</option>
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year+">2 Year+</option>
                            </select>
                        </div>

                        <div className='form-group half-width'>
                            <label htmlFor="job-deadline-btn">Deadline</label>
                            <div className="custom-date-picker-container" ref={modalDatePickerRef} style={{ width: '100%' }}>
                                <button
                                    type="button"
                                    id="job-deadline-btn"
                                    className="date-picker-trigger"
                                    onClick={() => setIsModalDatePickerOpen(!isModalDatePickerOpen)}
                                    style={{ width: '100%', justifyContent: 'space-between' }}
                                >
                                    {newJob.deadline ? formatDeadline(newJob.deadline) : 'Select Deadline...'}
                                    <Calendar size={14} />
                                </button>

                                {isModalDatePickerOpen && (
                                    <div className="custom-calendar-popup" style={{ left: 0, right: 'auto', width: '100%', minWidth: '250px' }}>
                                        <div className="calendar-header">
                                            <button type="button" onClick={handleModalPrevMonth}>&lt;</button>
                                            <span>{modalCalDate.toLocaleString('default', { month: 'long' })} {modalCalDate.getFullYear()}</span>
                                            <button type="button" onClick={handleModalNextMonth}>&gt;</button>
                                        </div>
                                        <div className="calendar-weekdays">
                                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                                <span key={d}>{d}</span>
                                            ))}
                                        </div>
                                        <div className="calendar-days">
                                            {new Array(modalFirstDayIndex).fill(0).map((_, i) => (
                                                <span key={`modal-blank-slot-${modalCalDate.getFullYear()}-${modalCalDate.getMonth()}-${i}`} className="empty-day"></span>
                                            ))}

                                            {new Array(modalTotalDays).fill(0).map((_, i) => {
                                                const day = i + 1;
                                                const dateStr = `${modalCalDate.getFullYear()}-${String(modalCalDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                const isSelected = newJob.deadline === dateStr;
                                                return (
                                                    <button
                                                        type="button"
                                                        key={dateStr}
                                                        className={`calendar-day-btn ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => {
                                                            setNewJob(prev => ({ ...prev, deadline: dateStr }));
                                                            setIsModalDatePickerOpen(false);
                                                        }}
                                                    >
                                                        {day}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="calendar-footer">
                                            <button type="button" className="calendar-clear-btn" onClick={() => { setNewJob(prev => ({ ...prev, deadline: '' })); setIsModalDatePickerOpen(false); }}>Clear</button>
                                            <button type="button" className="calendar-today-btn" onClick={() => {
                                                const today = new Date();
                                                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                                                setNewJob(prev => ({ ...prev, deadline: todayStr }));
                                                setIsModalDatePickerOpen(false);
                                            }}>Today</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='form-actions'>
                        <button type='button' className='btn-cancel' onClick={() => setIsSidebarOpen(false)}>
                            Cancel
                        </button>

                        <button type='button' className='btn-save-draft-form' onClick={handleSaveDraft}>
                            Save Draft
                        </button>

                        <button type='submit' className='btn-post'>
                            Post Job
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ProfileEditForm({ adminProfile, handleProfileChange, handleUpdateProfile, setIsEditingProfile }) {
    return (
        <form className='modal-form' onSubmit={handleUpdateProfile}>
            <div className='form-group'>
                <label htmlFor="admin-profile-name">Full Name</label>
                <input
                    id="admin-profile-name"
                    type="text"
                    name="name"
                    value={adminProfile.name}
                    onChange={handleProfileChange}
                    required
                />
            </div>
            <div className='form-group'>
                <label htmlFor="admin-profile-email">Email Address</label>
                <input
                    id="admin-profile-email"
                    type="email"
                    name="email"
                    value={adminProfile.email}
                    onChange={handleProfileChange}
                    required
                />
            </div>
            <div className='form-group'>
                <label htmlFor="admin-profile-phone">Phone Number</label>
                <input
                    id="admin-profile-phone"
                    type="text"
                    name="phone"
                    value={adminProfile.phone}
                    onChange={handleProfileChange}
                />
            </div>
            <div className='form-group'>
                <label htmlFor="admin-profile-role">Role</label>
                <input
                    id="admin-profile-role"
                    type="text"
                    value={adminProfile.role}
                    disabled
                    className="disabled-input"
                />
            </div>

            <div className='form-actions'>
                <button type='button' className='btn-cancel' onClick={() => setIsEditingProfile(false)}>
                    Cancel
                </button>
                <button type='submit' className='btn-confirm-apply' style={{ borderRadius: '9999px' }}>
                    Save Changes
                </button>
            </div>
        </form>
    );
}

function ProfileDetailsView({ adminProfile, handleCloseProfileModal }) {
    return (
        <div className='modal-form'>
            <div className='form-group'>
                <span style={{ display: 'block', marginBottom: '6px', fontSize: '0.8125rem', fontWeight: '600', color: '#64748b' }}>Full Name</span>
                <div className="profile-detail-value" style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', border: '1px solid #e2e8f0' }}>{adminProfile.name}</div>
            </div>
            <div className='form-group'>
                <span style={{ display: 'block', marginBottom: '6px', fontSize: '0.8125rem', fontWeight: '600', color: '#64748b' }}>Email Address</span>
                <div className="profile-detail-value" style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', border: '1px solid #e2e8f0' }}>{adminProfile.email}</div>
            </div>
            <div className='form-group'>
                <span style={{ display: 'block', marginBottom: '6px', fontSize: '0.8125rem', fontWeight: '600', color: '#64748b' }}>Phone Number</span>
                <div className="profile-detail-value" style={{ padding: '12px 16px', background: '#f8fafc', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', color: '#0f172a', border: '1px solid #e2e8f0' }}>{adminProfile.phone}</div>
            </div>
            <div className='form-group'>
                <span style={{ display: 'block', marginBottom: '6px', fontSize: '0.8125rem', fontWeight: '600', color: '#64748b' }}>Role</span>
                <div className="profile-detail-value" style={{ padding: '12px 16px', background: '#f1f5f9', borderRadius: '10px', fontSize: '0.875rem', fontWeight: '600', color: '#64748b', border: '1px solid #e2e8f0' }}>{adminProfile.role}</div>
            </div>

            <div className='form-actions'>
                <button type='button' className='btn-cancel' onClick={handleCloseProfileModal} style={{ width: '100%', textAlign: 'center' }}>
                    Close
                </button>
            </div>
        </div>
    );
}

function ProfileChangePasswordForm({
    passwordData,
    handlePasswordChange,
    showAdminCurrentPassword,
    setShowAdminCurrentPassword,
    showAdminNewPassword,
    setShowAdminNewPassword,
    showAdminConfirmPassword,
    setShowAdminConfirmPassword,
    validationError,
    handleUpdatePassword,
    handleCloseProfileModal
}) {
    return (
        <form className='modal-form' onSubmit={handleUpdatePassword}>
            <div className='form-group'>
                <label htmlFor="admin-current-password">Current Password</label>
                <div className="password-input-wrapper">
                    <input
                        id="admin-current-password"
                        type={showAdminCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        placeholder="Enter current password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowAdminCurrentPassword(!showAdminCurrentPassword)}
                    >
                        {showAdminCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>
            <div className='form-group'>
                <label htmlFor="admin-new-password">New Password</label>
                <div className="password-input-wrapper">
                    <input
                        id="admin-new-password"
                        type={showAdminNewPassword ? "text" : "password"}
                        name="newPassword"
                        placeholder="Enter new password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className={validationError && passwordData.newPassword !== passwordData.confirmPassword ? 'error-input' : ''}
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowAdminNewPassword(!showAdminNewPassword)}
                    >
                        {showAdminNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>
            <div className='form-group'>
                <label htmlFor="admin-confirm-password">Confirm New Password</label>
                <div className="password-input-wrapper">
                    <input
                        id="admin-confirm-password"
                        type={showAdminConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className={validationError && passwordData.newPassword !== passwordData.confirmPassword ? 'error-input' : ''}
                        required
                    />
                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowAdminConfirmPassword(!showAdminConfirmPassword)}
                    >
                        {showAdminConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            <div className='form-actions'>
                <button type='button' className='btn-cancel' onClick={handleCloseProfileModal}>
                    Cancel
                </button>
                <button type='submit' className='btn-post'>
                    Update Password
                </button>
            </div>
        </form>
    );
}

function renderProfileModalBody(props) {
    const {
        profileTab,
        isEditingProfile,
        adminProfile,
        handleProfileChange,
        handleUpdateProfile,
        setIsEditingProfile,
        handleCloseProfileModal,
        passwordData,
        handlePasswordChange,
        showAdminCurrentPassword,
        setShowAdminCurrentPassword,
        showAdminNewPassword,
        setShowAdminNewPassword,
        showAdminConfirmPassword,
        setShowAdminConfirmPassword,
        validationError,
        handleUpdatePassword
    } = props;

    if (profileTab !== 'edit') {
        return (
            <ProfileChangePasswordForm
                passwordData={passwordData}
                handlePasswordChange={handlePasswordChange}
                showAdminCurrentPassword={showAdminCurrentPassword}
                setShowAdminCurrentPassword={setShowAdminCurrentPassword}
                showAdminNewPassword={showAdminNewPassword}
                setShowAdminNewPassword={setShowAdminNewPassword}
                showAdminConfirmPassword={showAdminConfirmPassword}
                setShowAdminConfirmPassword={setShowAdminConfirmPassword}
                validationError={validationError}
                handleUpdatePassword={handleUpdatePassword}
                handleCloseProfileModal={handleCloseProfileModal}
            />
        );
    }

    if (isEditingProfile) {
        return (
            <ProfileEditForm
                adminProfile={adminProfile}
                handleProfileChange={handleProfileChange}
                handleUpdateProfile={handleUpdateProfile}
                setIsEditingProfile={setIsEditingProfile}
            />
        );
    }

    return (
        <ProfileDetailsView
            adminProfile={adminProfile}
            handleCloseProfileModal={handleCloseProfileModal}
        />
    );
}

function ProfileSettingsModal({
    isProfileModalOpen,
    handleCloseProfileModal,
    profileTab,
    isEditingProfile,
    setIsEditingProfile,
    adminProfile,
    handleProfileChange,
    handleUpdateProfile,
    passwordData,
    handlePasswordChange,
    showAdminCurrentPassword,
    setShowAdminCurrentPassword,
    showAdminNewPassword,
    setShowAdminNewPassword,
    showAdminConfirmPassword,
    setShowAdminConfirmPassword,
    validationError,
    handleUpdatePassword
}) {
    if (!isProfileModalOpen) return null;

    let modalTitle = 'Admin Profile Details';
    if (profileTab === 'edit' && isEditingProfile) {
        modalTitle = 'Edit Admin Profile';
    } else if (profileTab !== 'edit') {
        modalTitle = 'Change Password';
    }

    return (
        <div
            className='modal-overlay'
            aria-label="Close profile settings backdrop"
            onClick={(e) => { if (e.target === e.currentTarget) handleCloseProfileModal(); }}
        >
            <div className='add-job-modal profile-settings-modal'>
                <div className='modal-header' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4>{modalTitle}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {profileTab === 'edit' && !isEditingProfile && (
                            <button
                                type="button"
                                className="btn-confirm-apply"
                                style={{
                                    padding: '6px 14px',
                                    fontSize: '0.8125rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    borderRadius: '9999px',
                                    margin: 0,
                                    cursor: 'pointer'
                                }}
                                onClick={() => setIsEditingProfile(true)}
                            >
                                <Edit3 size={14} />
                                <span>Edit Profile</span>
                            </button>
                        )}
                        <button type="button" className='close-btn' onClick={handleCloseProfileModal}>
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {renderProfileModalBody({
                    profileTab,
                    isEditingProfile,
                    adminProfile,
                    handleProfileChange,
                    handleUpdateProfile,
                    setIsEditingProfile,
                    handleCloseProfileModal,
                    passwordData,
                    handlePasswordChange,
                    showAdminCurrentPassword,
                    setShowAdminCurrentPassword,
                    showAdminNewPassword,
                    setShowAdminNewPassword,
                    showAdminConfirmPassword,
                    setShowAdminConfirmPassword,
                    validationError,
                    handleUpdatePassword
                })}
            </div>
        </div>
    );
}

function formatNotificationTimestamp(notif) {
    if (!notif) return '';
    if (notif.displayDate) {
        return `${notif.displayDate} at ${notif.displayTime || ''}`;
    }
    if (notif.createdDate) {
        const timePart = notif.createdTime ? ` at ${notif.createdTime}` : '';
        return `${notif.createdDate}${timePart}`;
    }
    if (notif.createdAt) {
        return new Date(notif.createdAt).toLocaleString();
    }
    return notif.date || '';
}

function NotificationSidebar({
    isNotificationSidebarOpen,
    setIsNotificationSidebarOpen,
    unreadCount,
    handleMarkAllRead,
    notifications
}) {
    if (!isNotificationSidebarOpen) return null;

    return (
        <div className="sd-notification-sidebar-overlay" aria-label="Close notifications" onClick={(e) => { if (e.target === e.currentTarget) setIsNotificationSidebarOpen(false); }}>
            <div className="sd-notification-sidebar">
                <div className="sidebar-header">
                    <div className="header-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Bell size={20} className="sidebar-bell-icon" style={{ color: '#2563eb' }} />
                        <h4 style={{ margin: 0 }}>Notifications</h4>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllRead}
                                style={{ fontSize: '0.8rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Mark all as read
                            </button>
                        )}
                        <button type="button" className="btn-close-sidebar" onClick={() => setIsNotificationSidebarOpen(false)}>
                            <X size={18} />
                        </button>
                    </div>
                </div>
                <div className="sidebar-body">
                    {notifications.length === 0 ? (
                        <p className="no-notifications">No new notifications</p>
                    ) : (
                        notifications.map((notif, index) => {
                            const isRead = notif.read || notif.status === 'read';
                            return (
                                <motion.div
                                    key={notif.id}
                                    className="notification-item"
                                    initial={{ opacity: 0, y: -30 }}
                                    animate={{ opacity: isRead ? 0.6 : 1, y: 0 }}
                                    transition={{ delay: index * 0.08, type: "spring", stiffness: 300, damping: 24 }}
                                    style={{ borderLeft: isRead ? '4px solid transparent' : '4px solid #2563eb' }}
                                >
                                    <p style={{ fontWeight: isRead ? 'normal' : '600' }}>{notif.message || notif.text}</p>
                                    <span className="notif-date">{formatNotificationTimestamp(notif)}</span>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

function AdminDashboard({ onNavigate }) {
    //1. Sidebar form visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Active menu tab state
    const [activeTab, setActiveTab] = useState('dashboard');

    //2. Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBy, setFilterBy] = useState('By Date');
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

    //3. Mock job postings list
    const [jobs, setJobs] = useState([
        {
            id: 1, title: 'Software Developer Intern',
            company: 'Google', status: 'Active',
            date: '05 July 2026',
            deadline: '2026-07-20',
            logoUrl: 'https://www.google.com/s2/favicons?domain=google.com&sz=128',
            location: 'Bangalore, India'
        },
        {
            id: 2, title: 'Data Analyst',
            company: 'Microsoft', status: 'Active',
            date: '04 July 2026',
            deadline: '2026-07-18',
            logoUrl: 'https://www.google.com/s2/favicons?domain=microsoft.com&sz=128',
            location: 'Hyderabad, India'
        },
        {
            id: 3, title: 'SDE Intern',
            company: 'Infosys', status: 'Active',
            date: '03 July 2026',
            deadline: '2026-07-15',
            logoUrl: 'https://www.google.com/s2/favicons?domain=infosys.com&sz=128',
            location: 'Pune, India'
        }
    ]);

    const [drafts, setDrafts] = useState([]);
    const [draftsCurrentPage, setDraftsCurrentPage] = useState(1);
    const DRAFTS_PER_PAGE = 3;
    const [dashboardStats, setDashboardStats] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [filteredApplicants, setFilteredApplicants] = useState([]);

    const [newJob, setNewJob] = useState({
        companyName: '', location: '', jobRequirements: '', jobRoleOverview: '',
        degree: '', branch: '', minCgpa: '', passingYear: '', experience: '', deadline: ''
    });

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [validationError, setValidationError] = useState(false);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const response = await getAdminNotifications();
            if (response.data) {
                const fallback = response.data.content ? response.data.content : [];
                const data = Array.isArray(response.data) ? response.data : fallback;
                const sorted = data.sort((a, b) => parseDateStr(b.createdDate, b.createdTime) - parseDateStr(a.createdDate, a.createdTime));

                const localizedData = sorted.map(notif => localizeNotification(notif));
                setNotifications(localizedData);
            }

            const countResponse = await getAdminUnreadCount();
            if (countResponse.data !== undefined) {
                const count = typeof countResponse.data === 'object' ? (countResponse.data.count || countResponse.data.unreadCount || 0) : countResponse.data;
                setUnreadCount(count);
            }
        } catch (error) {
            console.error("Error fetching admin notifications or unread count:", error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchNotifications();
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await markAllAdminNotificationsAsRead();
            await fetchNotifications();
            setToastMessage("All admin notifications marked as read");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            console.error("Error marking all admin read:", error);
        }
    };

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileTab, setProfileTab] = useState('edit');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const loggedInAdmin = JSON.parse(localStorage.getItem("admin_user") || "{}");

    const [adminProfile, setAdminProfile] = useState({
        name: loggedInAdmin.fullName || 'Admin',
        email: loggedInAdmin.email || '',
        phone: loggedInAdmin.phone || '',
        role: 'System Administrator'
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '', newPassword: '', confirmPassword: ''
    });

    const [recentPosts, setRecentPosts] = useState([]);

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const response = await getAdminProfile();
                if (response.data) {
                    setAdminProfile({
                        name: response.data.fullName || response.data.name || 'Admin',
                        email: response.data.email || 'admin@example.com',
                        phone: response.data.mobile || response.data.phone || '',
                        role: response.data.role || 'System Administrator'
                    });
                }
            } catch (error) {
                console.error("Error fetching admin profile:", error);
            }
        };

        const fetchRecentPosts = async () => {
            try {
                const response = await getAdminRecentPosts();
                if (response.data) {
                    setRecentPosts(response.data);
                }
            } catch (error) {
                console.error("Error fetching recent posts:", error);
            }
        };

        const fetchApplicantsMatching = async () => {
            try {
                const response = await getAdminApplicantsMatching();
                if (response.data && Array.isArray(response.data)) {
                    const mapped = response.data.map(app => ({
                        id: app.id || crypto.randomUUID(),
                        name: app.studentName || '',
                        company: app.companyName || app.jobRole || '',
                        degree: app.course || app.degree || '',
                        branch: app.department || app.branch || '',
                        cgpa: app.cgpa ?? '',
                        year: app.passingYear || '',
                        match: app.matchPercentage ?? app.matchScore ?? '',
                        date: app.appliedAt || app.appliedDate || ''
                    }));
                    setApplicants(mapped);
                    setFilteredApplicants(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch matching applicants", error);
            }
        };

        const fetchDraftsData = async () => {
            try {
                const response = await getDrafts();
                const rawData = response ? response.data : null;
                let draftsData = [];
                if (Array.isArray(rawData)) {
                    draftsData = rawData;
                } else if (rawData && Array.isArray(rawData.drafts)) {
                    draftsData = rawData.drafts;
                } else if (rawData && Array.isArray(rawData.content)) {
                    draftsData = rawData.content;
                }

                const mappedDrafts = draftsData.map(d => ({
                    id: d.id,
                    title: d.jobRoleOverview || d.title || d.jobRole || 'Untitled Draft',
                    company: d.companyName || d.company || 'Unknown Company',
                    location: d.location || "Remote",
                    requirements: d.jobRequirements || "",
                    degree: d.degree || "",
                    branch: d.branch || "",
                    cgpa: d.minCgpa || "",
                    year: d.passingYear || "",
                    experience: d.experience || "",
                    deadline: d.deadline || "",
                    lastSaved: d.savedTime || (d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Saved')
                }));
                setDrafts(mappedDrafts);
            } catch (error) {
                console.error("Failed to fetch drafts", error);
            }
        };

        const fetchDashboardStats = async () => {
            try {
                const response = await getAdminStudentAnalyticsDashboard();
                if (response.data) {
                    setDashboardStats(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch admin dashboard stats:", error);
            }
        };

        fetchAdminProfile();
        fetchRecentPosts();
        fetchApplicantsMatching();
        fetchDraftsData();
        fetchDashboardStats();
    }, []);

    const [showAdminCurrentPassword, setShowAdminCurrentPassword] = useState(false);
    const [showAdminNewPassword, setShowAdminNewPassword] = useState(false);
    const [showAdminConfirmPassword, setShowAdminConfirmPassword] = useState(false);

    const [jobsCurrentPage, setJobsCurrentPage] = useState(1);
    const JOBS_PER_PAGE = 3;

    const [applicantsCurrentPage, setApplicantsCurrentPage] = useState(1);
    const APPLICANTS_PER_PAGE = 4;

    const [filterDate, setFilterDate] = useState('');
    const [filterCompany, setFilterCompany] = useState('');

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [calDate, setCalDate] = useState(new Date());
    const datePickerRef = useRef(null);

    const handlePrevMonth = () => {
        setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCalDate(new Date(calDate.getFullYear(), calDate.getMonth() + 1, 1));
    };

    const totalDays = new Date(calDate.getFullYear(), calDate.getMonth() + 1, 0).getDate();
    const firstDayIndex = new Date(calDate.getFullYear(), calDate.getMonth(), 1).getDay();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setIsDatePickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [isModalDatePickerOpen, setIsModalDatePickerOpen] = useState(false);
    const [modalCalDate, setModalCalDate] = useState(new Date());
    const modalDatePickerRef = useRef(null);

    const handleModalPrevMonth = () => {
        setCalDate(new Date(modalCalDate.getFullYear(), modalCalDate.getMonth() - 1, 1));
        setModalCalDate(new Date(modalCalDate.getFullYear(), modalCalDate.getMonth() - 1, 1));
    };

    const handleModalNextMonth = () => {
        setCalDate(new Date(modalCalDate.getFullYear(), modalCalDate.getMonth() + 1, 1));
        setModalCalDate(new Date(modalCalDate.getFullYear(), modalCalDate.getMonth() + 1, 1));
    };

    const modalTotalDays = new Date(modalCalDate.getFullYear(), modalCalDate.getMonth() + 1, 0).getDate();
    const modalFirstDayIndex = new Date(modalCalDate.getFullYear(), modalCalDate.getMonth(), 1).getDay();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalDatePickerRef.current && !modalDatePickerRef.current.contains(event.target)) {
                setIsModalDatePickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFilterByChange = (value) => {
        setFilterBy(value);
        setFilterDate('');
        setFilterCompany('');
        setIsFilterDropdownOpen(false);
    };

    useEffect(() => {
        const result = filterAndSortApplicants(applicants, searchTerm, filterBy, filterDate, filterCompany);
        const timer = setTimeout(() => {
            setApplicantsCurrentPage(1);
            setFilteredApplicants(result);
        }, 0);
        return () => clearTimeout(timer);
    }, [searchTerm, filterBy, filterDate, filterCompany, applicants]);

    useEffect(() => {
        const fetchDraftsData = async () => {
            try {
                const response = await getDrafts();
                const rawData = response ? response.data : null;
                let draftsData = [];
                if (Array.isArray(rawData)) {
                    draftsData = rawData;
                } else if (rawData && Array.isArray(rawData.drafts)) {
                    draftsData = rawData.drafts;
                } else if (rawData && Array.isArray(rawData.content)) {
                    draftsData = rawData.content;
                }

                const formattedDrafts = draftsData.map(d => ({
                    id: d.id,
                    title: d.jobRoleOverview || d.title || d.jobRole || 'Untitled Draft',
                    company: d.companyName || d.company || 'Unknown Company',
                    location: d.location || "Remote",
                    requirements: d.jobRequirements || "",
                    degree: d.degree || "",
                    branch: d.branch || "",
                    cgpa: d.minCgpa || "",
                    year: d.passingYear || "",
                    experience: d.experience || "",
                    deadline: d.deadline || "",
                    lastSaved: d.savedTime || (d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Saved')
                }));
                setDrafts(formattedDrafts);
            } catch (error) {
                console.error("Error fetching drafts:", error);
            }
        };
        fetchDraftsData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewJob(prev => ({ ...prev, [name]: value }));
    };

    const triggerToast = (msg, type = 'success') => {
        setToastType(type);
        setToastMessage(msg);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handlePostJob = async (e) => {
        e.preventDefault();

        if (!newJob.companyName || !newJob.jobRoleOverview || !newJob.jobRequirements) {
            setValidationError(true);
            triggerToast("Please fill in Company Name, Job Role Overview, and Job Requirements!", 'error');
            return;
        }

        try {
            setValidationError(false);
            const apiDeadline = formatApiDeadline(newJob.deadline);

            const payload = {
                companyName: newJob.companyName || "Company",
                location: newJob.location || "Remote",
                jobRequirements: newJob.jobRequirements || "Requirements details",
                jobRoleOverview: newJob.jobRoleOverview || "Role Overview",
                degree: newJob.degree || "B.Tech",
                branch: newJob.branch || "Computer Science",
                minCgpa: Number(newJob.minCgpa) || 0,
                passingYear: newJob.passingYear || "2026",
                experience: newJob.experience || "fresher",
                deadline: apiDeadline,
                action: "post"
            };

            const response = await createJobPosting(payload);

            const createdJob = {
                id: response.data.id || (jobs.length + 1),
                title: newJob.jobRoleOverview,
                company: newJob.companyName,
                location: newJob.location || "Remote",
                requirements: newJob.jobRequirements,
                degree: newJob.degree,
                branch: newJob.branch,
                cgpa: newJob.minCgpa,
                year: newJob.passingYear,
                experience: newJob.experience,
                deadline: newJob.deadline,
                status: 'Active',
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            };

            setJobs([createdJob, ...jobs]);
            setNewJob({
                companyName: '', location: '', jobRequirements: '', jobRoleOverview: '',
                degree: '', branch: '', minCgpa: '', passingYear: '', experience: '', deadline: ''
            });

            triggerToast(`Job posted successfully for ${newJob.companyName}!`, 'success');
            setIsSidebarOpen(false);
        } catch (error) {
            console.error("Failed to post job:", error);
            const errorMsg = error.response?.data?.message || "Failed to create job posting. Please try again.";
            triggerToast(errorMsg, 'error');
        }
    };

    const handleSaveDraft = async () => {
        if (!newJob.companyName || !newJob.jobRoleOverview) {
            setValidationError(true);
            triggerToast("Please fill in Company Name and Job Role Overview to save as a draft!", 'error');
            return;
        }

        try {
            setValidationError(false);
            const apiDeadline = formatApiDeadline(newJob.deadline);

            const payload = {
                companyName: newJob.companyName,
                location: newJob.location || "Remote",
                jobRequirements: newJob.jobRequirements || "None",
                jobRoleOverview: newJob.jobRoleOverview,
                degree: newJob.degree || "B.Tech",
                branch: newJob.branch || "Computer Science",
                minCgpa: Number(newJob.minCgpa) || 0,
                passingYear: newJob.passingYear || "2026",
                experience: newJob.experience || "fresher",
                deadline: apiDeadline,
                action: "draft"
            };

            const response = await createJobPosting(payload);

            const newDraft = {
                id: response.data.id || (drafts.length + 1),
                title: newJob.jobRoleOverview,
                company: newJob.companyName,
                location: newJob.location || "Remote",
                requirements: newJob.jobRequirements,
                degree: newJob.degree,
                branch: newJob.branch,
                cgpa: newJob.minCgpa,
                year: newJob.passingYear,
                experience: newJob.experience,
                deadline: newJob.deadline,
                lastSaved: 'Just now'
            };

            setDrafts([newDraft, ...drafts]);
            setNewJob({
                companyName: '', location: '', jobRequirements: '', jobRoleOverview: '',
                degree: '', branch: '', minCgpa: '', passingYear: '', experience: '', deadline: ''
            });

            triggerToast(`Draft saved for ${newDraft.company}!`, 'success');
            setIsSidebarOpen(false);
        } catch (error) {
            console.error("Failed to save draft:", error);
            const errorMsg = error.response?.data?.message || "Failed to save draft. Please try again.";
            triggerToast(errorMsg, 'error');
        }
    };

    const handlePublishDraft = async (draftId) => {
        const draftToPublish = drafts.find(d => d.id === draftId);
        if (!draftToPublish) return;

        try {
            const response = await publishDraft(draftId);
            const apiJob = response.data;

            const newPublishedJob = {
                id: apiJob.id || (jobs.length + 1),
                title: apiJob.jobRoleOverview || draftToPublish.title,
                company: apiJob.companyName || draftToPublish.company,
                location: apiJob.location || draftToPublish.location || "Remote",
                requirements: apiJob.jobRequirements || draftToPublish.requirements,
                degree: apiJob.degree || draftToPublish.degree,
                branch: apiJob.branch || draftToPublish.branch,
                cgpa: apiJob.minCgpa || draftToPublish.cgpa,
                year: apiJob.passingYear || draftToPublish.year,
                experience: apiJob.experience || draftToPublish.experience,
                deadline: apiJob.deadline || draftToPublish.deadline,
                status: 'Active',
                date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
            };

            setJobs([newPublishedJob, ...jobs]);
            setDrafts(drafts.filter(d => d.id !== draftId));
            triggerToast(`Published draft: ${newPublishedJob.title} at ${newPublishedJob.company}!`, 'success');
        } catch (error) {
            console.error("Failed to publish draft:", error);
            triggerToast("Failed to publish draft. Please try again.", 'error');
        }
    };

    const handleEditDraft = async (draftId) => {
        try {
            const response = await getDraftById(draftId);
            const draftToEdit = response.data;

            setNewJob({
                companyName: draftToEdit.companyName,
                location: draftToEdit.location || '',
                jobRequirements: draftToEdit.jobRequirements || '',
                jobRoleOverview: draftToEdit.jobRoleOverview,
                degree: draftToEdit.degree || '',
                branch: draftToEdit.branch || '',
                minCgpa: draftToEdit.minCgpa || '',
                passingYear: draftToEdit.passingYear || '',
                experience: draftToEdit.experience || '',
                deadline: draftToEdit.deadline || ''
            });

            setValidationError(false);
            setDrafts(drafts.filter(d => d.id !== draftId));
            setIsSidebarOpen(true);
        } catch (error) {
            console.error("Failed to load draft details:", error);
            triggerToast("Failed to fetch draft details from the server.", 'error');
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setAdminProfile(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                fullName: adminProfile.name,
                email: adminProfile.email,
                mobile: adminProfile.phone,
                role: adminProfile.role || "System Administrator"
            };

            await updateAdminProfile(payload);

            const rawUser = localStorage.getItem("admin_user");
            let userInStorage = {};
            if (rawUser) {
                try {
                    const parsed = JSON.parse(rawUser);
                    if (parsed && typeof parsed === 'object') userInStorage = parsed;
                } catch {
                    userInStorage = {};
                }
            }

            const updatedUser = {
                fullName: sanitizeStorageString(adminProfile.name),
                email: sanitizeStorageString(adminProfile.email).toLowerCase(),
                phone: sanitizeStorageString(adminProfile.phone),
                role: sanitizeStorageString(adminProfile.role || userInStorage.role || 'System Administrator')
            };
            localStorage.setItem("admin_user", JSON.stringify(updatedUser));

            triggerToast("Admin profile updated successfully!", 'success');
            setIsProfileModalOpen(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
            triggerToast("Failed to update profile.", 'error');
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setValidationError(true);
            triggerToast("New passwords do not match!", 'error');
            return;
        }

        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            });

            const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');
            const adminEmail = adminUser.email || 'saurabh@gmail.com';

            if (adminEmail) {
                updateAdminPasswordInStorage(adminEmail, passwordData.newPassword);
            }

            setValidationError(false);
            triggerToast("Admin password changed successfully!", 'success');

            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowAdminCurrentPassword(false);
            setShowAdminNewPassword(false);
            setShowAdminConfirmPassword(false);
            setIsProfileModalOpen(false);
        } catch (error) {
            console.error("Error changing password:", error);
            setValidationError(true);
            triggerToast(error.response?.data?.message || "Failed to change password. Please check your current password.", 'error');
        }
    };

    const handleCloseProfileModal = () => {
        setIsProfileModalOpen(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowAdminCurrentPassword(false);
        setShowAdminNewPassword(false);
        setShowAdminConfirmPassword(false);
        setValidationError(false);
    };

    const totalDraftsPages = Math.ceil(drafts.length / DRAFTS_PER_PAGE);
    const paginatedDrafts = drafts.slice(
        (draftsCurrentPage - 1) * DRAFTS_PER_PAGE,
        draftsCurrentPage * DRAFTS_PER_PAGE
    );

    const totalJobsPages = Math.ceil(recentPosts.length / JOBS_PER_PAGE);
    const paginatedRecentPosts = recentPosts.slice(
        (jobsCurrentPage - 1) * JOBS_PER_PAGE,
        jobsCurrentPage * JOBS_PER_PAGE
    );

    const totalApplicantsPages = Math.ceil(filteredApplicants.length / APPLICANTS_PER_PAGE);
    const paginatedApplicants = filteredApplicants.slice(
        (applicantsCurrentPage - 1) * APPLICANTS_PER_PAGE,
        applicantsCurrentPage * APPLICANTS_PER_PAGE
    );

    return (
        <div className='admin-dashboard-container'>
            <AdminHeader
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                unreadCount={unreadCount}
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen}
                adminProfile={adminProfile}
                setIsNotificationSidebarOpen={setIsNotificationSidebarOpen}
                setProfileTab={setProfileTab}
                setIsEditingProfile={setIsEditingProfile}
                setValidationError={setValidationError}
                setIsProfileModalOpen={setIsProfileModalOpen}
                onNavigate={onNavigate}
            />

            <div className={activeTab === 'analytics' || activeTab === 'queries' ? 'analytics-content-layout' : 'dashboard-content-layout'}>
                <main className='dashboard-main'>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            {activeTab === 'dashboard' && (
                                <>
                                    <section className='greeting-section'>
                                        <div className='greeting-content'>
                                            <h2>Welcome, {adminProfile.name} <span className='waving-hand'>👋</span></h2>
                                            <p>Here's what's happening with your placement portal today.</p>
                                        </div>
                                        <div className='greeting-date-badge'>
                                            <span>📅 {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </section>

                                    <AdminStatsGrid dashboardStats={dashboardStats} />

                                    <div className='dashboard-grid-lower'>
                                        <RecentPostingsCard
                                            drafts={drafts}
                                            paginatedDrafts={paginatedDrafts}
                                            draftsCurrentPage={draftsCurrentPage}
                                            totalDraftsPages={totalDraftsPages}
                                            setDraftsCurrentPage={setDraftsCurrentPage}
                                            handleEditDraft={handleEditDraft}
                                            handlePublishDraft={handlePublishDraft}
                                            paginatedRecentPosts={paginatedRecentPosts}
                                            jobsCurrentPage={jobsCurrentPage}
                                            totalJobsPages={totalJobsPages}
                                            setJobsCurrentPage={setJobsCurrentPage}
                                            setValidationError={setValidationError}
                                            setIsSidebarOpen={setIsSidebarOpen}
                                        />

                                        <ApplicantsMatchingCard
                                            searchTerm={searchTerm}
                                            setSearchTerm={setSearchTerm}
                                            filterBy={filterBy}
                                            isFilterDropdownOpen={isFilterDropdownOpen}
                                            setIsFilterDropdownOpen={setIsFilterDropdownOpen}
                                            handleFilterByChange={handleFilterByChange}
                                            filterDate={filterDate}
                                            setFilterDate={setFilterDate}
                                            isDatePickerOpen={isDatePickerOpen}
                                            setIsDatePickerOpen={setIsDatePickerOpen}
                                            datePickerRef={datePickerRef}
                                            calDate={calDate}
                                            handlePrevMonth={handlePrevMonth}
                                            handleNextMonth={handleNextMonth}
                                            firstDayIndex={firstDayIndex}
                                            totalDays={totalDays}
                                            filterCompany={filterCompany}
                                            setFilterCompany={setFilterCompany}
                                            paginatedApplicants={paginatedApplicants}
                                            applicantsCurrentPage={applicantsCurrentPage}
                                            totalApplicantsPages={totalApplicantsPages}
                                            setApplicantsCurrentPage={setApplicantsCurrentPage}
                                        />
                                    </div>
                                </>
                            )}

                            {activeTab === 'analytics' && <StudentAnalytics />}
                            {activeTab === 'queries' && <QueriesStories />}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {isSidebarOpen && (
                    <AddJobModal
                        setIsSidebarOpen={setIsSidebarOpen}
                        handlePostJob={handlePostJob}
                        newJob={newJob}
                        setNewJob={setNewJob}
                        handleInputChange={handleInputChange}
                        validationError={validationError}
                        handleSaveDraft={handleSaveDraft}
                        modalDatePickerRef={modalDatePickerRef}
                        isModalDatePickerOpen={isModalDatePickerOpen}
                        setIsModalDatePickerOpen={setIsModalDatePickerOpen}
                        modalCalDate={modalCalDate}
                        handleModalPrevMonth={handleModalPrevMonth}
                        handleModalNextMonth={handleModalNextMonth}
                        modalFirstDayIndex={modalFirstDayIndex}
                        modalTotalDays={modalTotalDays}
                    />
                )}

                {showToast && (
                    <div className={`admin-toast-notification ${toastType}`}>
                        <span className="admin-toast-icon">
                            {toastType === 'success' ? '✓' : '⚠'}
                        </span>
                        <span className="admin-toast-text">{toastMessage}</span>
                    </div>
                )}

                <ProfileSettingsModal
                    isProfileModalOpen={isProfileModalOpen}
                    handleCloseProfileModal={handleCloseProfileModal}
                    profileTab={profileTab}
                    isEditingProfile={isEditingProfile}
                    setIsEditingProfile={setIsEditingProfile}
                    adminProfile={adminProfile}
                    handleProfileChange={handleProfileChange}
                    handleUpdateProfile={handleUpdateProfile}
                    passwordData={passwordData}
                    handlePasswordChange={handlePasswordChange}
                    showAdminCurrentPassword={showAdminCurrentPassword}
                    setShowAdminCurrentPassword={setShowAdminCurrentPassword}
                    showAdminNewPassword={showAdminNewPassword}
                    setShowAdminNewPassword={setShowAdminNewPassword}
                    showAdminConfirmPassword={showAdminConfirmPassword}
                    setShowAdminConfirmPassword={setShowAdminConfirmPassword}
                    validationError={validationError}
                    handleUpdatePassword={handleUpdatePassword}
                />

                <NotificationSidebar
                    isNotificationSidebarOpen={isNotificationSidebarOpen}
                    setIsNotificationSidebarOpen={setIsNotificationSidebarOpen}
                    unreadCount={unreadCount}
                    handleMarkAllRead={handleMarkAllRead}
                    notifications={notifications}
                />
            </div>
        </div>
    );
}
export default AdminDashboard;

