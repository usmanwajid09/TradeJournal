import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Globe, Layout, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import logo from '../assets/logo.png';

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
                    {/* Grid lines (Background) */}
                    {[40, 80, 120, 160].map(y => (
                        <line key={y} x1="20" y1={y} x2="260" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    ))}
                    {/* Background Candles (Charcoal Gray) */}
                    <rect x="40" y="100" width="12" height="40" rx="2" fill="#27272A" />
                    <rect x="75" y="80" width="12" height="60" rx="2" fill="#27272A" />
                    <rect x="110" y="110" width="12" height="30" rx="2" fill="#27272A" />
                    <rect x="200" y="90" width="12" height="50" rx="2" fill="#27272A" />
                    <rect x="235" y="70" width="12" height="70" rx="2" fill="#27272A" />

                    {/* Magnifying Glass Lens Area */}
                    <circle cx="160" cy="100" r="70" fill="none" stroke="#6B7280" strokeWidth="6" />
                    <circle cx="160" cy="100" r="67" fill="#121214" />
                    
                    {/* Candlesticks (Inside Lens) */}
                    <g transform="translate(115, 60)">
                        {/* Green BTC Candle */}
                        <g transform="translate(10, 20)">
                            <line x1="8" y1="-10" x2="8" y2="60" stroke="#10B981" strokeWidth="2" />
                            <rect x="0" y="5" width="16" height="40" rx="2" fill="#10B981" />
                            <text x="8" y="30" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">₿</text>
                        </g>
                        {/* Red Loss Candle */}
                        <g transform="translate(35, 30)">
                            <line x1="8" y1="-5" x2="8" y2="55" stroke="#EF4444" strokeWidth="2" />
                            <rect x="0" y="5" width="16" height="35" rx="2" fill="#EF4444" />
                        </g>
                        {/* Taller Green Tesla Candle */}
                        <g transform="translate(60, 5)">
                            <line x1="8" y1="-8" x2="8" y2="70" stroke="#10B981" strokeWidth="2" />
                            <rect x="0" y="10" width="16" height="50" rx="2" fill="#10B981" />
                            <text x="8" y="42" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">T</text>
                        </g>
                        {/* Red Loss Candle */}
                        <g transform="translate(85, 25)">
                            <line x1="8" y1="-5" x2="8" y2="60" stroke="#EF4444" strokeWidth="2" />
                            <rect x="0" y="10" width="16" height="35" rx="2" fill="#EF4444" />
                        </g>
                    </g>

                    {/* Magnifying Glass Handle */}
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
                    
                    {/* Gain Card */}
                    <g transform="translate(40, 40)">
                        <rect width="200" height="60" rx="12" fill="#1A1A1E" />
                        <circle cx="30" cy="30" r="18" fill="#10B981" />
                        <path d="M25 35 L35 25 M35 25 L29 25 M35 25 L35 31" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <text x="65" y="38" fill="white" fontSize="18" fontWeight="bold" fontFamily="Inter">+1.5%</text>
                        <text x="135" y="36" fill="#6B7280" fontSize="12" fontWeight="500">Weekly Gain</text>
                    </g>
                    
                    {/* Loss Card */}
                    <g transform="translate(40, 120)">
                        <rect width="200" height="60" rx="12" fill="#1A1A1E" />
                        <circle cx="30" cy="30" r="18" fill="#EF4444" />
                        <path d="M25 25 L35 35 M35 35 L29 35 M35 35 L35 29" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        <text x="65" y="38" fill="white" fontSize="18" fontWeight="bold" fontFamily="Inter">-2.3%</text>
                        <text x="135" y="36" fill="#6B7280" fontSize="12" fontWeight="500">Weekly Loss</text>
                    </g>
                </svg>
            )
        },
        {
            title: "Master Your Strategy",
            desc: "Refine your trading edge by documenting your mindset and patterns across every trade execution.",
            svg: (
                <svg width="280" height="220" viewBox="0 0 280 220" className="illustration-svg">
                    <rect x="0" y="0" width="280" height="220" fill="transparent" />
                    <circle cx="140" cy="110" r="80" fill="rgba(63, 108, 246, 0.05)" />
                    <rect x="80" y="70" width="120" height="80" rx="8" fill="#1A1A1E" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                    {[85, 100, 115, 130].map((y, i) => (
                        <rect key={y} x="95" y={y} width={i % 2 === 0 ? "90" : "60"} height="6" rx="3" fill="#27272A" />
                    ))}
                    <circle cx="180" cy="130" r="20" fill="#3B82F6" />
                    <path d="M174 130 L178 134 L186 126" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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
        <div className="auth-split-container">
            {/* LEFT SIDE: FORM */}
            <div className="flex-grow-1 d-flex align-items-center justify-content-center bg-deep p-4">
                <div className="auth-container" style={{ maxWidth: '400px', width: '100%' }}>
                    <div className="form-logo mb-5 text-center">
                        <img src={logo} alt="TradeJournal" style={{ height: '50px', width: 'auto' }} />
                    </div>

                    <h1 className="form-title h3 fw-bold text-white mb-2">Sign in</h1>
                    <p className="form-sub text-secondary mb-4">Please enter your credentials to access your journal</p>

                    {error && <Alert variant="danger" className="py-2 small mb-4">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <div className="field mb-3">
                            <label className="form-label">Email Address</label>
                            <div className="input-wrap position-relative d-flex align-items-center">
                                <Mail size={16} className="position-absolute ms-3 text-secondary" />
                                <input 
                                    type="email" 
                                    className="form-input ps-5" 
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="field mb-3">
                            <label className="form-label">Password</label>
                            <div className="input-wrap position-relative d-flex align-items-center">
                                <Lock size={16} className="position-absolute ms-3 text-secondary" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="form-input px-5" 
                                    placeholder="Minimum 8 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <div 
                                    className="position-absolute end-0 me-3 cursor-pointer text-secondary"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </div>
                            </div>
                        </div>

                        <div className="text-end mb-4">
                            <a href="#" className="text-accent small text-decoration-none" style={{ fontSize: '12px' }}>Forgot password?</a>
                        </div>

                        <Button variant="primary" type="submit" className="btn-primary w-100 py-3 fw-bold mb-4 shadow-sm">
                            Sign In
                        </Button>

                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="flex-grow-1 border-bottom border-subtle"></div>
                            <span className="text-secondary small fw-bold">OR CONTINUE WITH</span>
                            <div className="flex-grow-1 border-bottom border-subtle"></div>
                        </div>

                        <div className="d-flex gap-3 mb-5">
                            <Button variant="outline-secondary" className="btn-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2">
                                <Globe size={18} />
                                Google
                            </Button>
                            <Button variant="outline-secondary" className="btn-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2">
                                <Layout size={18} />
                                GitHub
                            </Button>
                        </div>

                        <p className="text-center text-secondary small">
                            Don't have an account? <span className="text-accent cursor-pointer fw-bold">Sign up</span>
                        </p>
                    </Form>
                </div>
            </div>

            {/* RIGHT SIDE: BRANDING & ONBOARDING SLIDER */}
            <div className="auth-sidebar position-relative overflow-hidden d-none d-lg-flex">
                <div className="onboarding-slider w-100 d-flex flex-column align-items-center justify-content-center h-100 px-5">
                    
                    {/* Brand Identifier (Top Middle) */}
                    <div className="position-absolute top-0 start-50 translate-middle-x pt-5 text-center">
                        <img src={logo} alt="TradeJournal" style={{ height: '32px', width: 'auto', opacity: 0.6 }} />
                    </div>

                    <div ref={slideRef} className="w-100 text-center">
                        {slides[currentSlide].svg}
                        <h4 className="fw-bold text-white mb-2 mt-4">{slides[currentSlide].title}</h4>
                        <p className="text-secondary small lh-base mx-auto" style={{ maxWidth: '300px' }}>
                            {slides[currentSlide].desc}
                        </p>
                    </div>

                    {/* Pagination Controls */}
                    <div className="position-absolute bottom-0 w-100 pb-5 d-flex flex-column align-items-center gap-4">
                        <div className="carousel-nav d-flex align-items-center gap-4">
                            <button className="carousel-arrow" onClick={prevSlide}>
                                <ChevronLeft size={20} />
                            </button>
                            <div className="carousel-dots d-flex gap-2">
                                {slides.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`dot ${currentSlide === i ? 'active' : ''}`}
                                        style={{ 
                                            width: currentSlide === i ? '24px' : '8px', 
                                            height: '8px', 
                                            borderRadius: '4px', 
                                            background: currentSlide === i ? '#FFFFFF' : '#404040',
                                            transition: 'all 0.4s ease'
                                        }}
                                        onClick={() => setCurrentSlide(i)}
                                    ></div>
                                ))}
                            </div>
                            <button className="carousel-arrow" onClick={nextSlide}>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;


