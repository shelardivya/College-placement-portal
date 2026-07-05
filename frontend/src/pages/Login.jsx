import React, { useState } from 'react';
import './Login.css';
import logoGrad from '../assets/logo_grad.png';
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
    FileText,
    Briefcase,
    CheckCircle2,
    XCircle
} from 'lucide-react';

function Login({ onNavigate }) {
    //View controller state: login | forgot | reset

    const [loginView, setLoginView] =
        useState('login');

    //Toggles to show/hide raw typed passwords
    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Toast notification states
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    //Form inout state tracking
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        rememberMe: false
    });

    //Handles values change in inputs
    const handleChange = (e) => {
        const { name, value, type, checked } =
            e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ?
                checked : value
        }));
    };

    //Handles Form submissions
    const handleSubmit = (e) => {
        e.preventDefault();

        if (loginView === 'login') {
            // Check if Password matches Confirm Password
            if (formData.password !== formData.confirmPassword) {
                setToastMessage("Invalid credentials");
                setToastType('error');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                return;
            }
            console.log('Login credentials submitted:', formData);
            setToastMessage("Login successfully");
            setToastType('success');
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                onNavigate('landing');
            }, 2000);
        }


        else if (loginView === 'forgot') {
            // Trigger toast notification and redirect to reset view after 2.5s
            setToastMessage("Reset link sent successfully!");
            setToastType('success');
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                setLoginView('reset');
            }, 2500);
        }

        else if (loginView === 'reset') {
            if (formData.password
                !== formData.confirmPassword) {
                setToastMessage("Passwords do not match!");
                setToastType('error');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);

                return;
            }

            setToastMessage('Password reset successfully!');
            setToastType('success');
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                setLoginView('login');
                setFormData(prev => ({ ...prev, password: '', confirmPassword: "" }));
            }, 2000);
        }
    };

    return (
        <div className='login-page'>


            {/* MAIN PORTAL CONTAINER CARD */}
            <div className="login-container">
                {/* LEFT COLUMN: Branding & Recent Placements */}
                <div className="login-left">
                    <div className="login-logo-section">
                        <img src={logoGrad} className="logo-icon-img" alt="Logo" />
                        <span className="college-name">College Placement Portal</span>
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
                </div>

                {/* RIGHT COLUMN: Interactive Login/Forgot/Reset Forms */}
                <div className="login-right">
                    {/* Back to Home Action Button */}
                    <button className="btn-back-home" onClick={() => onNavigate('landing')}>
                        <ArrowLeft size={16} />
                        Back to Home
                    </button>

                    <div className="form-card">
                        {/* Header titles swap depending on view */}
                        {loginView === 'login' && (
                            <div className="form-header">
                                <h2>Welcome Back</h2>
                                <p>Sign in to your PlacePort account</p>
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
                                    <label>Email Address</label>
                                    <div className="input-wrapper">
                                        <Mail size={16} />
                                        <input
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
                                        <label>Password</label>
                                        <span className="link-span-forgot" onClick={() => setLoginView('forgot')}>
                                            Forgot password?
                                        </span>
                                    </div>
                                    <div className="input-wrapper">
                                        <Lock size={16} />
                                        <input
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

                            {/*Confirm Password Input (Login View)*/}
                            {loginView === 'login' && (
                                <div className='input-group full-width'>
                                    <label htmlFor="">Confirm Password</label>

                                    <div className='input-wrapper'>
                                        <Lock size={16} />

                                        <input type={showConfirmPassword ? "text" : "password"}
                                            name='confirmPassword'
                                            placeholder='confirm your password'
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            autoComplete='current-password'
                                        />

                                        <button type='button' className='btn-toggle-eye'
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }>

                                            {showConfirmPassword ? <EyeOff size={16} /> :
                                                <Eye size={16} />}

                                        </button>
                                    </div>
                                </div>

                            )}

                            {/* RESET PASSWORD INPUTS (Reset view) */}
                            {loginView === 'reset' && (
                                <>
                                    <div className="input-group full-width">
                                        <label>New Password</label>
                                        <div className="input-wrapper">
                                            <Lock size={16} />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Enter new password"
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

                                    <div className="input-group full-width">
                                        <label>Confirm Password</label>
                                        <div className="input-wrapper">
                                            <Lock size={16} />
                                            <input
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
                                New to College Placement Portal?{' '}
                                <span className="link-span-register" onClick={() => onNavigate('register')}>
                                    Create Student Account
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="form-footer-copyright">
                        © 2026  · College Placement Portal
                    </div>
                </div>
            </div>

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

export default Login;