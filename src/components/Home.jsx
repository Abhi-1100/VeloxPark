import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex h-screen w-screen flex-col bg-[#181811] text-slate-100 overflow-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-[#f9f906]/10 bg-[#181811]/80 backdrop-blur-md px-10 py-4">
                <div className="flex items-center gap-3 text-[#f9f906]">
                    <div className="size-6">
                        <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                        </svg>
                    </div>
                    <h2 className="text-slate-100 text-xl font-bold tracking-tight">
                        Smart Parking <span className="text-[#f9f906]">OS</span>
                    </h2>
                </div>
                <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-[#f9f906] transition-colors">
                        <span className="material-symbols-outlined text-lg">help_outline</span>
                        Support
                    </button>
                    <div className="h-10 w-10 rounded-full border border-[#f9f906]/20 bg-[#f9f906]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#f9f906]">person</span>
                    </div>
                </div>
            </header>

            {/* Main Gateway Content */}
            <main className="flex h-full w-full pt-16">
                {/* Admin Access Side */}
                <Link
                    className="group relative flex h-full w-1/2 flex-col items-center justify-center overflow-hidden border-r border-[#f9f906]/5"
                    to="/admin"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-20"
                        style={{
                            backgroundImage: "linear-gradient(to bottom, rgba(24, 24, 17, 0.8), rgba(24, 24, 17, 0.95)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAJWV3ZWKD7DHHJzoWMnvleLOaSXki2GZgEbAfy0WuFmNbtbO2GLNZup-CDZWuYZ9wNV-ab_UcLQsVIMhUCHOM807JEFj6YTG2pPqattl0MVBvRhyl5vPY58LifRP4aTpaUVbYB9XQGba5hGGmWFJotrtHrGsVubQCz2EVdkJ3RbASwqFEpXy2cM1pSpSSLKdvUwHhTh1FU0KH0SSPq67V6RJIciIexKZ4NhGNhIbiZeBHFSxf_wHdAF-ivnGle1JUYgPcinioqaic')"
                        }}
                    ></div>
                    {/* Animated background pattern for Admin */}
                    <div
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                            backgroundImage: "radial-gradient(#f9f906 0.5px, transparent 0.5px)",
                            backgroundSize: "24px 24px"
                        }}
                    ></div>
                    <div className="relative z-10 flex flex-col items-center text-center px-12">
                        <div className="mb-8 flex size-24 items-center justify-center rounded-2xl bg-[#f9f906]/10 text-[#f9f906] shadow-[0_0_30px_rgba(249,249,6,0.15)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(249,249,6,0.3)]">
                            <span className="material-symbols-outlined !text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>key</span>
                        </div>
                        <h3 className="mb-4 text-5xl font-bold tracking-tighter text-white uppercase group-hover:text-[#f9f906] transition-colors">
                            Admin Access
                        </h3>
                        <p className="max-w-md text-lg text-slate-400 leading-relaxed">
                            Complete control over facility operations, revenue analytics, and security management.
                        </p>
                        <div className="mt-10 flex items-center gap-2 rounded-full bg-[#f9f906] px-8 py-3 text-sm font-bold text-[#181811] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                            LAUNCH DASHBOARD
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </div>
                    </div>
                </Link>

                {/* User Portal Side */}
                <Link
                    className="group relative flex h-full w-1/2 flex-col items-center justify-center overflow-hidden"
                    to="/user"
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-20"
                        style={{
                            backgroundImage: "linear-gradient(to bottom, rgba(24, 24, 17, 0.8), rgba(24, 24, 17, 0.95)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDI51Xu-UNVlNDwB02hh9Y82_vkjZnV7ZumQwjnGM4TWKZqBYEEZ6UAQP7sPPnIoe76bjHFs_Af3S2thJ9y-PHWBt5QKnPpcTYFrjR3o_xTl2TTT6wrIpiv6hPhFpwLFxb-t64AdGglp7D96qtcd4wORA6nWTLYwtwe69rd4xgBXTKoboCd1Hz0w1sgvVS4YWzLA2yf2dtfdtUfWIdqWw5AMp6WAGleK7fFtCSiuid9kntezLSJW38nvGpPXPW9Iv7eAC9UB2o54iQ')"
                        }}
                    ></div>
                    <div className="relative z-10 flex flex-col items-center text-center px-12">
                        <div className="mb-8 flex size-24 items-center justify-center rounded-2xl bg-[#f9f906]/10 text-[#f9f906] shadow-[0_0_30px_rgba(249,249,6,0.15)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_50px_rgba(249,249,6,0.3)]">
                            <span className="material-symbols-outlined !text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                        </div>
                        <h3 className="mb-4 text-5xl font-bold tracking-tighter text-white uppercase group-hover:text-[#f9f906] transition-colors">
                            User Portal
                        </h3>
                        <p className="max-w-md text-lg text-slate-400 leading-relaxed">
                            Real-time vehicle status tracking, instant parking reservations, and digital payments.
                        </p>
                        <div className="mt-10 flex items-center gap-2 rounded-full border-2 border-[#f9f906] px-8 py-3 text-sm font-bold text-[#f9f906] group-hover:bg-[#f9f906] group-hover:text-[#181811] transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                            ENTER PORTAL
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </div>
                    </div>
                </Link>
            </main>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6 text-slate-500 text-xs uppercase tracking-widest pointer-events-none">
                <div className="flex gap-8 pointer-events-auto">
                    <a className="hover:text-[#f9f906] transition-colors" href="#">Privacy</a>
                    <a className="hover:text-[#f9f906] transition-colors" href="#">Legal</a>
                    <a className="hover:text-[#f9f906] transition-colors" href="#">API</a>
                </div>
                <p>© 2024 Smart Parking Systems Intl.</p>
                <div className="flex gap-4 pointer-events-auto">
                    <a className="hover:text-[#f9f906] transition-colors" href="#"><span className="material-symbols-outlined text-base">language</span></a>
                    <a className="hover:text-[#f9f906] transition-colors" href="#"><span className="material-symbols-outlined text-base">share</span></a>
                </div>
            </footer>

            {/* Decorative Divider */}
            <div className="fixed bottom-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
                <div className="h-32 w-px bg-gradient-to-b from-transparent via-[#f9f906] to-transparent opacity-30"></div>
            </div>
        </div>
    );
};

export default Home;
