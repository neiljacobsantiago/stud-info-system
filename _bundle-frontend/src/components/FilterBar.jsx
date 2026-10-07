const SELECT_CLASSES =
    "rounded-md border border-paper-line bg-paper-card px-3 py-2 text-sm text-ink-900 focus:border-gold";

//Year level, status, and sort controls used on the Browse page.
//These no longer filter an array - their values go to Laravel as query
//parameters and the server returns the matching page
export default function FilterBar({
    yearLevels,
    yearLevel,
    onYearLevelChange,
    status,
    onStatusChange,
    sortBy,
    onSortChange,
}){
    return (
        <div className="flex flex-wrap gap-3">
            <select
                aria-label="Filter by year level"
                value={yearLevel}
                onChange={(event) => onYearLevelChange(event.target.value)}
                className={SELECT_CLASSES}
            >
                <option value="all">All year levels</option>
                {yearLevels.map((y) => (
                    <option key={y} value={y}>
                        {y}
                    </option>
                ))}
            </select>

            <select
                aria-label="Filter by status"
                value={status}
                onChange={(event) => onStatusChange(event.target.value)}
                className={SELECT_CLASSES}
            >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>

            <select
                aria-label="Sort records"
                value={sortBy}
                onChange={(event) => onSortChange(event.target.value)}
                className={SELECT_CLASSES}
            >
                <option value="name-asc">Name (A to Z)</option>
                <option value="name-desc">Name (Z to A)</option>
                <option value="student-id-asc">Student ID (oldest first)</option>
            </select>
        </div>
    );
}
