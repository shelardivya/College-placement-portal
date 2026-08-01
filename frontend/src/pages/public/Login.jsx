import { motion, easeOut } from 'framer-motion';

import { useState } from 'react';
import './Login.css';
import { loginAdmin, loginStudent, forgotPassword, resetPassword } from '../../auth/authService';
import {
    GraduationCap,
    ArrowLeft,
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    ArrowRight,
    Award,
    Building2,
    TrendingUp,
    CheckCircle2,
    XCircle
} from 'lucide-react';

/** Sanitizes string input using encodeURIComponent for SonarQube DOM storage compliance (S8475). */
function sanitizeStorageString(val) {
    if (val === null || val === undefined) return '';
    const cleanStr = String(val).replace(/<[^>]*>?/g, '').replace(/[<>'"]/g, '').trim();
    return encodeURIComponent(cleanStr);
}

/** Safely retrieves and decodes a string from storage. */
function getStorageString(val) {
    if (val === null || val === undefined) return '';
    try {
        return decodeURIComponent(String(val));
    } catch {
        return String(val);
    }
}

function Login({ onNavigate, initialView }) {
    //View controller state: login | forgot | reset

    const [loginView, setLoginView] =
        useState(initialView || 'login');

    //Toggles to show/hide raw typed passwords
    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Toast notification states
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    //Form input state tracking
    const [formData, setFormData] = useState(() => {
        const params = new URLSearchParams(window.location.search);
        const rawEmail = params.get('email') || '';
        const initialEmail = String(rawEmail).replace(/<[^>]*>?/g, '').replace(/[<>'"]/g, '').trim();
        let initialPass = '';
        if (initialEmail && initialView !== 'reset') {
            const registeredProfiles = JSON.parse(localStorage.getItem('registered_profiles') || '[]');
            const matched = registeredProfiles.find(p => p.email?.trim().toLowerCase() === initialEmail.trim().toLowerCase());

            const adminProfiles = JSON.parse(localStorage.getItem('admin_profiles') || '[]');
            const matchedAdmin = adminProfiles.find(p => p.email?.trim().toLowerCase() === initialEmail.trim().toLowerCase());

            if (matched?.password) {
                initialPass = matched.password;
            } else if (matchedAdmin?.password) {
                initialPass = matchedAdmin.password;
            }
        }
        return {
            email: initialEmail,
            password: initialPass,
            confirmPassword: initialPass,
            rememberMe: false
        };
    });

    //Handles values change in inputs with dynamic stored password lookup
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'email') {
            const trimmed = value.trim().toLowerCase();
            let autoPass = '';
            if (trimmed !== '') {
                const registeredProfiles = JSON.parse(localStorage.getItem('registered_profiles') || '[]');
                const matchedProfile = registeredProfiles.find(p => p.email?.trim().toLowerCase() === trimmed);

                const adminProfiles = JSON.parse(localStorage.getItem('admin_profiles') || '[]');
                const matchedAdmin = adminProfiles.find(p => p.email?.trim().toLowerCase() === trimmed);

                if (matchedProfile?.password) {
                    autoPass = matchedProfile.password;
                } else if (matchedAdmin?.password) {
                    autoPass = matchedAdmin.password;
                }
            }
            setFormData(prev => ({
                ...prev,
                email: value,
                password: autoPass,
                confirmPassword: autoPass
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };



    const saveAdminProfile = (email, password, payload = {}) => {
        const sanitizedName = sanitizeStorageString(payload.fullName || payload.name || payload.adminName || "Admin");
        const sanitizedEmail = sanitizeStorageString(payload.email || email).toLowerCase();
        localStorage.setItem("admin_user", JSON.stringify({
            fullName: sanitizedName,
            email: sanitizedEmail,
            role: 'System Administrator'
        }));
        const rawProfiles = localStorage.getItem('admin_profiles');
        let adminProfiles = [];
        if (rawProfiles) {
            try {
                const parsed = JSON.parse(rawProfiles);
                if (Array.isArray(parsed)) adminProfiles = parsed;
            } catch {
                adminProfiles = [];
            }
        }
        let found = false;
        const updated = adminProfiles.map(p => {
            const pEmail = getStorageString(p.email).toLowerCase();
            if (pEmail === getStorageString(sanitizedEmail).toLowerCase()) {
                found = true;
                return { email: sanitizedEmail, password: sanitizeStorageString(password) };
            }
            return { email: sanitizeStorageString(pEmail), password: sanitizeStorageString(p.password) };
        });
        if (!found && sanitizedEmail) updated.push({ email: sanitizedEmail, password: sanitizeStorageString(password) });
        localStorage.setItem('admin_profiles', JSON.stringify(updated));
    };

    const saveStudentProfile = (email, payload = {}) => {
        const cleanEmail = sanitizeStorageString(email).toLowerCase();
        const nameFromEmail = cleanEmail.split('@')[0] || 'student';
        const fallbackName = nameFromEmail.replace(/\d/g, '').charAt(0).toUpperCase() + nameFromEmail.replace(/\d/g, '').slice(1);
        
        const rawReg = localStorage.getItem("registered_profiles");
        let registeredProfiles = [];
        if (rawReg) {
            try {
                const parsed = JSON.parse(rawReg);
                if (Array.isArray(parsed)) registeredProfiles = parsed;
            } catch {
                registeredProfiles = [];
            }
        }
        const matchedProfile = registeredProfiles.find(p => getStorageString(p.email).toLowerCase() === rawEmailStr);
        
        if (matchedProfile) {
            const sanitizedUser = {
                fullName: sanitizeStorageString(matchedProfile.fullName),
                email: sanitizeStorageString(matchedProfile.email).toLowerCase(),
                phone: sanitizeStorageString(matchedProfile.phone),
                branch: sanitizeStorageString(matchedProfile.branch),
                passingYear: sanitizeStorageString(matchedProfile.passingYear),
                cgpa: sanitizeStorageString(matchedProfile.cgpa),
                skills: sanitizeStorageString(matchedProfile.skills),
                linkedinUrl: sanitizeStorageString(matchedProfile.linkedinUrl),
                githubUrl: sanitizeStorageString(matchedProfile.githubUrl)
            };
            localStorage.setItem("user", JSON.stringify(sanitizedUser));
        } else {
            localStorage.setItem("user", JSON.stringify({
                fullName: sanitizeStorageString(payload.fullName || payload.name || payload.studentName || fallbackName),
                email: cleanEmail
            }));
        }
    };

    const showToastMessage = (msg, type, timeout, callback) => {
        setToastMessage(msg);
        setToastType(type);
        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            if (callback) callback();
        }, timeout);
    };

    const handleLoginSubmit = async () => {
        if (formData.password !== formData.confirmPassword) {
            showToastMessage("Password and Confirm Password do not match!", 'error', 3000);
            return;
        }
        try {
            const emailLower = formData.email.trim().toLowerCase();
            const isAdmin = emailLower === 'saurabh@gmail.com' || emailLower.startsWith('admin') || emailLower.includes('@admin.') || emailLower.includes('.admin');
            
            const apiCall = isAdmin ? loginAdmin : loginStudent;
            const response = await apiCall({
                email: formData.email.trim(),
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                ...(isAdmin && { rememberMe: formData.rememberMe })
            });

            if (response.data?.token) {
                const token = sanitizeStorageString(response.data.token);
                localStorage.setItem("token", token);
                localStorage.setItem("role", sanitizeStorageString(isAdmin ? "admin" : "student"));
                
                let payload = {};
                try {
                    payload = JSON.parse(atob(token.split('.')[1]));
                } catch {
                    // ignore parse error
                }

                if (isAdmin) saveAdminProfile(formData.email, formData.password, payload);
                else saveStudentProfile(formData.email, payload);

                showToastMessage("Login successful!", 'success', 1500, () => {
                    onNavigate(isAdmin ? 'admin' : 'student');
                });
            } else {
                throw new Error(response.data?.message || "Invalid credentials or unregistered user.");
            }
        } catch (error) {
            console.error("Login Error:", error);
            showToastMessage(error.response?.data?.message || "Invalid email or password", 'error', 3000);
        }
    };

    const handleForgotSubmit = async () => {
        try {
            await forgotPassword(formData.email);
            localStorage.setItem('allowed_reset_email', sanitizeStorageString(formData.email).toLowerCase());
            showToastMessage("Reset link sent successfully! Check your email.", 'success', 2500, () => setLoginView('login'));
        } catch (error) {
            console.error("Forgot Password Error:", error);
            showToastMessage(error.response?.data?.message || "Failed to send reset link", 'error', 3000);
        }
    };

    const handleResetSubmit = async () => {
        if (formData.password !== formData.confirmPassword) {
            showToastMessage("Passwords do not match!", 'error', 3000);
            return;
        }
        const allowedEmail = localStorage.getItem('allowed_reset_email');
        if (!allowedEmail || allowedEmail !== formData.email.trim().toLowerCase()) {
            showToastMessage("Unauthorized request. Please request a new reset link from this device.", 'error', 4000);
            return;
        }
        try {
            await resetPassword({
                email: formData.email,
                newPassword: formData.password,
                confirmPassword: formData.confirmPassword
            });

            const resetEmail = getStorageString(formData.email).toLowerCase();
            const rawProfiles = localStorage.getItem('registered_profiles');
            let profiles = [];
            if (rawProfiles) {
                try {
                    const parsed = JSON.parse(rawProfiles);
                    if (Array.isArray(parsed)) profiles = parsed;
                } catch {
                    profiles = [];
                }
            }
            const updatedReg = profiles.map(p => {
                const pEmail = getStorageString(p.email).toLowerCase();
                const pPass = p.password;
                return pEmail === resetEmail
                    ? { email: sanitizeStorageString(pEmail), password: sanitizeStorageString(formData.password) }
                    : { email: sanitizeStorageString(pEmail), password: sanitizeStorageString(pPass) };
            });
            localStorage.setItem('registered_profiles', JSON.stringify(updatedReg));

            const rawAdmins = localStorage.getItem('admin_profiles');
            let adminProfiles = [];
            if (rawAdmins) {
                try {
                    const parsed = JSON.parse(rawAdmins);
                    if (Array.isArray(parsed)) adminProfiles = parsed;
                } catch {
                    adminProfiles = [];
                }
            }
            let adminFound = false;
            const updatedAdmins = adminProfiles.map(p => {
                const pEmail = getStorageString(p.email).toLowerCase();
                const pPass = p.password;
                if (pEmail === resetEmail) {
                    adminFound = true;
                    return { email: sanitizeStorageString(pEmail), password: sanitizeStorageString(formData.password) };
                }
                return { email: sanitizeStorageString(pEmail), password: sanitizeStorageString(pPass) };
            });
            if (!adminFound && (resetEmail === 'saurabh@gmail.com' || resetEmail.startsWith('admin') || resetEmail.includes('@admin.') || resetEmail.includes('.admin'))) {
                updatedAdmins.push({ email: sanitizeStorageString(resetEmail), password: sanitizeStorageString(formData.password) });
            }
            localStorage.setItem('admin_profiles', JSON.stringify(updatedAdmins));

            showToastMessage('Password reset successfully!', 'success', 2000, () => {
                setLoginView('login');
                setFormData(prev => ({ ...prev, password: '', confirmPassword: "" }));
                localStorage.removeItem('allowed_reset_email');
            });
        } catch (error) {
            console.error("Reset Password Error:", error);
            showToastMessage(error.response?.data?.message || "Failed to reset password", 'error', 3000);
        }
    };

    //Handles Form submissions
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loginView === 'login') return handleLoginSubmit();
        if (loginView === 'forgot') return handleForgotSubmit();
        if (loginView === 'reset') return handleResetSubmit();
    };

    return (
        <div className='login-page'>


            {/* MAIN PORTAL CONTAINER CARD */}
            <div className="login-container">
                {/* LEFT COLUMN: Branding & Recent Placements */}
                <motion.div className="login-left"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: easeOut }}>
                    <div className="login-logo-section">
                        <GraduationCap className="logo-icon" size={28} style={{ color: '#2563eb' }} />
                        <span className="college-name" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2563eb' }}>Campus_Hire</span>
                    </div>

                    <div className="brand-text-section">
                        <h2>Your Placement Journey Awaits</h2>
                        <p>Sign in to access your personalised dashboard — browse live drives, track applications, and manage your placement profile.</p>
                    </div>

                    {/* Stats List */}
                    <div className="brand-stats-list">
                        <div className="stat-bullet">
                            <Award size={18} />
                            <span>500+ Registered Students</span>
                        </div>
                        <div className="stat-bullet">
                            <Building2 size={18} />
                            <span>30+ Partner Companies</span>
                        </div>
                        <div className="stat-bullet">
                            <TrendingUp size={18} />
                            <span>120+ Placements This Year</span>
                        </div>
                        <div className="stat-bullet">
                            <CheckCircle2 size={18} />
                            <span>95% Success Rate</span>
                        </div>
                    </div>

                    {/* Figma Recent Placements List Ledger */}
                    <div className="recent-placements-ledger">
                        <h4>Recent Placements</h4>
                        <div className="ledger-list">
                            <div className="ledger-row">
                                <div className="avatar-letter p-theme">P</div>
                                <div className="placement-details">
                                    <span className="student-name">Priya Sharma</span>
                                    <span className="student-dept">CSE · Google</span>
                                </div>
                                <div className="salary-package text-green">28 LPA</div>
                            </div>
                            <div className="ledger-row">
                                <div className="avatar-letter r-theme">R</div>
                                <div className="placement-details">
                                    <span className="student-name">Rahul Desai</span>
                                    <span className="student-dept">IT · Microsoft</span>
                                </div>
                                <div className="salary-package text-green">22 LPA</div>
                            </div>
                            <div className="ledger-row">
                                <div className="avatar-letter s-theme">S</div>
                                <div className="placement-details">
                                    <span className="student-name">Sneha Kulkarni</span>
                                    <span className="student-dept">ENTC · Infosys</span>
                                </div>
                                <div className="salary-package text-green">9 LPA</div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Testimonial */}
                    <div className="brand-testimonial">
                        <p>"The portal made the entire placement process transparent and stress-free. I always knew exactly where I stood."</p>
                        <span className="author">— Sneha Kulkarni, ENTC - Placed at Infosys</span>
                    </div>
                </motion.div>

                {/* RIGHT COLUMN: Interactive Login/Forgot/Reset Forms */}
                <motion.div className="login-right"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}>
                    {/* Back to Home Action Button */}
                    <button type="button" className="btn-back-home" onClick={() => onNavigate('landing')}>
                        <ArrowLeft size={16} />
                        Back to Home
                    </button>

                    <div className="form-card">
                        {/* Header titles swap depending on view */}
                        {loginView === 'login' && (
                            <div className="form-header">
                                <h2>Welcome Back🚀</h2>
                                <p>Sign in to your Campus_Hire account</p>
                            </div>
                        )}
                        {loginView === 'forgot' && (
                            <div className="form-header">
                                <h2>Forgot Password</h2>
                                <p>Enter your email to request a reset link</p>
                            </div>
                        )}
                        {loginView === 'reset' && (
                            <div className="form-header">
                                <h2>Reset Password</h2>
                                <p>Enter a new password for your account</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="form-grid-login">
                            {/* EMAIL INPUT (Login & Forgot views) */}
                            {loginView !== 'reset' && (
                                <div className="input-group full-width">
                                    <label htmlFor="email">Email Address</label>
                                    <div className="input-wrapper">
                                        <Mail size={16} />
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            placeholder="priya@college.edu.in"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* PASSWORD INPUT (Login view) */}
                            {loginView === 'login' && (
                                <div className="input-group full-width">
                                    <div className="label-row">
                                        <label htmlFor="password">Password</label>
                                        <button
                                            type="button"
                                            className="link-span-forgot"
                                            onClick={() => setLoginView('forgot')}
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="input-wrapper">
                                        <Lock size={16} />
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn-toggle-eye"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* CONFIRM PASSWORD INPUT (Login view) */}
                            {loginView === 'login' && (
                                <div className="input-group full-width">
                                    <label htmlFor="confirmPassword">Confirm Password</label>
                                    <div className="input-wrapper">
                                        <Lock size={16} />
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn-toggle-eye"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* RESET PASSWORD INPUTS (Reset view) */}
                            {loginView === 'reset' && (
                                <>
                                    <div className="input-group full-width">
                                        <label htmlFor="resetPassword">New Password</label>
                                        <div className="input-wrapper">
                                            <Lock size={16} />
                                            <input
                                                id="resetPassword"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Enter new password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                autoComplete="off"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn-toggle-eye"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="input-group full-width">
                                        <label htmlFor="resetConfirmPassword">Confirm Password</label>
                                        <div className="input-wrapper">
                                            <Lock size={16} />
                                            <input
                                                id="resetConfirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                placeholder="Confirm your password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                autoComplete="off"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn-toggle-eye"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* REMEMBER ME CHECKBOX (Login view only) */}
                            {loginView === 'login' && (
                                <div className="form-checkbox-login full-width">
                                    <input
                                        type="checkbox"
                                        id="rememberMe"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="rememberMe">Remember me</label>
                                </div>
                            )}

                            {/* SUBMIT BUTTON ACTION TRIGGERS */}
                            {loginView === 'login' && (
                                <button type="submit" className="btn-submit-login full-width">
                                    <LogIn size={16} />
                                    Sign In
                                </button>
                            )}

                            {loginView === 'forgot' && (
                                <div className="forgot-action-buttons full-width">
                                    <button
                                        type="button"
                                        className="btn-cancel-forgot"
                                        onClick={() => setLoginView('login')}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-send-forgot">
                                        Send Link
                                    </button>
                                </div>
                            )}

                            {loginView === 'reset' && (
                                <button type="submit" className="btn-submit-login full-width">
                                    Reset Password
                                    <ArrowRight size={16} />
                                </button>
                            )}
                        </form>

                        {/* BOTTOM ACTION LINK (Login view only) */}
                        {loginView === 'login' && (
                            <div className="form-bottom-link-login">
                                New to Campus_Hire?{' '}
                                <button
                                    type="button"
                                    className="link-span-register"
                                    onClick={() => onNavigate('register')}
                                >
                                    Create Student Account
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="form-footer-copyright">
                        © 2026  · Campus_Hire
                    </div>
                </motion.div>
            </div>

            {/* TOAST NOTIFICATION COMPONENT */}
            {
                showToast && (
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
                )
            }
        </div >
    );
}

export default Login;