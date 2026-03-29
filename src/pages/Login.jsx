import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Globe, Layout, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideRef = useRef(null);
    const navigate = useNavigate();

    const slides = [
        {
            title: "Analyze Every Trade Like a Pro",
            desc: "Log your entries, track your P&L, and uncover patterns in your trading behavior with powerful analytics.",
            svg: (
                <svg width="280" height="220" viewBox="0 0 280 220" className="illustration-svg">
                    <rect x="0" y="0" width="280" height="220" fill="transparent" />
                    {[40, 80, 120, 160].map(y => (
                        <line key={y} x1="20" y1={y} x2="260" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    ))}
                    <rect x="40" y="100" width="12" height="40" rx="2" fill="#27272A" />
                    <rect x="75" y="80" width="12" height="60" rx="2" fill="#27272A" />
                    <rect x="110" y="110" width="12" height="30" rx="2" fill="#27272A" />
                    <rect x="200" y="90" width="12" height="50" rx="2" fill="#27272A" />
                    <rect x="235" y="70" width="12" height="70" rx="2" fill="#27272A" />
                    <circle cx="160" cy="100" r="70" fill="none" stroke="#6B7280" strokeWidth="6" />
                    <circle cx="160" cy="100" r="67" fill="#121214" />
                    <g transform="translate(115, 60)">
                        <g transform="translate(10, 20)">
                            <line x1="8" y1="-10" x2="8" y2="60" stroke="#10B981" strokeWidth="2" />
                            <rect x="0" y="5" width="16" height="40" rx="2" fill="#10B981" />
                        </g>
                        <g transform="translate(35, 30)">
                            <line x1="8" y1="-5" x2="8" y2="55" stroke="#EF4444" strokeWidth="2" />
                            <rect x="0" y="5" width="16" height="35" rx="2" fill="#EF4444" />
                        </g>
                        <g transform="translate(60, 5)">
                            <line x1="8" y1="-8" x2="8" y2="70" stroke="#10B981" strokeWidth="2" />
                            <rect x="0" y="10" width="16" height="50" rx="2" fill="#10B981" />
                        </g>
                    </g>
                    <path d="M120 150 L95 185" stroke="#6B7280" strokeWidth="10" strokeLinecap="round" />
                </svg>
            )
        },
        {
            title: "Performance Tracking",
            desc: "Visualize your positive gains and negative losses with distinct, easy-to-read performance indicators.",
            svg: (
                <svg width="280" height="220" viewBox="0 0 280 220" className="illustration-svg">
                    <rect x="0" y="0" width="280" height="220" fill="transparent" />
                    <g transform="translate(40, 40)">
                        <rect width="200" height="60" rx="12" fill="#1A1A1E" />
                        <circle cx="30" cy="30" r="18" fill="#10B981" />
                        <text x="65" y="38" fill="white" fontSize="18" fontWeight="bold">PnL Curve</text>
                    </g>
                </svg>
            )
        }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(slideRef.current, 
                { opacity: 0, x: 50 }, 
                { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
            );
        }, slideRef);
        return () => ctx.revert();
    }, [currentSlide]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email && password) {
            navigate('/dashboard');
        } else {
            setError('Please enter both email and password.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-form-side">
                <div className="login-form-container">
                    <div className="login-header">
                        <div className="temp-logo">TJ</div>
                        <h1 className="text-xl mt-6">Welcome Back</h1>
                        <p className="text-sm text-tertiary">Sign in to your trading engine</p>
                    </div>

                    {error && <div className="error-alert">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="text-xs text-tertiary uppercase ls-caps">Email Address</label>
                            <div className="input-with-icon">
                                <Mail size={16} className="icon" />
                                <input 
                                    type="email" 
                                    className="input icon-padding" 
                                    placeholder="trader@journal.io"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group mt-4">
                            <label className="text-xs text-tertiary uppercase ls-caps">Password</label>
                            <div className="input-with-icon">
                                <Lock size={16} className="icon" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="input icon-padding" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button"
                                    className="eye-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="button-primary w-full mt-8">Sign In</button>

                        <div className="divider">
                            <span>OR</span>
                        </div>

                        <div className="social-login">
                            <button type="button" className="button-ghost flex-1">Google</button>
                            <button type="button" className="button-ghost flex-1">GitHub</button>
                        </div>

                        <p className="auth-footer text-xs text-tertiary">
                            Don't have an account? <span className="text-blue cursor-pointer">Sign up</span>
                        </p>
                    </form>
                </div>
            </div>

            <div className="login-visual-side">
                <div className="onboarding-carousel">
                    <div ref={slideRef} className="carousel-slide">
                        {slides[currentSlide].svg}
                        <h2 className="text-lg mt-6">{slides[currentSlide].title}</h2>
                        <p className="text-sm text-tertiary mt-2">{slides[currentSlide].desc}</p>
                    </div>
                    
                    <div className="carousel-controls">
                        <button className="carousel-arrow" onClick={prevSlide}><ChevronLeft size={20} /></button>
                        <div className="carousel-dots">
                            {slides.map((_, i) => (
                                <div key={i} className={`dot ${currentSlide === i ? 'active' : ''}`} onClick={() => setCurrentSlide(i)}></div>
                            ))}
                        </div>
                        <button className="carousel-arrow" onClick={nextSlide}><ChevronRight size={20} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
