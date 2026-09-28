//Shows a spinner while records are being fetched
export default function Loading({ label = "Loading records..." }){
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-500">
            <div
                className="h-8 w-8 animate-spin rounded-full border-2 border-ink-100 border-t-gold"
                role="status"
                aria-label="Loading"
            />
            <p className="text-sm">{label}</p>
        </div>
    );
}
