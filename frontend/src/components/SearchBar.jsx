//Controlled search input - the parent owns the value and the filtering
export default function SearchBar({ value, onChange, placeholder = "Search..." }){
    return (
        <div className="relative">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300"
            >
                <circle cx="11" cy="11" r="7" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 21l-3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-md border border-paper-line bg-paper-card py-2 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold"
            />
        </div>
    );
}
