//Numbered pagination control for the Browse page
export default function Pagination({ currentPage, totalPages, onPageChange }){
    if(totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <nav className="flex items-center justify-center gap-1 py-6" aria-label="Pagination">
            <button
                type="button"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-md px-3 py-1.5 text-sm text-ink-500 hover:bg-ink-50 disabled:opacity-30"
            >
                Previous
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    type="button"
                    onClick={() => onPageChange(page)}
                    aria-current={page === currentPage ? "page" : undefined}
                    className={
                        "h-8 w-8 rounded-md text-sm " +
                        (page === currentPage
                            ? "bg-ink-900 text-paper"
                            : "text-ink-700 hover:bg-ink-50")
                    }
                >
                    {page}
                </button>
            ))}

            <button
                type="button"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-md px-3 py-1.5 text-sm text-ink-500 hover:bg-ink-50 disabled:opacity-30"
            >
                Next
            </button>
        </nav>
    );
}
