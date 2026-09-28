const SELECT_CLASSES =
    "rounded-md border border-paper-line bg-paper-card px-3 py-2 text-sm text-ink-900 focus:border-gold";

//Year level, status, and sort controls used on the Browse page
export default function FilterBar({
    yearLevels,
    yearLevel,
    onYearLevelChange,
    category,
    onCategoryChange,
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
                value={category}
                onChange={(event) => onCategoryChange(event.target.value)}
                className={SELECT_CLASSES}
            >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="blank">Open slot</option>
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
