import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ChevronLeft, ChevronRight, TrendingUp, BarChart2, BookOpen, Zap } from 'lucide-react';
import gsap from 'gsap';

// ── Onboarding slides ────────────────────────────────────────────────────────
const SLIDES = [
    {
        icon: <TrendingUp size={48} style={{ color: 'var(--accent-blue)' }} />,
        title: 'Analyze Every Trade Like a Pro',
        desc:  'Log your entries, track your P&L, and uncover hidden patterns in your trading behaviour with powerful analytics.',
        accent: 'var(--accent-blue)',
        glow:   'rgba(79, 124, 255, 0.2)',
        stat:   { label: 'Win Rate', value: '68.4%', up: true },
        chart: (
            <svg width="260" height="100" viewBox="0 0 260 100">
                <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4F7CFF" stopOpacity="0.35"/>
                        <stop offset="100%" stopColor="#4F7CFF" stopOpacity="0"/>
                    </linearGradient>
                </defs>
                {[20,40,60,80].map(y=><line key={y} x1="0" y1={y} x2="260" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>)}
                <path d="M0 85 Q30 78 60 74 T120 55 T180 38 T260 18 V100 H0Z" fill="url(#g1)"/>
                <path d="M0 85 Q30 78 60 74 T120 55 T180 38 T260 18"
                    stroke="#4F7CFF" strokeWidth="2.5" fill="none" strokeLinecap="round"
                    style={{ filter: 'drop-shadow(0 0 4px rgba(79,124,255,0.6))' }}/>
                <circle cx="260" cy="18" r="4" fill="#4F7CFF" style={{ filter: 'drop-shadow(0 0 6px #4F7CFF)' }}/>
            </svg>
        ),
    },
    {
        icon: <BarChart2 size={48} style={{ color: 'var(--color-positive)' }} />,
        title: 'Real-Time Market Intelligence',
        desc:  'Live prices from Binance & Twelve Data. Paper trade with $10,000 virtual credits — zero real risk.',
        accent: 'var(--color-positive)',
        glow:   'rgba(0, 230, 118, 0.18)',
        stat:   { label: 'BTC Live', value: '$67,451', up: true },
        chart: (
            <svg width="260" height="100" viewBox="0 0 260 100">
                {[0,1,2,3,4,5,6].map((_, i) => {
                    const heights = [55,35,70,45,80,30,65];
                    const ups     = [true,false,true,true,false,true,true];
                    const x = 20 + i*34;
                    return (
                        <g key={i}>
                            <line x1={x+7} y1={100-heights[i]-12} x2={x+7} y2={100-heights[i]+heights[i]+8}
                                stroke={ups[i] ? 'var(--color-positive)' : 'var(--color-negative)'} strokeWidth="1.5"/>
                            <rect x={x} y={100-heights[i]} width="14" height={heights[i]} rx="2"
                                fill={ups[i] ? 'var(--color-positive)' : 'var(--color-negative)'} opacity="0.85"/>
                        </g>
                    );
                })}
            </svg>
        ),
    },
    {
        icon: <BookOpen size={48} style={{ color: 'var(--accent-purple)' }} />,
        title: 'Journal Every Edge You Find',
        desc:  'Capture your thought process, mood, and strategy. Build a compounding knowledge base from every trade you take.',
        accent: 'var(--accent-purple)',
        glow:   'rgba(167, 139, 250, 0.18)',
        stat:   { label: 'Trades Logged', value: '142', up: true },
        chart: (
            <svg width="260" height="100" viewBox="0 0 260 100">
                {['😎','😊','😐','😤','🔥','😎','😊'].map((m, i) => (
                    <text key={i} x={20+i*34} y={50} fontSize="22" textAnchor="middle">{m}</text>
                ))}
                {[{ label:'Strategy', val:78 },{ label:'Discipline', val:64 },{ label:'Patience', val:91 }].map((d,i)=>(
                    <g key={i} transform={`translate(0, ${60+i*0})`}>
                        <text x="0" y={68+i*0} fill="rgba(255,255,255,0)" fontSize="0">{d.label}</text>
                    </g>
                ))}
                <rect x="0" y="68" width="260" height="8" rx="4" fill="rgba(255,255,255,0.05)"/>
                <rect x="0" y="68" width="204" height="8" rx="4" fill="var(--accent-purple)" opacity="0.7"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(167,139,250,0.5))' }}/>
                <rect x="0" y="83" width="260" height="8" rx="4" fill="rgba(255,255,255,0.05)"/>
                <rect x="0" y="83" width="165" height="8" rx="4" fill="var(--accent-purple)" opacity="0.5"/>
            </svg>
        ),
    },
    {
        icon: <Zap size={48} style={{ color: '#F59E0B' }} />,
        title: 'Built for Serious Traders',
        desc:  'Track risk/reward, execution quality, and account growth — all in one premium, no-distraction workspace.',
        accent: '#F59E0B',
        glow:   'rgba(245, 158, 11, 0.18)',
        stat:   { label: 'Avg R:R', value: '1:2.4', up: true },
        chart: (
            <svg width="260" height="100" viewBox="0 0 260 100">
                <defs>
                    <linearGradient id="g4" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#F59E0B"/>
                        <stop offset="100%" stopColor="#EF4444"/>
                    </linearGradient>
                </defs>
                <circle cx="130" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8"/>
                <circle cx="130" cy="50" r="44" fill="none" stroke="url(#g4)" strokeWidth="8"
                    strokeDasharray="276" strokeDashoffset="80" strokeLinecap="round"
                    transform="rotate(-90 130 50)"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.4))' }}/>
                <text x="130" y="46" textAnchor="middle" fill="white" fontSize="14" fontWeight="800">1:2.4</text>
                <text x="130" y="62" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">RISK/REWARD</text>
            </svg>
        ),
    },
];

const Login = () => {
    const [email, setEmail]             = useState('');
    const [password, setPassword]       = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError]             = useState('');
    const [loading, setLoading]         = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideRef  = useRef(null);
    const formRef   = useRef(null);
    const navigate  = useNavigate();

    // Auto-advance slides
    useEffect(() => {
        const t = setInterval(() => setCurrentSlide(p => (p + 1) % SLIDES.length), 4500);
        return () => clearInterval(t);
    }, []);

    // GSAP slide transition
    useEffect(() => {
        if (!slideRef.current) return;
        gsap.fromTo(slideRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }
        );
    }, [currentSlide]);

    // GSAP form entrance
    useEffect(() => {
        if (!formRef.current) return;
        gsap.fromTo(formRef.current.children,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'power2.out' }
        );
    }, []);

    const nextSlide = () => setCurrentSlide(p => (p + 1) % SLIDES.length);
    const prevSlide = () => setCurrentSlide(p => (p - 1 + SLIDES.length) % SLIDES.length);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) { setError('Please enter both email and password.'); return; }
        setLoading(true); setError('');
        setTimeout(() => { setLoading(false); navigate('/dashboard'); }, 800);
    };

    const slide = SLIDES[currentSlide];

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'var(--bg-deep)', overflow: 'hidden', fontFamily: 'Inter, sans-serif' }}>

            {/* ── LEFT: FORM SIDE ───────────────────────────────────────────── */}
            <div style={{ flex: '0 0 45%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative', zIndex: 2 }}>

                {/* Subtle radial behind form */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(79,124,255,0.04) 0%, transparent 70%)',
                }}/>

                <div ref={formRef} style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '0' }}>

                    {/* Logo */}
                    <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                        <div style={{
                            width: '56px', height: '56px',
                            background: 'var(--gradient-primary)',
                            borderRadius: '16px',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '16px',
                            boxShadow: '0 8px 32px rgba(79,124,255,0.3)',
                            animation: 'float 4s ease-in-out infinite',
                        }}>
                            <TrendingUp size={26} color="#fff"/>
                        </div>
                        <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.8px', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '6px' }}>
                            TradeJournal
                        </h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Sign in to your trading workspace</p>
                    </div>

                    {/* Card */}
                    <div style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '20px',
                        padding: '32px',
                        boxShadow: 'var(--shadow-elevated)',
                    }}>
                        <h2 style={{ color: 'var(--text-primary)', fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>Welcome back 👋</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>Enter your credentials to continue</p>

                        {/* Error */}
                        {error && (
                            <div style={{ background: 'var(--color-negative-dim)', border: '1px solid rgba(255,68,68,0.3)', color: 'var(--color-negative)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', marginBottom: '16px', animation: 'scaleIn 0.2s ease' }}>
                                ⚠️ {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Email */}
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>
                                    Email Address
                                </label>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <Mail size={15} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)', pointerEvents: 'none' }}/>
                                    <input
                                        id="email-input"
                                        type="email"
                                        placeholder="trader@journal.io"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        style={{
                                            width: '100%', padding: '12px 14px 12px 42px',
                                            background: 'var(--bg-input)', border: '1px solid var(--border-input)',
                                            borderRadius: '10px', color: 'var(--text-primary)',
                                            fontSize: '14px', outline: 'none', fontFamily: 'inherit',
                                            transition: 'all 0.15s',
                                        }}
                                        onFocus={e => { e.target.style.borderColor = 'var(--accent-blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(79,124,255,0.15)'; }}
                                        onBlur={e  => { e.target.style.borderColor = 'var(--border-input)'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                                        Password
                                    </label>
                                    <span style={{ fontSize: '11px', color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</span>
                                </div>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    <Lock size={15} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)', pointerEvents: 'none' }}/>
                                    <input
                                        id="password-input"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        style={{
                                            width: '100%', padding: '12px 42px 12px 42px',
                                            background: 'var(--bg-input)', border: '1px solid var(--border-input)',
                                            borderRadius: '10px', color: 'var(--text-primary)',
                                            fontSize: '14px', outline: 'none', fontFamily: 'inherit',
                                            transition: 'all 0.15s',
                                        }}
                                        onFocus={e => { e.target.style.borderColor = 'var(--accent-blue)'; e.target.style.boxShadow = '0 0 0 3px rgba(79,124,255,0.15)'; }}
                                        onBlur={e  => { e.target.style.borderColor = 'var(--border-input)'; e.target.style.boxShadow = 'none'; }}
                                    />
                                    <button type="button" onClick={() => setShowPassword(p => !p)}
                                        style={{ position: 'absolute', right: '14px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0', display: 'flex' }}>
                                        {showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                id="signin-btn"
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%', padding: '13px',
                                    background: loading ? 'rgba(79,124,255,0.5)' : 'var(--gradient-primary)',
                                    border: 'none', borderRadius: '10px',
                                    color: '#fff', fontSize: '14px', fontWeight: 700,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 4px 16px rgba(79,124,255,0.3)',
                                    transition: 'all 0.15s', fontFamily: 'inherit',
                                    marginTop: '4px',
                                }}
                                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 24px rgba(79,124,255,0.4)'; }}}
                                onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 16px rgba(79,124,255,0.3)'; }}
                            >
                                {loading ? 'Signing in…' : 'Sign In →'}
                            </button>

                            {/* Divider */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}/>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }}/>
                            </div>

                            {/* Social */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {[
                                    { label: '🌐 Google', id: 'google-btn' },
                                    { label: '🐙 GitHub', id: 'github-btn' },
                                ].map(s => (
                                    <button key={s.id} id={s.id} type="button"
                                        style={{
                                            flex: 1, padding: '11px',
                                            background: 'rgba(255,255,255,0.04)',
                                            border: '1px solid var(--border-subtle)',
                                            borderRadius: '10px', color: 'var(--text-secondary)',
                                            fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                                            fontFamily: 'inherit', transition: 'all 0.15s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='var(--text-primary)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='var(--text-secondary)'; }}
                                    >{s.label}</button>
                                ))}
                            </div>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                        Don't have an account?{' '}
                        <span style={{ color: 'var(--accent-blue)', fontWeight: 600, cursor: 'pointer' }}>Create one free</span>
                    </p>
                </div>
            </div>

            {/* ── RIGHT: ANIMATED VISUAL SIDE ───────────────────────────────── */}
            <div style={{
                flex: 1,
                background: 'var(--bg-sidebar)',
                borderLeft: '1px solid var(--border-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Background glow that changes per slide */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${slide.glow} 0%, transparent 70%)`,
                    transition: 'background 0.8s ease',
                }}/>

                {/* Decorative grid */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03 }}>
                    {[...Array(12)].map((_,i) => <line key={i} x1={`${i*9}%`} y1="0" x2={`${i*9}%`} y2="100%" stroke="white" strokeWidth="1"/>)}
                    {[...Array(8)].map((_,i)  => <line key={i} x1="0" y1={`${i*14}%`} x2="100%" y2={`${i*14}%`} stroke="white" strokeWidth="1"/>)}
                </svg>

                <div style={{ position: 'relative', zIndex: 2, maxWidth: '460px', width: '100%', padding: '40px', textAlign: 'center' }}>

                    {/* Slide content */}
                    <div ref={slideRef}>
                        {/* Icon with glow */}
                        <div style={{
                            width: '88px', height: '88px',
                            borderRadius: '24px',
                            background: `linear-gradient(145deg, ${slide.glow}, rgba(255,255,255,0.03))`,
                            border: `1px solid ${slide.glow}`,
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '28px',
                            boxShadow: `0 0 40px ${slide.glow}`,
                            animation: 'float 4s ease-in-out infinite',
                        }}>
                            {slide.icon}
                        </div>

                        {/* Mini chart */}
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: '16px',
                            padding: '20px',
                            marginBottom: '24px',
                        }}>
                            {/* Stat badge */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{slide.stat.label}</span>
                                <span style={{ fontSize: '15px', fontWeight: 800, color: slide.stat.up ? 'var(--color-positive)' : 'var(--color-negative)', fontVariantNumeric: 'tabular-nums' }}>
                                    {slide.stat.up ? '▲' : '▼'} {slide.stat.value}
                                </span>
                            </div>
                            {slide.chart}
                        </div>

                        <h2 style={{ color: 'var(--text-primary)', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '12px', lineHeight: 1.3 }}>
                            {slide.title}
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '32px' }}>
                            {slide.desc}
                        </p>
                    </div>

                    {/* Carousel controls */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                        <button onClick={prevSlide} style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='var(--text-secondary)'; }}
                        ><ChevronLeft size={16}/></button>

                        <div style={{ display: 'flex', gap: '6px' }}>
                            {SLIDES.map((_, i) => (
                                <div key={i} onClick={() => setCurrentSlide(i)}
                                    style={{
                                        height: '6px', borderRadius: '3px', cursor: 'pointer',
                                        width: currentSlide === i ? '24px' : '6px',
                                        background: currentSlide === i ? slide.accent : 'rgba(255,255,255,0.15)',
                                        boxShadow: currentSlide === i ? `0 0 8px ${slide.glow}` : 'none',
                                        transition: 'all 0.3s ease',
                                    }}
                                />
                            ))}
                        </div>

                        <button onClick={nextSlide} style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
                            color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='var(--text-secondary)'; }}
                        ><ChevronRight size={16}/></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
