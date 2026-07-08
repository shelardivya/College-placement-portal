import React, { useState } from "react";
import {
    GraduationCap,
    Bell,
    User,
    CheckCircle2,
    Clock,
    XCircle,
    MapPin,
    Briefcase,
    Calendar,
    ChevronRight,
    X,
    Lock,
    LogOut,
    Mail,
    Phone,
    BookOpen,
    Award,
    Globe,
    GitBranch
} from "lucide-react";
import "./StudentDashboard.css";

export default function
    StudentDashboard({ onNavigate }) {
    // Retrieve the logged-in student's details from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
    const studentName = loggedInUser.fullName || "Student";

    const getInitials = (name) => {
        if (!name || name === "Student") return "ST";
        const parts = name.trim().split(" ");
        return parts.map(p => p[0]).join("").toUpperCase().slice(0, 2);
    };

    //Component state
    const [selectedJob, setSelectedJob] =
        useState(null);

    const [appliedJobs, setAppliedJobs] =
        useState([]);

    const [companyFilter, setCompanyFilter] =
        useState("All");

    // Dropdown visibility states
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

    // Modal overlay visibility states
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    // Notification Mock Data
    const [notifications, setNotifications] = useState([
        { id: 1, text: "Google application deadline is tomorrow!", date: "Today" },
        { id: 2, text: "Your resume match score for IBM is 75%.", date: "Yesterday" },
        { id: 3, text: "New Job opening: Systems Engineer at Infosys.", date: "2 days ago" }
    ]);

    // Gather profile information from localStorage, with clean default fallbacks
    const getInitialProfile = () => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        return {
            fullName: storedUser.fullName || "Saurabh Kumar",
            email: storedUser.email || "saurabh@gmail.com",
            phone: storedUser.phone || "9876543210",
            branch: storedUser.branch || "Computer Science",
            passingYear: storedUser.passingYear || "2026",
            cgpa: storedUser.cgpa || "8.5",
            skills: storedUser.skills || "React, JavaScript, CSS, SQL, Python",
            linkedinUrl: storedUser.linkedinUrl || "https://linkedin.com/in/saurabh",
            githubUrl: storedUser.githubUrl || "https://github.com/saurabh"
        };
    };
    const [profile, setProfile] = useState(getInitialProfile());

    // Password change form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Handles password change submission
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }

        alert("Password updated successfully!");
        setIsChangePasswordOpen(false);
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    };

    // Handles logout flow
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        onNavigate("login"); // Navigate back to public login view
    };

    // 1. Triggered when the user clicks the "Apply" button on any job card
    const handleApplyClick = (job) => {
        setSelectedJob(job);
    };

    // 2. Triggered when the user clicks "Confirm and Apply" inside the requirements modal
    const handleConfirmApply = () => {
        if (selectedJob) {
            setAppliedJobs(prev => [...prev, selectedJob.id]);

            alert(`Successfully applied for the ${selectedJob.role} role ay ${selectedJob.company}!`);
            setSelectedJob(null);
        }
    };

    // 3. Triggered when the user clicks "cancel" to  close the modal
    const handleCancleApply = () => {
        setSelectedJob(null);
    };

    //Mock Data 
    const metrics = [
        {
            id: "profile",
            title: "Profile Completed",
            value: "85%",
            icon: <User className="metric-icon-blue" />,
            colorClass: "blue",
            progess: 85
        },

        {
            id: "selected",
            title: "Selected",
            value: "5",
            icon: <CheckCircle2 className="metric-icon-green" />,
            colorClass: "green",
            progress: 100
        },

        {
            id: "pending",
            title: "Pending",
            value: "3",
            icon: <Clock className="metric-icon-orange" />,
            colorClass: "orange",
            progress: 100
        },

        {
            id: "rejected",
            title: "Rejected",
            value: "6",
            icon: <XCircle className="metric-icon-red" />,
            colorClass: "red",
            progress: 100
        }
    ];

    const jobs = [
        {
            id: "google-backend",
            company: "Google",
            location: "Mumbai",
            role: "Backend Developer",
            deadline: "30-June-2026",
            logoLetter: "G",
            logoClor: "#ea4335",
            requirements: [
                "BE/B.Tech in Computer Science or related field",
                "Strong knowledge of Java, Spring Boot, REST APIs",
                "Experience with databases (MySQL/PostgreSQL)",
                "Good problem-solving skills",
                "CGPA: 7.0 and above"
            ],
            additionalinfo: "This is a full-time role based in Mumbai."
        },

        {
            id: "ibm-frontend",
            company: "IBM",
            location: "Pune",
            role: "Frontend Developer",
            deadline: "25-June-2026",
            logoLetter: "IBM",
            logoColor: "#0f62fe",
            requirements: [
                "BE/B.Tech/MCA in Computer Science or IT",
                "Proficiency in React, HTML, CSS, JavaScript",
                "Experience with responsive designs and modern CSS systems",
                "Familiarity with Git and version control frameworks",
                "CGPA: 6.5 and above"
            ],
            additionalInfo: "This is a full-time role based in Pune."
        },

        {
            id: "infosys-systems",
            company: "Infosys",
            location: "Bangalore",
            role: "Systems Engineer",
            deadline: "28-June-2026",
            logoLetter: "Infosys",
            logoColor: "#007cc3",
            requirements: [
                "BE/B.Tech/M.Tech/MCA/M.Sc in CS or related fields",
                "Strong analytical and logical reasoning skills",
                "Basic understanding of programming concepts (Java, Python, or C++)",
                "Good communication skills",
                "No active backlogs"
            ],
            additionalInfo: "This is a full-time role based in Bangalore."
        }
    ];

    const resumeMatches = [
        {
            company: "Google",
            role: "Data Scientist",
            deadline: "30-June-2026",
            score: 90,
            logoLetter: "G",
            logoColor: "#ea4335"
        },
        {
            company: "IBM",
            role: "Frontend Developer",
            deadline: "25-June-2026",
            score: 75,
            logoLetter: "IBM",
            logoColor: "#0f62fe"
        },
        {
            company: "Infosys",
            role: "Systems Engineer",
            deadline: "28-June-2026",
            score: 70,
            logoLetter: "Infosys",
            logoColor: "#007cc3"
        }
    ];


    return (
        <div className="dashboard-container">

            {/*Header Section*/}
            <header className="dashboard-header">

                <div className="header-logo">
                    <GraduationCap className="logo-icon" />
                    <h1>College Placement Portal</h1>
                </div>

                <div className="header-actions">
                    <span className="role-badge">Student</span>

                    {/* Notification Dropdown */}
                    <div className="notification-bell-container">
                        <div className="notification-bell" onClick={() => {
                            setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
                            setIsProfileDropdownOpen(false);
                        }}>
                            <Bell className="bell-icon" />
                            {notifications.length > 0 && (
                                <span className="bell-badge">{notifications.length}</span>
                            )}
                        </div>

                        {isNotificationDropdownOpen && (
                            <div className="notification-dropdown">
                                <div className="dropdown-header">
                                    <h3>Notifications</h3>
                                </div>
                                <div className="dropdown-body">
                                    {notifications.length === 0 ? (
                                        <p className="no-notifications">No new notifications</p>
                                    ) : (
                                        notifications.map((notif) => (
                                            <div key={notif.id} className="notification-item">
                                                <p>{notif.text}</p>
                                                <span className="notif-date">{notif.date}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="profile-container">
                        <div className="profile-avatar" onClick={() => {
                            setIsProfileDropdownOpen(!isProfileDropdownOpen);
                            setIsNotificationDropdownOpen(false);
                        }}>
                            <span className="avatar-placeholder">{getInitials(studentName)}</span>
                        </div>

                        {isProfileDropdownOpen && (
                            <div className="profile-dropdown">
                                <div className="dropdown-user-info">
                                    <h4>{studentName}</h4>
                                    <p>{profile.email}</p>
                                </div>
                                <hr className="dropdown-divider" />
                                <button className="dropdown-item" onClick={() => {
                                    setIsProfileModalOpen(true);
                                    setIsProfileDropdownOpen(false);
                                }}>
                                    <User size={16} />
                                    <span>View Profile</span>
                                </button>
                                <button className="dropdown-item" onClick={() => {
                                    setIsChangePasswordOpen(true);
                                    setIsProfileDropdownOpen(false);
                                }}>
                                    <Lock size={16} />
                                    <span>Change Password</span>
                                </button>
                                <hr className="dropdown-divider" />
                                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/*Welcome Banner*/}
            <section className="welcome-section">
                <h2>Welcome, {studentName}👋 </h2>
                <p>Here's whats's happening with your placement portal today.</p>
            </section>

            {/*Metric Boxes*/}
            <section className="metrics-grid">
                {metrics.map((metric) => (
                    <div className="metric-card" key={metric.id}>
                        <div className="metric-header">
                            <div className={`metric-icon-wrapper ${metric.colorClass}`}>
                                {metric.icon}
                            </div>

                            <div className="metric-info">
                                <span className="metric-title"> {metric.title}</span>
                                <span className="metric-value">{metric.value}</span>
                            </div>
                        </div>

                        {/*Progress Bar Line Wrapper*/}
                        <div className="metric-progress-container">
                            <div className={`metric-progress-bar ${metric.colorClass}`}

                                style={{ width: `${metric.progess || metric.progress}%` }}>
                            </div>

                        </div>

                    </div>
                ))}

            </section>

            {/*MAin two column content*/}
            <main className="dashboard-main-content">

                {/*LEft column : latest job opportunities */}
                <section className="dashboard-column jobs-column">
                    <div className="column-card-header">
                        <h3>Latest Job Opportunities</h3>
                    </div>

                    <div className="job-list">
                        {jobs.map((job) => {
                            const isApplied = appliedJobs.includes(job.id);
                            return (
                                <div className="job-card-row" key={job.id}>

                                    {/*Company logo badge */}
                                    <div className="company-logo-badge" style={{
                                        borderColor: job.logoColor || job.logoClor
                                    }}>
                                        <span style={{ color: job.logoColor || job.logoClor }}>{job.logoLetter}</span>
                                    </div>

                                    {/*Job Meta Data Details*/}
                                    <div className="job-row-details">
                                        <h4 className="company-name">{job.company} </h4>

                                        <div className="job-details-meta">
                                            <div className="meta-item">
                                                <MapPin size={14} className="meta-icon" />
                                                <span>Location : <strong> {job.location}</strong></span>
                                            </div>

                                            <div className="meta-item">
                                                <Briefcase size={14} className="meta-icon" />
                                                <span>Job Role: <strong>{job.role} </strong></span>
                                            </div>

                                            <div className="meta-item">
                                                <Calendar size={14} className="meta-icon" />
                                                <span>Deadline : <strong>{job.deadline} </strong></span>
                                            </div>
                                        </div>
                                    </div>

                                    {/*Apply Button */}
                                    <div className="job-row-action">
                                        <button className={`btn-apply ${isApplied ? 'applied' : ''}`}
                                            disabled={isApplied}
                                            onClick={() => handleApplyClick(job)}  >

                                            {isApplied ? "Applied" : "Apply"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/*Arrow link footer */}
                    <div className="column-footer">
                        <button className="link-more">
                            View more opportunities
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </section>

                {/*Right Column : Resume Match Status */}
                <section className="dashboard-column match-column">
                    <div className="column-card-header">
                        <h3>Resume Match Status</h3>

                        {/*Company Filter Dropdown */}
                        <div className="filter-dropdown-wrapper">
                            <select className="filter-select" value={companyFilter}
                                onChange={(e) => setCompanyFilter(e.target.value)}>
                                <option value="All">All Companies</option>
                                <option value="Google">Google</option>
                                <option value="IBM">IBM</option>
                                <option value="Infosys">Infosys</option>
                            </select>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="match-table">
                            <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Job Role</th>
                                    <th>Deadline</th>
                                    <th>Match Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resumeMatches
                                    .filter(item => companyFilter === "All" || item.company === companyFilter)
                                    .map((item, index) => (
                                        <tr key={index}>
                                            <td className="company-cell">
                                                <div className="logo-mini-badge" style={{ color: item.logoColor }}>
                                                    {item.logoLetter}
                                                </div>
                                                <strong>{item.company}</strong>
                                            </td>
                                            <td>{item.role}</td>
                                            <td>{item.deadline}</td>
                                            <td>
                                                <div className="match-score-cell">
                                                    <span className="score-percentage">{item.score}%</span>
                                                    <div className="score-progress-track">
                                                        <div className="score-progress-bar"
                                                            style={{ width: `${item.score}%` }}>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="column-footer">
                        <button className="link-more">
                            View all match Status
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </section>

            </main>

            {/* Job Requirements Modal Popup Overlay */}
            {selectedJob && (
                <div className="modal-overlay">
                    <div className="requirements-modal">
                        <div className="modal-header">
                            <h4>Job Requirements - {selectedJob.role}</h4>
                            <button className="btn-close-modal" onClick={handleCancleApply}>
                                <X size={18} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <ul>
                                {selectedJob.requirements.map((req, index) => (
                                    <li key={index}>{req}</li>
                                ))}
                            </ul>

                            {selectedJob.additionalinfo && (
                                <div className="modal-additional-info">
                                    <h5>Additional Information</h5>
                                    <p>{selectedJob.additionalinfo}</p>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn-cancel-modal" onClick={handleCancleApply}>
                                Cancel
                            </button>
                            <button className="btn-confirm-apply" onClick={handleConfirmApply}>
                                Confirm & Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Profile Modal */}
            {isProfileModalOpen && (
                <div className="modal-overlay" onClick={() => setIsProfileModalOpen(false)}>
                    <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>Student Profile</h4>
                            <button className="btn-close-modal" onClick={() => setIsProfileModalOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="profile-header-avatar">
                                <div className="profile-avatar-large">
                                    {getInitials(profile.fullName)}
                                </div>
                                <h3>{profile.fullName}</h3>
                                <span className="profile-badge-text">Student Account</span>
                            </div>

                            <div className="profile-details-grid">
                                <div className="detail-item">
                                    <span className="detail-label"><User size={14} /> Full Name</span>
                                    <span className="detail-value">{profile.fullName}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label"><Mail size={14} /> Email Address</span>
                                    <span className="detail-value">{profile.email}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label"><Phone size={14} /> Phone Number</span>
                                    <span className="detail-value">{profile.phone}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label"><BookOpen size={14} /> Branch</span>
                                    <span className="detail-value">{profile.branch}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label"><Calendar size={14} /> Passing Year</span>
                                    <span className="detail-value">{profile.passingYear}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label"><Award size={14} /> CGPA</span>
                                    <span className="detail-value">{profile.cgpa}</span>
                                </div>
                                <div className="detail-item full-width">
                                    <span className="detail-label"><Briefcase size={14} /> Skills</span>
                                    <span className="detail-value">{profile.skills}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label"><Globe size={14} /> LinkedIn URL</span>
                                    <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="profile-link-url">
                                        {profile.linkedinUrl}
                                    </a>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label"><GitBranch size={14} /> GitHub URL</span>
                                    <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="profile-link-url">
                                        {profile.githubUrl}
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-cancel-modal" onClick={() => setIsProfileModalOpen(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal Overlay */}
            {isChangePasswordOpen && (
                <div className="modal-overlay" onClick={() => {
                    setIsChangePasswordOpen(false);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}>
                    <div className="change-password-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>Change Password</h4>
                            <button className="btn-close-modal" onClick={() => {
                                setIsChangePasswordOpen(false);
                                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                            }}>
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="modal-body">
                                <div className="form-group-custom">
                                    <label>Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Enter current password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-custom">
                                    <label>New Password</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Enter new password (min. 8 characters)"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-custom">
                                    <label>Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Confirm your new password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-cancel-modal"
                                    onClick={() => {
                                        setIsChangePasswordOpen(false);
                                        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-confirm-apply">
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    )


}
