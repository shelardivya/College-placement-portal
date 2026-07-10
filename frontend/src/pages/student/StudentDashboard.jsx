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
    GitBranch,
    Eye,
    EyeOff,
    ExternalLink,
    Code,
    Link,
    FileText,
    Search,
    Upload
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

    const [matchSearchQuery, setMatchSearchQuery] =
        useState("");

    // Pagination state
    const JOBS_PER_PAGE = 3;
    const MATCHES_PER_PAGE = 3;
    const [jobsPage, setJobsPage] = useState(1);
    const [matchPage, setMatchPage] = useState(1);


    // Toast notification states
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    // Resume upload states
    const [resumeFile, setResumeFile] = useState(null);
    const [resumeFileName, setResumeFileName] = useState("");




    // Sidebar visibility states
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false);

    // Modal overlay visibility states
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

    // Notification Mock Data
    const [notifications, setNotifications] = useState([
        { id: 1, text: "Google application deadline is tomorrow!", date: "Today" },
        { id: 2, text: "Your resume match score for IBM is 75%.", date: "Yesterday" },
        { id: 3, text: "New Job opening: Systems Engineer at Infosys.", date: "2 days ago" }
    ]);

    const getSkillColorClass = (skill) => {
        const s = skill.toLowerCase().trim();
        if (s.includes("react")) return "pill-react";
        if (s.includes("javascript") || s.includes("js")) return "pill-js";
        if (s.includes("node")) return "pill-node";
        if (s.includes("python")) return "pill-python";
        if (s.includes("css")) return "pill-css";
        return "pill-default";
    };

    // Gather profile information from localStorage, with clean default fallbacks
    const getInitialProfile = () => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        return {
            fullName: storedUser.fullName || "Saurabh Mishra",
            email: storedUser.email || "saurabh@gmail.com",
            phone: storedUser.phone || "",
            branch: storedUser.branch || "",
            passingYear: storedUser.passingYear || "",
            cgpa: storedUser.cgpa || "",
            skills: storedUser.skills || "",
            linkedinUrl: storedUser.linkedinUrl || "",
            githubUrl: storedUser.githubUrl || ""
        };
    };

    const [profile, setProfile] = useState(getInitialProfile());

    // Password change form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Profile Edit Mode state
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [tempProfile, setTempProfile] = useState({});

    // Password fields visibility states
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Handlers for profile editing
    const handleEditProfileClick = () => {
        setTempProfile({ ...profile });
        setIsEditingProfile(true);
    };

    const handleSaveProfile = () => {
        setProfile({ ...tempProfile });
        localStorage.setItem("user", JSON.stringify({
            ...JSON.parse(localStorage.getItem("user") || "{}"),
            fullName: tempProfile.fullName,
            email: tempProfile.email,
            phone: tempProfile.phone,
            branch: tempProfile.branch,
            passingYear: tempProfile.passingYear,
            cgpa: tempProfile.cgpa,
            skills: tempProfile.skills,
            linkedinUrl: tempProfile.linkedinUrl,
            githubUrl: tempProfile.githubUrl
        }));
        setIsEditingProfile(false);

        // Show Toast Notification
        setToastMessage("Profile updated successfully!");
        setToastType("success");
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const handleCancelEdit = () => {
        setIsEditingProfile(false);
    };

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
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
    };

    // Handles logout flow
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        onNavigate("login"); // Navigate back to public login view
    };


    // 1. Triggered when the user clicks the "Apply" button on any job card
    const handleApplyClick = (job) => {
        setSelectedJob(job);
    };

    const handleResumeFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== "application/pdf") {
                setToastMessage("Only PDF files are allowed!");
                setToastType('error');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setToastMessage("File size must be under 5MB!");
                setToastType('error');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                return;
            }
            setResumeFile(file);
            setResumeFileName(file.name);
        }
    };

    // 2. Triggered when the user clicks "Confirm and Apply" inside the requirements modal
    const handleConfirmApply = () => {
        if (!resumeFileName) {
            setToastMessage("Please upload your resume PDF first!");
            setToastType('error');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }

        if (selectedJob) {
            setAppliedJobs(prev => [...prev, selectedJob.id]);
            setToastMessage(`Successfully applied for the ${selectedJob.role} role at ${selectedJob.company}!`);
            setToastType('success');
            setShowToast(true);
            setSelectedJob(null);
            setResumeFile(null);
            setResumeFileName("");
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        }
    };

    // 3. Triggered when the user clicks "cancel" to  close the modal
    const handleCancleApply = () => {
        setSelectedJob(null);
        setResumeFile(null);
        setResumeFileName("");
    };


    const getProfileCompletion = (p) => {
        const fields = ['fullName', 'email', 'phone', 'branch', 'passingYear', 'cgpa', 'skills', 'linkedinUrl', 'githubUrl'];
        let filledCount = 0;
        fields.forEach(f => {
            if (p[f] && String(p[f]).trim() !== '') {
                filledCount++;
            }
        });
        return Math.round((filledCount / fields.length) * 100);
    };

    const profileCompletion = getProfileCompletion(profile);

    const metrics = [
        {
            id: "profile",
            title: "Profile Completed",
            value: `${profileCompletion}%`,
            icon: <User className="metric-icon-blue" />,
            colorClass: "blue",
            progress: profileCompletion,
            progess: profileCompletion
        },
        {
            id: "selected",
            title: "Selected",
            value: "5",
            icon: <CheckCircle2 className="metric-icon-green" />,
            colorClass: "green",
            progress: 50,
            progess: 50
        },
        {
            id: "pending",
            title: "Pending",
            value: "3",
            icon: <Clock className="metric-icon-orange" />,
            colorClass: "orange",
            progress: 30,
            progess: 30
        },
        {
            id: "rejected",
            title: "Rejected",
            value: "6",
            icon: <XCircle className="metric-icon-red" />,
            colorClass: "red",
            progress: 60,
            progess: 60
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
            logoLetter: "In",
            logoColor: "#007cc3",
            requirements: [
                "BE/B.Tech/M.Tech/MCA/M.Sc in CS or related fields",
                "Strong analytical and logical reasoning skills",
                "Basic understanding of programming concepts (Java, Python, or C++)",
                "Good communication skills",
                "No active backlogs"
            ],
            additionalInfo: "This is a full-time role based in Bangalore."
        },
        {
            id: "microsoft-cloud",
            company: "Microsoft",
            location: "Hyderabad",
            role: "Cloud Solution Architect",
            deadline: "10-July-2026",
            logoLetter: "MS",
            logoColor: "#f25022",
            requirements: [
                "BE/B.Tech/MCA/M.Tech in CS/IT",
                "Deep understanding of Cloud Computing concepts (Azure/AWS)",
                "Hands-on coding experience in Python, C# or Go",
                "Excellent systems design principles"
            ],
            additionalInfo: "This is a full-time remote/hybrid role based in Hyderabad."
        },
        {
            id: "amazon-sde",
            company: "Amazon",
            location: "Chennai",
            role: "Software Dev Engineer (SDE I)",
            deadline: "15-July-2026",
            logoLetter: "A",
            logoColor: "#ff9900",
            requirements: [
                "Strong foundation in DS & Algo",
                "Proficiency in Java, C++ or Python",
                "Familiarity with distributed computing and databases"
            ],
            additionalInfo: "This is a full-time role based in Chennai."
        }
    ];

    const resumeMatches = [
        {
            company: "Google",
            role: "Data Scientist",
            location: "Mumbai",
            deadline: "30-June-2026",
            score: 90,
            logoLetter: "G",
            logoColor: "#ea4335"
        },
        {
            company: "IBM",
            role: "Frontend Developer",
            location: "Pune",
            deadline: "25-June-2026",
            score: 75,
            logoLetter: "IBM",
            logoColor: "#0f62fe"
        },
        {
            company: "Infosys",
            role: "Systems Engineer",
            location: "Bangalore",
            deadline: "28-June-2026",
            score: 70,
            logoLetter: "I",
            logoColor: "#007cc3"
        },
        {
            company: "Microsoft",
            role: "Cloud Solution Architect",
            location: "Hyderabad",
            deadline: "10-July-2026",
            score: 85,
            logoLetter: "MS",
            logoColor: "#f25022"
        },
        {
            company: "Amazon",
            role: "Software Dev Engineer",
            location: "Chennai",
            deadline: "15-July-2026",
            score: 82,
            logoLetter: "A",
            logoColor: "#ff9900"
        },
        {
            company: "TCS",
            role: "Assistant Engineer",
            location: "Mumbai",
            deadline: "05-July-2026",
            score: 65,
            logoLetter: "T",
            logoColor: "#1f4a9c"
        },
        {
            company: "Wipro",
            role: "Project Engineer",
            location: "Pune",
            deadline: "02-July-2026",
            score: 60,
            logoLetter: "W",
            logoColor: "#000000"
        }
    ];


    const getJobEligibility = (job) => {
        if (!job) return {};
        let degree = "BE/B.Tech";
        let branch = "Computer Science / IT";
        let minCgpa = "6.5";
        let passingYear = "2026";
        let experience = "Fresher";
        let roleOverview = job.additionalInfo || job.additionalinfo || "This is a full-time role.";

        const jobId = (job.id || "").toLowerCase();
        if (jobId.includes("google")) {
            degree = "BE/B.Tech";
            branch = "Computer Science or related";
            minCgpa = "7.0";
            passingYear = "2026";
            experience = "Fresher";
        } else if (jobId.includes("ibm")) {
            degree = "BE/B.Tech/MCA";
            branch = "Computer Science or IT";
            minCgpa = "6.5";
            passingYear = "2026";
            experience = "Fresher";
        } else if (jobId.includes("infosys")) {
            degree = "BE/B.Tech/M.Tech/MCA/M.Sc";
            branch = "CS or related fields";
            minCgpa = "6.0";
            passingYear = "2026";
            experience = "Fresher";
        } else if (jobId.includes("microsoft")) {
            degree = "BE/B.Tech/MCA/M.Tech";
            branch = "CS/IT";
            minCgpa = "7.0";
            passingYear = "2026";
            experience = "Fresher";
        } else if (jobId.includes("amazon")) {
            degree = "BE/B.Tech";
            branch = "CS/IT";
            minCgpa = "7.5";
            passingYear = "2026";
            experience = "Fresher";
        }

        return { degree, branch, minCgpa, passingYear, experience, roleOverview };
    };




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
                            setIsNotificationSidebarOpen(true);
                            setIsProfileDropdownOpen(false);
                        }}>
                            <Bell className="bell-icon" />
                            {notifications.length > 0 && (
                                <span className="bell-badge">{notifications.length}</span>
                            )}
                        </div>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="profile-container">
                        <div className="profile-avatar" onClick={() => {
                            setIsProfileDropdownOpen(!isProfileDropdownOpen);
                            setIsNotificationSidebarOpen(false);
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
                <div className="welcome-content">
                    <h2>Welcome, {studentName} <span className="waving-hand">👋</span></h2>
                    <p>Here's whats's happening with your placement portal today.</p>
                </div>
                <div className="welcome-date-badge">
                    <span>📅 {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
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
                        {jobs
                            .slice((jobsPage - 1) * JOBS_PER_PAGE, jobsPage * JOBS_PER_PAGE)
                            .map((job) => {
                                const isApplied = appliedJobs.includes(job.id);
                                return (
                                    <div className="job-card" key={job.id}>
                                        <div className="job-card-header">
                                            <div className="company-logo-badge" style={{ borderColor: job.logoColor || job.logoClor }}>
                                                <span style={{ color: job.logoColor || job.logoClor }}>{job.logoLetter}</span>
                                            </div>
                                            <h4 className="company-name">{job.company}</h4>
                                            <button
                                                className={`btn-apply ${isApplied ? 'applied' : ''}`}
                                                disabled={isApplied}
                                                onClick={() => handleApplyClick(job)}
                                            >
                                                {isApplied ? "Applied" : "Apply"}
                                            </button>
                                        </div>
                                        <div className="job-details-meta">
                                            <div className="meta-item">
                                                <MapPin size={14} className="meta-icon" />
                                                <span className="meta-label">Location</span>
                                                <span className="meta-sep">:</span>
                                                <strong>{job.location}</strong>
                                            </div>
                                            <div className="meta-item">
                                                <Briefcase size={14} className="meta-icon" />
                                                <span className="meta-label">Job Role</span>
                                                <span className="meta-sep">:</span>
                                                <strong>{job.role}</strong>
                                            </div>
                                            <div className="meta-item">
                                                <Calendar size={14} className="meta-icon" />
                                                <span className="meta-label">Deadline</span>
                                                <span className="meta-sep">:</span>
                                                <strong className="meta-deadline">{job.deadline}</strong>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>

                    {/* Jobs Pagination */}
                    <div className="sd-pagination">
                        <button
                            className="sd-page-btn"
                            disabled={jobsPage === 1}
                            onClick={() => setJobsPage(p => p - 1)}
                        >
                            ← Prev
                        </button>
                        <span className="sd-page-info">
                            {jobsPage} / {Math.ceil(jobs.length / JOBS_PER_PAGE)}
                        </span>
                        <button
                            className="sd-page-btn"
                            disabled={jobsPage >= Math.ceil(jobs.length / JOBS_PER_PAGE)}
                            onClick={() => setJobsPage(p => p + 1)}
                        >
                            Next →
                        </button>
                    </div>
                </section>

                {/*Right Column : Resume Match Status */}
                <section className="dashboard-column match-column">
                    <div className="column-card-header">
                        <h3>Resume Match Status</h3>
                        <div className="search-bar-wrapper">
                            <Search className="search-icon" size={16} />
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search company..."
                                value={matchSearchQuery}
                                onChange={(e) => { setMatchSearchQuery(e.target.value); setMatchPage(1); }}
                            />
                        </div>
                    </div>


                    <div className="match-list">
                        {resumeMatches
                            .filter(item => item.company.toLowerCase().includes(matchSearchQuery.toLowerCase()))
                            .slice((matchPage - 1) * MATCHES_PER_PAGE, matchPage * MATCHES_PER_PAGE)
                            .map((item, index) => (
                                <div className="match-card" key={index}>
                                    {/* Top Row: Logo + Company Name on left, Score stack on right */}
                                    <div className="match-card-header">
                                        <div className="match-logo-details">
                                            <div className="logo-mini-badge" style={{ borderColor: item.logoColor }}>
                                                <span style={{ color: item.logoColor }}>{item.logoLetter}</span>
                                            </div>
                                            <h4 className="match-company-name">{item.company}</h4>
                                        </div>

                                        <div className="match-score-container">
                                            <span className="match-score-text">{item.score}% Match</span>
                                            <div className="score-progress-track">
                                                <div className="score-progress-bar" style={{ width: `${item.score}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Details Stacked below each other */}
                                    <div className="match-card-details">
                                        <div className="match-detail-item">
                                            <span className="match-detail-label">Location :</span>
                                            <strong>{item.location}</strong>
                                        </div>
                                        <div className="match-detail-item">
                                            <span className="match-detail-label">Job Role :</span>
                                            <strong>{item.role}</strong>
                                        </div>
                                        <div className="match-detail-item">
                                            <span className="match-detail-label">Deadline :</span>
                                            <strong>{item.deadline}</strong>
                                        </div>
                                    </div>

                                </div>
                            ))}
                    </div>



                    {/* Match Pagination */}
                    {(() => {
                        const filtered = resumeMatches.filter(item => item.company.toLowerCase().includes(matchSearchQuery.toLowerCase()));
                        const totalPages = Math.ceil(filtered.length / MATCHES_PER_PAGE);

                        return totalPages > 1 ? (
                            <div className="sd-pagination">
                                <button
                                    className="sd-page-btn"
                                    disabled={matchPage === 1}
                                    onClick={() => setMatchPage(p => p - 1)}
                                >
                                    ← Prev
                                </button>
                                <span className="sd-page-info">
                                    {matchPage} / {totalPages}
                                </span>
                                <button
                                    className="sd-page-btn"
                                    disabled={matchPage >= totalPages}
                                    onClick={() => setMatchPage(p => p + 1)}
                                >
                                    Next →
                                </button>
                            </div>
                        ) : null;
                    })()}
                </section>

            </main>

            {/* Job Requirements Modal Popup Overlay */}
            {selectedJob && (() => {
                const eligibility = getJobEligibility(selectedJob);
                return (
                    <div className="modal-overlay" onClick={handleCancleApply}>
                        <div className="student-apply-modal" onClick={(e) => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div className="modal-header">
                                <h4>Job Details & Eligibility</h4>
                                <button className="close-btn" onClick={handleCancleApply}>
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Form Content */}
                            <div className="modal-form">
                                <div className="form-group">
                                    <label>Company Name</label>
                                    <input
                                        type="text"
                                        value={selectedJob.company}
                                        disabled
                                        className="read-only-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Location</label>
                                    <input
                                        type="text"
                                        value={selectedJob.location || "Remote"}
                                        disabled
                                        className="read-only-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Job Requirements</label>
                                    <div className="read-only-requirements-list">
                                        {selectedJob.requirements.map((req, idx) => (
                                            <div className="requirement-bullet-item" key={idx}>
                                                <span className="requirement-bullet-dot"></span>
                                                <span className="requirement-text">{req}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Job Role Overview</label>
                                    <textarea
                                        value={`${selectedJob.role}. ${eligibility.roleOverview}`}
                                        disabled
                                        rows={3}
                                        className="read-only-textarea"
                                    />
                                </div>

                                <div className="form-section-title">Eligibility Criteria</div>

                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>Degree</label>
                                        <input
                                            type="text"
                                            value={eligibility.degree}
                                            disabled
                                            className="read-only-input"
                                        />
                                    </div>

                                    <div className="form-group half-width">
                                        <label>Branch</label>
                                        <input
                                            type="text"
                                            value={eligibility.branch}
                                            disabled
                                            className="read-only-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>Min CGPA</label>
                                        <input
                                            type="text"
                                            value={eligibility.minCgpa}
                                            disabled
                                            className="read-only-input"
                                        />
                                    </div>

                                    <div className="form-group half-width">
                                        <label>Passing Year</label>
                                        <input
                                            type="text"
                                            value={eligibility.passingYear}
                                            disabled
                                            className="read-only-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label>Experience</label>
                                        <input
                                            type="text"
                                            value={eligibility.experience}
                                            disabled
                                            className="read-only-input"
                                        />
                                    </div>

                                    <div className="form-group half-width">
                                        <label>Deadline</label>
                                        <input
                                            type="text"
                                            value={selectedJob.deadline}
                                            disabled
                                            className="read-only-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-section-title">Upload Documents</div>

                                <div className="form-group full-width-resume">
                                    <label>Upload Resume (PDF only) <span className="required-star">*</span></label>
                                    <div className="resume-upload-zone">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleResumeFileChange}
                                            id="modal-resume-file"
                                            className="file-input-hidden"
                                        />
                                        <label htmlFor="modal-resume-file" className="file-upload-label">
                                            {resumeFileName ? (
                                                <div className="file-uploaded-info">
                                                    <FileText className="file-icon-pdf" size={24} />
                                                    <div className="file-meta">
                                                        <span className="file-name-text">{resumeFileName}</span>
                                                        <span className="file-size-text">{(resumeFile?.size / 1024).toFixed(1)} KB</span>
                                                    </div>
                                                    <button className="file-remove-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setResumeFileName(""); setResumeFile(null); }}>Remove</button>
                                                </div>
                                            ) : (
                                                <div className="file-upload-placeholder">
                                                    <Upload size={24} className="upload-icon" />
                                                    <span>Click to upload or drag & drop resume PDF</span>
                                                    <span className="file-type-hint">PDF file up to 5MB</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-cancel" onClick={handleCancleApply}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn-post" onClick={handleConfirmApply}>
                                        Confirm & Apply
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}


            {/* View/Edit Profile Modal */}
            {isProfileModalOpen && (
                <div className="modal-overlay" onClick={() => {
                    setIsProfileModalOpen(false);
                    setIsEditingProfile(false);
                }}>
                    <div className="student-apply-modal" onClick={(e) => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="modal-header">
                            <h4>{isEditingProfile ? "Edit Profile" : "Student Profile"}</h4>
                            <button className="close-btn" onClick={() => {
                                setIsProfileModalOpen(false);
                                setIsEditingProfile(false);
                            }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Form Content */}
                        <div className="modal-form" style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
                            <div className="form-row">
                                <div className="form-group half-width">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        value={isEditingProfile ? tempProfile.fullName : profile.fullName}
                                        disabled={!isEditingProfile}
                                        onChange={(e) => setTempProfile({ ...tempProfile, fullName: e.target.value })}
                                        className={isEditingProfile ? "editable-input" : "read-only-input"}
                                    />
                                </div>

                                <div className="form-group half-width">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        value={isEditingProfile ? tempProfile.email : profile.email}
                                        disabled={!isEditingProfile}
                                        onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                                        className={isEditingProfile ? "editable-input" : "read-only-input"}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group half-width">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        value={isEditingProfile ? tempProfile.phone : profile.phone}
                                        disabled={!isEditingProfile}
                                        onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                                        className={isEditingProfile ? "editable-input" : "read-only-input"}
                                        placeholder="Not Provided"
                                    />
                                </div>

                                <div className="form-group half-width">
                                    <label>Branch</label>
                                    <input
                                        type="text"
                                        value={isEditingProfile ? tempProfile.branch : profile.branch}
                                        disabled={!isEditingProfile}
                                        onChange={(e) => setTempProfile({ ...tempProfile, branch: e.target.value })}
                                        className={isEditingProfile ? "editable-input" : "read-only-input"}
                                        placeholder="Not Provided"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group half-width">
                                    <label>Passing Year</label>
                                    <input
                                        type="text"
                                        value={isEditingProfile ? tempProfile.passingYear : profile.passingYear}
                                        disabled={!isEditingProfile}
                                        onChange={(e) => setTempProfile({ ...tempProfile, passingYear: e.target.value })}
                                        className={isEditingProfile ? "editable-input" : "read-only-input"}
                                        placeholder="Not Provided"
                                    />
                                </div>

                                <div className="form-group half-width">
                                    <label>CGPA</label>
                                    <input
                                        type="text"
                                        value={isEditingProfile ? tempProfile.cgpa : profile.cgpa}
                                        disabled={!isEditingProfile}
                                        onChange={(e) => setTempProfile({ ...tempProfile, cgpa: e.target.value })}
                                        className={isEditingProfile ? "editable-input" : "read-only-input"}
                                        placeholder="Not Provided"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Skills</label>
                                <input
                                    type="text"
                                    value={isEditingProfile ? tempProfile.skills : profile.skills}
                                    disabled={!isEditingProfile}
                                    onChange={(e) => setTempProfile({ ...tempProfile, skills: e.target.value })}
                                    className={isEditingProfile ? "editable-input" : "read-only-input"}
                                    placeholder="Enter comma separated skills (e.g. React, CSS)"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group half-width">
                                    <label>LinkedIn URL</label>
                                    {isEditingProfile ? (
                                        <input
                                            type="text"
                                            value={tempProfile.linkedinUrl}
                                            onChange={(e) => setTempProfile({ ...tempProfile, linkedinUrl: e.target.value })}
                                            className="editable-input"
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    ) : (
                                        <div className="link-display-wrapper">
                                            <input
                                                type="text"
                                                value={profile.linkedinUrl || "Not Provided"}
                                                disabled
                                                className="read-only-input"
                                            />
                                            {profile.linkedinUrl && (
                                                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="link-visit-btn">
                                                    <ExternalLink size={14} /> Visit
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group half-width">
                                    <label>GitHub URL</label>
                                    {isEditingProfile ? (
                                        <input
                                            type="text"
                                            value={tempProfile.githubUrl}
                                            onChange={(e) => setTempProfile({ ...tempProfile, githubUrl: e.target.value })}
                                            className="editable-input"
                                            placeholder="https://github.com/username"
                                        />
                                    ) : (
                                        <div className="link-display-wrapper">
                                            <input
                                                type="text"
                                                value={profile.githubUrl || "Not Provided"}
                                                disabled
                                                className="read-only-input"
                                            />
                                            {profile.githubUrl && (
                                                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="link-visit-btn">
                                                    <ExternalLink size={14} /> Visit
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-actions" style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                                {isEditingProfile ? (
                                    <>
                                        <button type="button" className="btn-cancel" onClick={handleCancelEdit}>
                                            Cancel
                                        </button>
                                        <button type="button" className="btn-post" onClick={handleSaveProfile}>
                                            Save Changes
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" className="btn-cancel" onClick={() => {
                                            setIsProfileModalOpen(false);
                                            setIsEditingProfile(false);
                                        }}>
                                            Close
                                        </button>
                                        <button type="button" className="btn-post" onClick={handleEditProfileClick}>
                                            Edit Profile
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Password Modal Overlay */}
            {isChangePasswordOpen && (
                <div className="modal-overlay" onClick={() => {
                    setIsChangePasswordOpen(false);
                    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                    setShowCurrentPassword(false);
                    setShowNewPassword(false);
                    setShowConfirmPassword(false);
                }}>
                    <div className="change-password-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>Change Password</h4>
                            <button className="btn-close-modal" onClick={() => {
                                setIsChangePasswordOpen(false);
                                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                setShowCurrentPassword(false);
                                setShowNewPassword(false);
                                setShowConfirmPassword(false);
                            }}>
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className="modal-body">
                                <div className="form-group-custom">
                                    <label>Current Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            required
                                            placeholder="Enter current password"
                                            value={passwordForm.currentPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        >
                                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group-custom">
                                    <label>New Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            required
                                            placeholder="Enter new password (min. 8 characters)"
                                            value={passwordForm.newPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                        >
                                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group-custom">
                                    <label>Confirm New Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            placeholder="Confirm your new password"
                                            value={passwordForm.confirmPassword}
                                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-btn"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn-cancel-modal"
                                    onClick={() => {
                                        setIsChangePasswordOpen(false);
                                        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                                        setShowCurrentPassword(false);
                                        setShowNewPassword(false);
                                        setShowConfirmPassword(false);
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

            {/* Notifications Sidebar Panel */}
            {isNotificationSidebarOpen && (
                <div className="sd-notification-sidebar-overlay" onClick={() => setIsNotificationSidebarOpen(false)}>
                    <div className="sd-notification-sidebar" onClick={(e) => e.stopPropagation()}>
                        <div className="sidebar-header">
                            <div className="header-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Bell size={20} className="sidebar-bell-icon" style={{ color: '#2563eb' }} />
                                <h4 style={{ margin: 0 }}>Notifications</h4>
                            </div>
                            <button className="btn-close-sidebar" onClick={() => setIsNotificationSidebarOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>
                        <div className="sidebar-body">
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
                </div>
            )}

            {/* TOAST NOTIFICATION COMPONENT */}

            {showToast && (
                <div className={`sd-toast-notification ${toastType}`}>
                    <div className="sd-toast-icon">
                        {toastType === 'success' ? (
                            <CheckCircle2 size={18} />
                        ) : (
                            <XCircle size={18} />
                        )}
                    </div>
                    <span className="sd-toast-text">{toastMessage}</span>
                </div>
            )}
        </div>
    )


}
