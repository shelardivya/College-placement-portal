import { motion, AnimatePresence } from 'framer-motion';

import { useState, useEffect } from "react";
import { getStudentProfile, updateStudentProfile, changePassword, getStudentDashboardStats, getLatestJobs, getJobDetails, applyForJob, getStudentResumeMatch, getStudentNotifications, markAllStudentNotificationsAsRead, getStudentUnreadCount } from '../../auth/authService';
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
    X,
    Lock,
    LogOut,
    Eye,
    EyeOff,
    ExternalLink,
    FileText,
    Search,
    Upload,
} from "lucide-react";
import "./StudentDashboard.css";
import StudHub from "./StudHub";

// Default fallback mock data for Placement Drives
const initialDrives = [];


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

    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'studhub'


    // Sync states from localStorage (with mock fallbacks)
    const [drives] = useState(() => {
        const stored = localStorage.getItem("placement_drives");
        return stored ? JSON.parse(stored) : initialDrives;
    });



    // Filter drives targeted to this student
    const studentEmail = (loggedInUser.email || "").toLowerCase().trim();
    const studentNameFilter = (loggedInUser.fullName || loggedInUser.name || "").toLowerCase().trim();
    const studentFilteredDrives = drives.filter(drive => {
        let targets = drive.targetStudent || [];
        if (typeof targets === 'string') {
            targets = targets.split(',').map(t => t.trim());
        }

        const lowerTargets = targets.map(t => typeof t === 'string' ? t.toLowerCase().trim() : '');

        if (lowerTargets.length === 0 || lowerTargets.includes("") || lowerTargets.includes("all")) {
            return true;
        }

        const matchEmail = studentEmail !== "" && lowerTargets.some(t => t.includes(studentEmail));
        const matchName = studentNameFilter !== "" && lowerTargets.some(t => t.includes(studentNameFilter));

        return matchEmail || matchName;
    });

    // Find the next upcoming/open event sorted by date
    const activeDrives = studentFilteredDrives.filter(d => d.status === 'open' || d.status === 'upcoming');
    const getParsedDate = (dateStr) => {
        try {
            const d = new Date(dateStr);
            return Number.isNaN(d.getTime()) ? new Date("9999-12-31") : d;
        } catch {
            return new Date("9999-12-31");
        }
    };
    activeDrives.sort((a, b) => getParsedDate(a.date) - getParsedDate(b.date));






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

    // Notification Data
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const response = await getStudentNotifications();
            if (response.data) {
                const data = Array.isArray(response.data) ? response.data :
                    (response.data.content || []);
                // Sort by date descending (assuming it's not already sorted, optional but good UX)
                const parseDateStr = (dateStr, timeStr) => {
                    if (!dateStr) return 0;
                    // dateStr is DD/MM/YYYY, timeStr is hh:mm A
                    const [day, month, year] = dateStr.split('/');
                    if (!year) return new Date(dateStr).getTime() || 0;
                    const d = new Date(`${year}-${month}-${day}T00:00:00`);
                    if (timeStr) {
                        const match = timeStr.match(/(\d{1,2}):(\d{2})\s(AM|PM)/);
                        if (match) {
                            let [, h, m, ampm] = match;
                            h = Number.parseInt(h);
                            if (ampm === 'PM' && h < 12) h += 12;
                            if (ampm === 'AM' && h === 12) h = 0;
                            d.setHours(h, Number.parseInt(m));
                        }
                    }
                    return d.getTime();
                };
                const sorted = data.sort((a, b) => parseDateStr(b.createdDate, b.createdTime) - parseDateStr(a.createdDate, a.createdTime));

                const localizedData = sorted.map(notif => {
                    if (notif.createdDate && notif.createdTime) {
                        const [day, month, year] = notif.createdDate.split('/');
                        const match = notif.createdTime.match(/(\d{1,2}):(\d{2})\s(AM|PM)/);
                        if (day && month && year && match) {
                            let [, h, m, ampm] = match;
                            h = Number.parseInt(h);
                            if (ampm === 'PM' && h < 12) h += 12;
                            if (ampm === 'AM' && h === 12) h = 0;
                            m = Number.parseInt(m);

                            const utcDate = new Date(Date.UTC(year, month - 1, day, h, m));

                            notif.displayDate = utcDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                            notif.displayTime = utcDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
                        }
                    }
                    return notif;
                });
                setNotifications(localizedData);
            }

            const countResponse = await getStudentUnreadCount();
            if (countResponse.data !== undefined) {
                // If it returns an object like { count: 5 } or just a number
                const count = typeof countResponse.data === 'object' ? (countResponse.data.count || countResponse.data.unreadCount || 0) : countResponse.data;
                setUnreadCount(count);
            }
        } catch (error) {
            console.error("Error fetching notifications or unread count:", error);
        }
    };

    useEffect(() => {
        const load = async () => {
            await fetchNotifications();
        };
        load();
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await markAllStudentNotificationsAsRead();
            await fetchNotifications();
            setToastMessage("All notifications marked as read");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            console.error("Error marking all read:", error);
        }
    };





    // Gather profile information from localStorage, with clean default fallbacks
    const getInitialProfile = () => {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        return {
            fullName: storedUser.fullName || "Student Name",
            email: storedUser.email || "student@portal.edu",
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

    const [dashboardStats, setDashboardStats] = useState(null);

    useEffect(() => {
        const fetchStudentProfile = async () => {
            try {
                const response = await getStudentProfile();
                if (response.data) {
                    const freshData = {
                        fullName: response.data.fullName || response.data.name || "",
                        email: response.data.email || "",
                        phone: response.data.mobile || response.data.phone || "",
                        branch: response.data.department || response.data.branch || "",
                        passingYear: response.data.currentYear || response.data.passingYear || "",
                        cgpa: response.data.cgpa || "0.0",
                        skills: response.data.skills || "",
                        linkedinUrl: response.data.linkedinUrl || "",
                        githubUrl: response.data.githubUrl || ""
                    };

                    setProfile(prev => ({
                        ...prev,
                        ...freshData
                    }));

                    // Update localStorage so next time we refresh or login, it has the fresh data!
                    const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
                    localStorage.setItem("user", JSON.stringify({
                        ...existingUser,
                        ...freshData
                    }));

                }
            } catch (error) {
                console.error("Error fetching student profile:", error);
            }
        };

        const fetchDashboardStats = async () => {
            try {
                const response = await getStudentDashboardStats();
                if (response.data) {
                    setDashboardStats(response.data);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };

        fetchStudentProfile();
        fetchDashboardStats();
    }, []);

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

    const handleSaveProfile = async () => {
        try {
            // Map state to API payload based on Swagger specs
            const payload = {
                fullName: tempProfile.fullName || "",
                email: tempProfile.email || "",
                mobile: tempProfile.phone || "",
                course: "", // Frontend doesn't currently collect this
                department: tempProfile.branch || "",
                currentYear: tempProfile.passingYear || "",
                cgpa: Number.parseFloat(tempProfile.cgpa) || 0.0,
                skills: tempProfile.skills || "",
                linkedinUrl: tempProfile.linkedinUrl || "",
                githubUrl: tempProfile.githubUrl || "",
                role: "Student" // Optional default
            };

            await updateStudentProfile(payload);

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
        } catch (error) {
            console.error("Failed to update profile:", error);
            setToastMessage("Failed to update profile.");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };

    const handleCancelEdit = () => {
        setIsEditingProfile(false);
    };

    // Handles password change submission
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setToastMessage("New passwords do not match!");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }

        try {
            await changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmPassword: passwordForm.confirmPassword
            });

            // UPDATE LOCAL STORAGE PASSWORD FOR AUTOFILL
            const userEmail = loggedInUser.email;
            if (userEmail) {
                const profiles = JSON.parse(localStorage.getItem('registered_profiles') || '[]');
                const updatedProfiles = profiles.map(p => {
                    if (p.email && p.email.trim().toLowerCase() === userEmail.trim().toLowerCase()) {
                        return { ...p, password: passwordForm.newPassword };
                    }
                    return p;
                });
                localStorage.setItem('registered_profiles', JSON.stringify(updatedProfiles));
            }

            setToastMessage("Password updated successfully!");
            setToastType("success");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            setIsChangePasswordOpen(false);
            setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
        } catch (error) {
            console.error("Error changing password:", error);
            setToastMessage(error.response?.data?.message || "Failed to change password. Please check your current password.");
            setToastType("error");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }
    };




    // Handles logout flow
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        onNavigate("login"); // Navigate back to public login view
    };


    // 1. Triggered when the user clicks the "Apply" button on any job card
    const handleApplyClick = async (job) => {
        try {
            const response = await getJobDetails(job.id);
            if (response.data) {
                let requirementsArray = response.data.jobRequirements || response.data.requirements || [];
                if (typeof requirementsArray === 'string') {
                    requirementsArray = requirementsArray.split(',').map(s => s.trim()).filter(Boolean);
                }
                setSelectedJob({ ...job, ...response.data, requirements: requirementsArray });
            } else {
                setSelectedJob(job);
            }
        } catch (error) {
            console.error("Failed to fetch full job details", error);
            setSelectedJob(job);
        }
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
    const handleConfirmApply = async () => {
        if (!resumeFileName || !resumeFile) {
            setToastMessage("Please upload your resume PDF first!");
            setToastType('error');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }

        if (selectedJob) {
            try {
                const formData = new FormData();
                formData.append('resume', resumeFile);

                await applyForJob(selectedJob.id, formData);

                setAppliedJobs(prev => [...prev, selectedJob.id]);
                setToastMessage(`Successfully applied for the ${selectedJob.role} role at ${selectedJob.company}!`);
                setToastType('success');
                setShowToast(true);

                setSelectedJob(null);
                setResumeFile(null);
                setResumeFileName("");

            } catch (error) {
                console.error("Failed to apply for job:", error);
                if (error.response?.status === 409) {
                    setToastMessage(error.response.data?.message || "You have already applied for this job.");
                    setToastType('error');
                    setAppliedJobs(prev => [...new Set([...prev, selectedJob.id])]);
                    setSelectedJob(null);
                    setResumeFile(null);
                    setResumeFileName("");
                } else {
                    setToastMessage("Failed to apply for the job. Please try again.");
                    setToastType('error');
                }
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
            }
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
            value: dashboardStats ? `${dashboardStats.profileCompleted || 0}%` : `${profileCompletion}%`,
            icon: <User className="metric-icon-blue" />,
            colorClass: "blue",
            progress: dashboardStats ? (dashboardStats.profileCompleted || 0) : profileCompletion,
            progess: dashboardStats ? (dashboardStats.profileCompleted || 0) : profileCompletion
        },
        {
            id: "selected",
            title: "Selected",
            value: dashboardStats ? String(dashboardStats.selected || 0) : "0",
            icon: <CheckCircle2 className="metric-icon-green" />,
            colorClass: "green",
            progress: dashboardStats?.selected ? 100 : 0,
            progess: dashboardStats?.selected ? 100 : 0
        },
        {
            id: "pending",
            title: "Pending",
            value: dashboardStats ? String(dashboardStats.pending || 0) : "0",
            icon: <Clock className="metric-icon-orange" />,
            colorClass: "orange",
            progress: dashboardStats?.pending ? 100 : 0,
            progess: dashboardStats?.pending ? 100 : 0
        },
        {
            id: "rejected",
            title: "Rejected",
            value: dashboardStats ? String(dashboardStats.rejected || 0) : "0",
            icon: <XCircle className="metric-icon-red" />,
            colorClass: "red",
            progress: dashboardStats?.rejected ? 100 : 0,
            progess: dashboardStats?.rejected ? 100 : 0
        }
    ];

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await getLatestJobs();
                let jobList = [];
                if (response.data) {
                    if (Array.isArray(response.data)) {
                        jobList = response.data;
                    } else if (response.data.content && Array.isArray(response.data.content)) {
                        jobList = response.data.content;
                    } else if (response.data.jobs && Array.isArray(response.data.jobs)) {
                        jobList = response.data.jobs;
                    }
                }

                if (jobList.length > 0) {
                    const mappedJobs = jobList.map(job => {
                        const firstLetter = job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C';

                        const reqString = job.jobRequirements || job.requirements || job.skillsRequired || "";
                        const requirementsArray = reqString
                            ? reqString.split(/[,\n]/).map(req => req.trim()).filter(Boolean)
                            : ["No specific requirements listed"];

                        return {
                            id: job.id,
                            company: job.companyName || job.company,
                            logoLetter: firstLetter,
                            logoColor: '#2563eb',
                            location: job.location || "Remote",
                            role: job.jobRoleOverview || job.jobRole || job.title,
                            deadline: job.deadline,
                            requirements: requirementsArray.length > 0 ? requirementsArray : ["No specific requirements listed"],
                            additionalinfo: job.jobRoleOverview || job.jobRole || job.title,
                            degree: job.degree || job.Degree || job.degreeRequired,
                            branch: job.branch || job.Branch || job.branchRequired,
                            minCgpa: job.minCgpa ?? job.MinCgpa ?? job.cgpa,
                            passingYear: job.passingYear || job.PassingYear || job.year,
                            experience: job.experience || job.Experience || job.experienceRequired,
                            isApplied: job.applied || job.isApplied || job.hasApplied || false
                        };
                    });

                    setJobs(mappedJobs);
                }
            } catch (error) {
                console.error("Error fetching latest jobs:", error);
            }
        };
        fetchJobs();
    }, []);

    const [resumeMatches, setResumeMatches] = useState([]);

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await getStudentResumeMatch();
                if (response.data && Array.isArray(response.data)) {
                    // Assuming data might have companyName, role, matchScore, etc.
                    const mapped = response.data.map(m => {
                        const firstLetter = m.companyName ? m.companyName.charAt(0).toUpperCase() : 'C';
                        return {
                            company: m.companyName || 'Company',
                            role: m.jobRole || m.role || 'Job Role',
                            location: m.location || 'Location',
                            deadline: m.deadline || 'Upcoming',
                            score: m.matchPercentage ?? m.matchScore ?? 0,
                            logoLetter: firstLetter,
                            logoColor: '#ea4335' // Default
                        };
                    });
                    setResumeMatches(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch resume matches:", error);
            }
        };
        fetchMatches();
    }, []);

    const getJobEligibility = (job) => {
        if (!job) return {};

        let degree = job.degree || job.Degree || job.degreeRequired || "Not specified";
        let branch = job.branch || job.Branch || job.branchRequired || "Not specified";
        let minCgpa = String(job.minCgpa ?? job.MinCgpa ?? job.cgpa ?? "Not specified");
        let passingYear = job.passingYear || job.PassingYear || job.year || "Not specified";
        let experience = job.experience || job.Experience || job.experienceRequired || "Not specified";
        let roleOverview = job.additionalInfo || job.additionalinfo || job.jobRoleOverview || "This is a full-time role.";

        return { degree, branch, minCgpa, passingYear, experience, roleOverview };
    };




    return (
        <div className="dashboard-container">


            <header className="dashboard-header">

                <div className="header-logo">
                    <GraduationCap className="logo-icon" />
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2563eb' }}>Campus_Hire</h1>
                </div>

                <div className="student-nav-tabs">
                    <button type="button"
                        className={`student-nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <span>Dashboard</span>
                        {activeTab === 'dashboard' && <span className="tab-underline" />}
                    </button>
                    <button type="button"
                        className={`student-nav-tab ${activeTab === 'studhub' ? 'active' : ''}`}
                        onClick={() => setActiveTab('studhub')}
                    >
                        <span>Stud Hub</span>
                        {activeTab === 'studhub' && <span className="tab-underline" />}
                    </button>
                </div>

                <div className="header-actions">
                    <span className="role-badge">Student</span>


                    <div className="notification-bell-container">
                        <button type="button" className="notification-bell" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }} onClick={() => {
                            setIsNotificationSidebarOpen(true);
                            setIsProfileDropdownOpen(false);
                        }}>
                            <motion.div style={{ display: 'flex' }} whileHover={{ rotate: [0, -15, 15, -15, 15, 0] }} transition={{ duration: 0.5 }}>
                                <Bell className="bell-icon" />
                            </motion.div>
                            {unreadCount > 0 && (
                                <motion.span
                                    className="bell-badge"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                    style={{ width: '16px', height: '16px', borderRadius: '50%', right: '-2px', top: '-2px', fontSize: '0.55rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    {unreadCount}
                                </motion.span>
                            )}
                        </button>
                    </div>


                    <div className="profile-container">
                        <button type="button" className="profile-avatar" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }} onClick={() => {
                            setIsProfileDropdownOpen(!isProfileDropdownOpen);
                            setIsNotificationSidebarOpen(false);
                        }}>
                            <span className="avatar-placeholder">{getInitials(studentName)}</span>
                        </button>

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


            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
                >
                    {activeTab === 'dashboard' && (
                        <>
                            <section className="welcome-section">
                                <div className="welcome-content">
                                    <h2>Welcome, {studentName} <span className="waving-hand">👋</span></h2>
                                    <p>Here's whats's happening with your placement portal today.</p>
                                </div>
                                <div className="welcome-date-badge">
                                    <span>📅 {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                            </section>


                            <section className="metrics-grid">
                                {metrics.map((metric, index) => (
                                    <motion.div className="metric-card" key={metric.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        transition={{ duration: 0.4, delay: index * 0.15 }}>
                                        <div className="metric-header">
                                            <div className={`metric-icon-wrapper ${metric.colorClass}`}>
                                                {metric.icon}
                                            </div>

                                            <div className="metric-info">
                                                <span className="metric-title"> {metric.title}</span>
                                                <span className="metric-value">{metric.value}</span>
                                            </div>
                                        </div>


                                        <div className="metric-progress-container">
                                            <div className={`metric-progress-bar ${metric.colorClass}`}

                                                style={{ width: `${metric.progess || metric.progress}%` }}>
                                            </div>

                                        </div>

                                    </motion.div>
                                ))}

                            </section>




                            <main className="dashboard-main-content">


                                <section className="dashboard-column jobs-column">
                                    <div className="column-card-header">
                                        <h3>Latest Job Opportunities</h3>
                                    </div>

                                    <div className="job-list">
                                        {jobs && jobs.length > 0 ? (
                                            jobs
                                                .slice((jobsPage - 1) * JOBS_PER_PAGE, jobsPage * JOBS_PER_PAGE)
                                                .map((job, index) => {
                                                    const isApplied = job.isApplied || appliedJobs.includes(job.id);
                                                    return (
                                                        <motion.div className="job-card" key={job.id}
                                                            initial={{ opacity: 0, y: -20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: index * 0.08, type: "spring", stiffness: 300, damping: 24 }}>
                                                            <div className="job-card-header">
                                                                <div className="company-logo-badge" style={{ borderColor: job.logoColor || job.logoClor || '#e2e8f0' }}>
                                                                    <img
                                                                        src={job.logoUrl || job.logo || `https://www.google.com/s2/favicons?domain=${job.company.toLowerCase().replace(/\s+/g, '')}.com&sz=128`}
                                                                        alt={job.company}
                                                                        className="company-logo-img"
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'inline';
                                                                        }}
                                                                    />
                                                                    <span style={{ color: job.logoColor || job.logoClor, display: 'none' }}>
                                                                        {job.logoLetter || job.company.charAt(0)}
                                                                    </span>
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
                                                        </motion.div>
                                                    );
                                                })
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                                                <p>No new job opportunities are currently available for your profile.</p>
                                            </div>
                                        )}
                                    </div>

                                    {jobs && jobs.length > JOBS_PER_PAGE && (
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
                                    )}
                                </section>


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
                                        {(() => {
                                            const filtered = resumeMatches.filter(item => item.company.toLowerCase().includes(matchSearchQuery.toLowerCase()));
                                            if (filtered.length === 0) {
                                                return (
                                                    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                                                        <p>No resume matches found.</p>
                                                    </div>
                                                );
                                            }
                                            return filtered
                                                .slice((matchPage - 1) * MATCHES_PER_PAGE, matchPage * MATCHES_PER_PAGE)
                                                .map((item, index) => (
                                                    <motion.div className="match-card" key={item.id || item.company}
                                                        initial={{ opacity: 0, y: 15 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3, delay: index * 0.1 }}>

                                                        <div className="match-card-header">
                                                            <div className="match-logo-details">
                                                                <div className="logo-mini-badge" style={{ borderColor: item.logoColor || '#e2e8f0' }}>
                                                                    <img
                                                                        src={item.logoUrl || item.logo || `https://www.google.com/s2/favicons?domain=${item.company.toLowerCase().replace(/\s+/g, '')}.com&sz=128`}
                                                                        alt={item.company}
                                                                        className="company-logo-img"
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'inline';
                                                                        }}
                                                                    />
                                                                    <span style={{ color: item.logoColor, display: 'none' }}>
                                                                        {item.logoLetter || item.company.charAt(0)}
                                                                    </span>
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

                                                    </motion.div>
                                                ));
                                        })()}
                                    </div>




                                    {(() => {
                                        const filtered = resumeMatches.filter(item => item.company.toLowerCase().includes(matchSearchQuery.toLowerCase()));
                                        const totalPages = Math.max(1, Math.ceil(filtered.length / MATCHES_PER_PAGE));

                                        return (
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
                                        );
                                    })()}
                                </section>

                            </main>
                        </>
                    )}


                    {activeTab === 'studhub' && <StudHub />}
                </motion.div>
            </AnimatePresence>


            {selectedJob && (() => {
                const eligibility = getJobEligibility(selectedJob);
                return (
                    <div className="modal-overlay">
                        <button type="button" aria-label="Close modal" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', border: 'none', cursor: 'default' }} onClick={handleCancleApply} onKeyDown={(e) => { if (e.key === 'Escape') handleCancleApply(); }} />
                        <div className="student-apply-modal" style={{ position: 'relative', zIndex: 1 }}>

                            <div className="modal-header">
                                <h4>Job Details & Eligibility</h4>
                                <button className="close-btn" onClick={handleCancleApply}>
                                    <X size={20} />
                                </button>
                            </div>


                            <div className="modal-form">
                                <div className="form-group">
                                    <label htmlFor="modal-company">Company Name</label>
                                    <input
                                        id="modal-company"
                                        type="text"
                                        value={selectedJob.company}
                                        disabled
                                        className="read-only-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="modal-location">Location</label>
                                    <input
                                        id="modal-location"
                                        type="text"
                                        value={selectedJob.location || "Remote"}
                                        disabled
                                        className="read-only-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <div className="pseudo-label" style={{ fontWeight: 500, marginBottom: '0.5rem', color: '#1e293b', fontSize: '0.875rem' }}>Job Requirements</div>
                                    <div className="read-only-requirements-list">
                                        {(selectedJob.requirements || []).map((req) => (
                                            <div className="requirement-bullet-item" key={req}>
                                                <span className="requirement-bullet-dot"></span>
                                                <span className="requirement-text">{req}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="modal-role">Job Role Overview</label>
                                    <textarea
                                        id="modal-role"
                                        value={selectedJob.role || "Not specified"}
                                        disabled
                                        rows={3}
                                        className="read-only-textarea"
                                    />
                                </div>

                                <div className="form-section-title">Eligibility Criteria</div>

                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label htmlFor="modal-degree">Degree</label>
                                        <input
                                            id="modal-degree"
                                            type="text"
                                            value={eligibility.degree}
                                            disabled
                                            className="read-only-input"
                                        />
                                    </div>

                                    <div className="form-group half-width">
                                        <label htmlFor="modal-branch">Branch</label>
                                        <input
                                            id="modal-branch"
                                            type="text"
                                            value={eligibility.branch}
                                            disabled
                                            className="read-only-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label htmlFor="modal-minCgpa">Min CGPA</label>
                                        <input
                                            id="modal-minCgpa"
                                            type="text"
                                            value={eligibility.minCgpa}
                                            disabled
                                            className="read-only-input"
                                        />
                                    </div>

                                    <div className="form-group half-width">
                                        <label htmlFor="modal-passingYear">Passing Year</label>
                                        <input
                                            id="modal-passingYear"
                                            type="text"
                                            value={eligibility.passingYear}
                                            disabled
                                            className="read-only-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group half-width">
                                        <label htmlFor="modal-experience">Experience</label>
                                        <input
                                            id="modal-experience"
                                            type="text"
                                            value={eligibility.experience}
                                            disabled
                                            className="read-only-input"
                                        />
                                    </div>

                                    <div className="form-group half-width">
                                        <label htmlFor="modal-deadline">Deadline</label>
                                        <input
                                            id="modal-deadline"
                                            type="text"
                                            value={selectedJob.deadline}
                                            disabled
                                            className="read-only-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-section-title">Upload Documents</div>

                                <div className="form-group full-width-resume">
                                    <label htmlFor="modal-resume-file">Upload Resume (PDF only) <span className="required-star">*</span></label>
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



            {isProfileModalOpen && (
                <div className="modal-overlay">
                    <button type="button" aria-label="Close modal" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', border: 'none', cursor: 'default' }} onClick={() => { setIsProfileModalOpen(false); setIsEditingProfile(false); }} onKeyDown={(e) => { if (e.key === 'Escape') { setIsProfileModalOpen(false); setIsEditingProfile(false); } }} />
                    <div className="student-apply-modal" style={{ position: 'relative', zIndex: 1 }}>

                        <div className="modal-header">
                            <h4>{isEditingProfile ? "Edit Profile" : "Student Profile"}</h4>
                            <button className="close-btn" onClick={() => {
                                setIsProfileModalOpen(false);
                                setIsEditingProfile(false);
                            }}>
                                <X size={20} />
                            </button>
                        </div>


                        <div className="modal-form" style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
                            <div className="form-row">
                                <div className="form-group half-width">
                                    <label htmlFor="profile-fullName">Full Name</label>
                                    <input
                                        id="profile-fullName"
                                        type="text"
                                        value={isEditingProfile ? tempProfile.fullName : profile.fullName}
                                        disabled={!isEditingProfile}
                                        onChange={(e) => setTempProfile({ ...tempProfile, fullName: e.target.value })}
                                        className={isEditingProfile ? "editable-input" : "read-only-input"}
                                    />
                                </div>

                                <div className="form-group half-width">
                                    <label htmlFor="profile-email">Email Address</label>
                                    <input
                                        id="profile-email"
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
                                    <label htmlFor="profile-phone">Phone Number</label>
                                    <input
                                        id="profile-phone"
                                        type="text"
                                        value={isEditingProfile ? tempProfile.phone : profile.phone}
                                        disabled={!isEditingProfile}
                                        onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                                        className={isEditingProfile ? "editable-input" : "read-only-input"}
                                        placeholder="Not Provided"
                                    />
                                </div>

                                <div className="form-group half-width">
                                    <label htmlFor="profile-branch">Branch</label>
                                    <input
                                        id="profile-branch"
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
                                    <label htmlFor="profile-passingYear">Passing Year</label>
                                    <input
                                        id="profile-passingYear"
                                        type="text"
                                        value={isEditingProfile ? tempProfile.passingYear : profile.passingYear}
                                        disabled={!isEditingProfile}
                                        onChange={(e) => setTempProfile({ ...tempProfile, passingYear: e.target.value })}
                                        className={isEditingProfile ? "editable-input" : "read-only-input"}
                                        placeholder="Not Provided"
                                    />
                                </div>

                                <div className="form-group half-width">
                                    <label htmlFor="profile-cgpa">CGPA</label>
                                    <input
                                        id="profile-cgpa"
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
                                <label htmlFor="profile-skills">Skills</label>
                                <input
                                    id="profile-skills"
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
                                    <label htmlFor="profile-linkedin">LinkedIn URL</label>
                                    {isEditingProfile ? (
                                        <input
                                            id="profile-linkedin"
                                            type="text"
                                            value={tempProfile.linkedinUrl}
                                            onChange={(e) => setTempProfile({ ...tempProfile, linkedinUrl: e.target.value })}
                                            className="editable-input"
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    ) : (
                                        <div className="link-display-wrapper">
                                            <input
                                                id="profile-linkedin"
                                                type="text"
                                                value={profile.linkedinUrl || "Not Provided"}
                                                disabled
                                                className="read-only-input"
                                            />
                                            {profile.linkedinUrl && (
                                                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="link-visit-btn">
                                                    <ExternalLink size={14} /> Visit LinkedIn
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="form-group half-width">
                                    <label htmlFor="profile-github">GitHub URL</label>
                                    {isEditingProfile ? (
                                        <input
                                            id="profile-github"
                                            type="text"
                                            value={tempProfile.githubUrl}
                                            onChange={(e) => setTempProfile({ ...tempProfile, githubUrl: e.target.value })}
                                            className="editable-input"
                                            placeholder="https://github.com/username"
                                        />
                                    ) : (
                                        <div className="link-display-wrapper">
                                            <input
                                                id="profile-github"
                                                type="text"
                                                value={profile.githubUrl || "Not Provided"}
                                                disabled
                                                className="read-only-input"
                                            />
                                            {profile.githubUrl && (
                                                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="link-visit-btn">
                                                    <ExternalLink size={14} /> Visit GitHub
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


            {isChangePasswordOpen && (
                <div className="modal-overlay">
                    <button type="button" aria-label="Close modal" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', border: 'none', cursor: 'default' }} onClick={() => { setIsChangePasswordOpen(false); setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); setShowCurrentPassword(false); setShowNewPassword(false); setShowConfirmPassword(false); }} onKeyDown={(e) => { if (e.key === 'Escape') { setIsChangePasswordOpen(false); setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); setShowCurrentPassword(false); setShowNewPassword(false); setShowConfirmPassword(false); } }} />
                    <div className="change-password-modal" style={{ position: 'relative', zIndex: 1 }}>
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
                                    <label htmlFor="currentPassword">Current Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            id="currentPassword"
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
                                    <label htmlFor="newPassword">New Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            id="newPassword"
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
                                    <label htmlFor="confirmPassword">Confirm New Password</label>
                                    <div className="password-input-wrapper">
                                        <input
                                            id="confirmPassword"
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


            {isNotificationSidebarOpen && (
                <div className="sd-notification-sidebar-overlay">
                    <button type="button" aria-label="Close sidebar" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', background: 'transparent', border: 'none', cursor: 'default' }} onClick={() => setIsNotificationSidebarOpen(false)} onKeyDown={(e) => { if (e.key === 'Escape') setIsNotificationSidebarOpen(false); }} />
                    <div className="sd-notification-sidebar" style={{ position: 'relative', zIndex: 1 }}>
                        <div className="sidebar-header">
                            <div className="header-title-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Bell size={20} className="sidebar-bell-icon" style={{ color: '#2563eb' }} />
                                <h4 style={{ margin: 0 }}>Notifications</h4>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        style={{ fontSize: '0.8rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Mark all as read
                                    </button>
                                )}
                                <button className="btn-close-sidebar" onClick={() => setIsNotificationSidebarOpen(false)}>
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
                                    
                                    let formattedDate = notif.date;
                                    if (notif.displayDate) {
                                        formattedDate = `${notif.displayDate} at ${notif.displayTime}`;
                                    } else if (notif.createdDate) {
                                        formattedDate = `${notif.createdDate} ${notif.createdTime ? 'at ' + notif.createdTime : ''}`;
                                    } else if (notif.createdAt) {
                                        formattedDate = new Date(notif.createdAt).toLocaleString();
                                    }

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
                                            <span className="notif-date">{formattedDate}</span>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}



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


