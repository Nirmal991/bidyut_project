import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../api/auth.api";
import type { RootState } from "../store/store";
import { logout } from "../store/slices/AuthSlice";

function HomePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.auth.user);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Subtle animated particle background
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];
        for (let i = 0; i < 60; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.5 + 0.5,
                dx: (Math.random() - 0.5) * 0.3,
                dy: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.4 + 0.1,
            });
        }

        let animId: number;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(153, 41, 234, ${p.alpha})`;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            }
            animId = requestAnimationFrame(draw);
        };
        draw();

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            toast.success("Logged out successfully");
            navigate("/login");
        } catch {
            toast.error("Logout failed. Please try again.");
        } finally {
            localStorage.removeItem("token");
            dispatch(logout()); // 🔥 important

            navigate("/login");
        }
    };

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

    return (
        <div className="min-h-screen bg-[#0b0b0f] text-white relative overflow-hidden">
            {/* Particle canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none opacity-50"
            />

            {/* Ambient glow */}
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#9929EA]/10 blur-[140px] rounded-full pointer-events-none" />

            {/* ── Navbar ── */}
            <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-4 border-b border-[#1f1f28] bg-[#0b0b0f]/80 backdrop-blur-md sticky top-0">
                {/* Brand */}
                <span className="text-xl font-bold tracking-tight text-[#9929EA]">
                    Bidyut
                    <span className="text-[10px] font-normal text-gray-500 ml-2 align-middle tracking-widest uppercase">
                        beta
                    </span>
                </span>

                {/* Right side */}
                <div className="flex items-center gap-4">
                    {/* Avatar chip */}
                    {user && (
                        <div className="flex items-center gap-2 bg-[#15151c] border border-[#2a2a35] rounded-full pl-1 pr-3 py-1">
                            {user.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt={user.username}
                                    className="w-7 h-7 rounded-full object-cover ring-1 ring-[#9929EA]/40"
                                />
                            ) : (
                                <div className="w-7 h-7 rounded-full bg-[#9929EA]/20 border border-[#9929EA]/30 flex items-center justify-center text-[10px] font-bold text-[#b46cff]">
                                    {getInitials(user.username)}
                                </div>
                            )}
                            <span className="text-sm text-gray-300 font-medium hidden sm:block">
                                {user.username}
                            </span>
                        </div>
                    )}

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 border border-[#2a2a35] hover:border-red-500/40 bg-[#15151c] hover:bg-red-500/5 px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span className="hidden sm:inline">Logout</span>
                    </button>
                </div>
            </nav>

            {/* ── Main content ── */}
            <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-73px)] px-4">
                {user ? (
                    <div className="flex flex-col items-center gap-6 animate-fadeIn">
                        {/* Profile image */}
                        <div className="relative">
                            {user.profileImage ? (
                                <img
                                    src={user.profileImage}
                                    alt={user.username}
                                    className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover ring-4 ring-[#9929EA]/30 shadow-[0_0_40px_rgba(153,41,234,0.25)]"
                                />
                            ) : (
                                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#1a1a24] border-2 border-[#9929EA]/30 flex items-center justify-center shadow-[0_0_40px_rgba(153,41,234,0.2)]">
                                    <span className="text-4xl font-bold text-[#9929EA]">
                                        {getInitials(user.username)}
                                    </span>
                                </div>
                            )}
                            {/* Online dot */}
                            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0b0b0f] shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                        </div>

                        {/* Name & welcome */}
                        <div className="text-center space-y-2">
                            <p className="text-xs uppercase tracking-[0.2em] text-[#9929EA] font-medium">
                                Welcome back
                            </p>
                            <h1 className="text-3xl md:text-5xl font-bold text-white">
                                {user.username}
                            </h1>
                            {user.email && (
                                <p className="text-gray-500 text-sm">{user.email}</p>
                            )}
                        </div>

                        {/* Decorative divider */}
                        <div className="flex items-center gap-3 w-full max-w-xs">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#9929EA]/30" />
                            <span className="text-[#9929EA]/50 text-xs">✦</span>
                            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#9929EA]/30" />
                        </div>

                        {/* Tagline */}
                        <p className="text-gray-500 text-sm text-center max-w-xs">
                            A place to flex your creation. Start building something brilliant.
                        </p>
                    </div>
                ) : (
                    /* Loading skeleton */
                    <div className="flex flex-col items-center gap-6 animate-pulse">
                        <div className="w-32 h-32 rounded-full bg-[#1f1f28]" />
                        <div className="space-y-3 text-center">
                            <div className="h-3 w-24 bg-[#1f1f28] rounded-full mx-auto" />
                            <div className="h-8 w-48 bg-[#1f1f28] rounded-full mx-auto" />
                            <div className="h-3 w-36 bg-[#1f1f28] rounded-full mx-auto" />
                        </div>
                    </div>
                )}
            </main>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease forwards;
                }
            `}</style>
        </div>
    );
}

export default HomePage;
