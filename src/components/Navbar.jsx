import { useState } from "react";

const NAV_ITEMS = [
    { id: "home", label: "Home" },
    { id: "browse", label: "Browse" },
    { id: "about", label: "About" },
];

//Top navigation bar - collapses to a hamburger menu on small screens
export default function Navbar({ activeView, onNavigate }){
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSelect = (id) =>{
        onNavigate(id);
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-ink-900 text-paper">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <span className="font-serif text-xl tracking-tight">Student Information System</span>

                    {/* Desktop navigation: folder-tab style, active tab lifted */}
                    <nav className="hidden md:flex md:items-end md:gap-1">
                        {NAV_ITEMS.map((item) => {
                            const isActive = activeView === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleSelect(item.id)}
                                    className={
                                        "relative rounded-t-md px-4 py-2 text-sm font-medium transition-colors " +
                                        (isActive
                                            ? "bg-paper text-ink-900"
                                            : "text-ink-100 hover:bg-ink-700")
                                    }
                                >
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Mobile hamburger toggle */}
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md p-2 text-paper hover:bg-ink-700 md:hidden"
                        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={isMenuOpen}
                        onClick={() => setIsMenuOpen((open) => !open)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
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
                        {NAV_ITEMS.map((item) => {
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
                    </div>
                </nav>
            )}
        </header>
    );
}
