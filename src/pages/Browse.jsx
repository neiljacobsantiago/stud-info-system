import { useState } from "react";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import SearchBar from "../components/SearchBar.jsx";
import FilterBar from "../components/FilterBar.jsx";
import StudentCard from "../components/StudentCard.jsx";
import Pagination from "../components/Pagination.jsx";
import { studentId } from "../utils/studentStyling.js";

const PAGE_SIZE = 8;

export default function Browse({
    students,
    isLoading,
    error,
    onRetry,
    onViewDetails,
}){
    const [query, setQuery] = useState("");
    const [yearLevel, setYearLevel] = useState("all");
    const [category, setCategory] = useState("all");
    const [sortBy, setSortBy] = useState("name-asc");
    const [page, setPage] = useState(1);

    if(isLoading) return <Loading label="Loading all student records..." />;
    if(error) return <ErrorMessage message={error} onRetry={onRetry} />;

    const yearLevels = [...new Set(students.map((s) => s.yearLevel).filter(Boolean))].sort();

    //any control changing the result set should also reset back to page 1,
    //otherwise a user could be stranded on a page that no longer exists
    const updateAndResetPage = (setter) =>(value) =>{
        setter(value);
        setPage(1);
    };

    const normalizedQuery = query.trim().toLowerCase();

    const filtered = students
        .filter((student) => {
            const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
            const matchesQuery =
                normalizedQuery === "" ||
                fullName.includes(normalizedQuery) ||
                student.hometown?.toLowerCase().includes(normalizedQuery);
            const matchesYearLevel = yearLevel === "all" || student.yearLevel === yearLevel;
            const matchesCategory = category === "all" || student.category === category;
            return matchesQuery && matchesYearLevel && matchesCategory;
        })
        .sort((a, b) => {
            switch(sortBy){
                case "name-desc":
                    return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
                case "student-id-asc":
                    return studentId(a).localeCompare(studentId(b));
                default:
                    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
            }
        });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageStart = (page - 1) * PAGE_SIZE;
    const pageItems = filtered.slice(pageStart, pageStart + PAGE_SIZE);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-ink-900">Browse students</h1>
                <p className="mt-1 text-sm text-ink-500">
                    Search by name or hometown, then narrow the list by year level or status.
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="sm:max-w-xs sm:flex-1">
                    <SearchBar
                        value={query}
                        onChange={updateAndResetPage(setQuery)}
                        placeholder="Search by name or hometown"
                    />
                </div>
                <FilterBar
                    yearLevels={yearLevels}
                    yearLevel={yearLevel}
                    onYearLevelChange={updateAndResetPage(setYearLevel)}
                    category={category}
                    onCategoryChange={updateAndResetPage(setCategory)}
                    sortBy={sortBy}
                    onSortChange={setSortBy}
                />
            </div>

            <p className="text-sm text-ink-500">
                {filtered.length} {filtered.length === 1 ? "student" : "students"} found
            </p>

            {pageItems.length === 0 ? (
                <div className="rounded-md border border-dashed border-paper-line px-6 py-12 text-center">
                    <p className="font-serif text-lg text-ink-700">No matching students</p>
                    <p className="mt-1 text-sm text-ink-500">
                        Try a different name, or clear the year level and status filters.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {pageItems.map((student) => (
                        <StudentCard
                            key={student.id}
                            student={student}
                            onViewDetails={onViewDetails}
                        />
                    ))}
                </div>
            )}

            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}
