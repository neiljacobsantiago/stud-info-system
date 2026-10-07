import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

//Top navigation bar - collapses to a hamburger menu on small screens.
//Favorites only appears once signed in, because it is a per-user list
export default function Navbar({ activeView, onNavigate }){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuth();

    const navItems = [
        { id: "home", label: "Home" },
        { id: "browse", label: "Browse" },
        ...(isAuthenticated ? [{ id: "favorites", label: "Favorites" }] : []),
        { id: "about", label: "About" },
    ];

    const handleSelect = (id) =>{
        onNavigate(id);
        setIsMenuOpen(false);
    };

    const handleSignOut = async () =>{
        await logout();
        onNavigate("home");
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-ink-900 text-paper">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <span className="font-serif text-xl tracking-tight">Student Information System</span>

                    {/* Desktop navigation: folder-tab style, active tab lifted */}
                    <nav className="hidden md:flex md:items-end md:gap-1">
                        {navItems.map((item) => {
                            const isActive = activeView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleSelect(item.id)}
                                    className={
                                        "relative rounded-t-md px-4 py-2 text-sm font-medium transition-colors " +
                                        (isActive ? "bg-paper text-ink-900" : "text-ink-100 hover:bg-ink-700")
                                    }
                                >
                                    {item.label}
                                </button>
                            );
                        })}

                        <span className="mx-3 h-6 w-px bg-ink-700" aria-hidden="true" />

                        {isAuthenticated ? (
                            <div className="flex items-center gap-3 pb-1">
                                <span className="text-sm text-ink-100">
                                    {user.name}
                                    <span className="ml-1 rounded bg-ink-700 px-1.5 py-0.5 text-xs uppercase">{user.role}</span>
                                </span>
                                <button type="button" onClick={handleSignOut} className="text-sm font-medium text-ink-100 hover:text-paper">
                                    Sign out
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => handleSelect("login")}
                                className="rounded-t-md px-4 py-2 text-sm font-medium text-ink-100 hover:bg-ink-700"
                            >
                                Sign in
                            </button>
                        )}
                    </nav>

                    {/* Mobile hamburger toggle */}
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md p-2 text-paper hover:bg-ink-700 md:hidden"
                        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen((open) => !open)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu panel */}
            {isMenuOpen && (
                <nav className="border-t border-ink-700 md:hidden">
                    <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
                        {navItems.map((item) => {
                            const isActive = activeView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleSelect(item.id)}
                                    className={
                                        "flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-medium " +
                                        (isActive ? "bg-paper text-ink-900" : "text-ink-100 hover:bg-ink-700")
                                    }
                                >
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}

                        {isAuthenticated ? (
                            <button type="button" onClick={handleSignOut} className="flex w-full rounded-md px-3 py-3 text-left text-sm font-medium text-ink-100 hover:bg-ink-700">
                                Sign out ({user.name})
                            </button>
                        ) : (
                            <button type="button" onClick={() => handleSelect("login")} className="flex w-full rounded-md px-3 py-3 text-left text-sm font-medium text-ink-100 hover:bg-ink-700">
                                Sign in
                            </button>
                        )}
                    </div>
                </nav>
            )}
        </header>
    );
}
