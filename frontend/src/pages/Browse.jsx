import { useState } from "react";
import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import SearchBar from "../components/SearchBar.jsx";
import FilterBar from "../components/FilterBar.jsx";
import StudentCard from "../components/StudentCard.jsx";
import Pagination from "../components/Pagination.jsx";
import StudentForm from "../components/StudentForm.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import useStudents from "../hooks/useStudents.js";
import useLookups from "../hooks/useLookups.js";
import useDebouncedValue from "../hooks/useDebouncedValue.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Browse({ onViewDetails, favoriteIds, onToggleFavorite }){
    const { user, isAdmin, canManageStudents } = useAuth();

    const [query, setQuery] = useState("");
    const [yearLevel, setYearLevel] = useState("all");
    const [status, setStatus] = useState("all");
    const [sortBy, setSortBy] = useState("name-asc");
    const [page, setPage] = useState(1);

    const [formStudent, setFormStudent] = useState(null);   //null = closed
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [notice, setNotice] = useState("");

    //One request after typing stops, not one per keystroke
    const debouncedQuery = useDebouncedValue(query, 300);

    const { programs, sections, yearLevels } = useLookups();

    const {
        students, meta, isLoading, error, refetch,
        createStudent, updateStudent, deleteStudent,
    } = useStudents({ query: debouncedQuery, yearLevel, status, sortBy, page });

    //Any control that changes the result set also returns to page 1, otherwise
    //the user can be stranded on a page the new result set no longer has
    const updateAndResetPage = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    //An adviser may only edit students in the sections they advise. This is
    //the same rule as StudentPolicy::update - here it only hides a button
    const canEditStudent = (student) => {
        if(isAdmin) return true;
        if(user?.role !== "staff") return false;
        const section = sections.find((s) => s.id === student.sectionId);
        return Boolean(section && section.adviser === user.name);
    };

    const openCreate = () => { setFormStudent(null); setIsFormOpen(true); };
    const openEdit = (student) => { setFormStudent(student); setIsFormOpen(true); };

    const handleSubmit = async (payload) => {
        if(formStudent){
            await updateStudent(formStudent.id, payload);
            setNotice("Record updated.");
        } else {
            await createStudent(payload);
            setNotice("Record created.");
        }
        setTimeout(() => setNotice(""), 4000);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try{
            await deleteStudent(pendingDelete.id);
            setNotice("Record deleted.");
            setTimeout(() => setNotice(""), 4000);
        } finally {
            setIsDeleting(false);
            setPendingDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="font-serif text-2xl text-ink-900">Browse students</h1>
                    <p className="mt-1 text-sm text-ink-500">
                        Search by name or hometown, then narrow the list by year level or status.
                    </p>
                </div>

                {canManageStudents && (
                    <button
                        type="button"
                        onClick={openCreate}
                        className="rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-paper hover:bg-ink-700"
                    >
                        New record
                    </button>
                )}
            </div>

            {notice && (
                <p className="rounded-md border border-ink-100 bg-ink-50 px-3 py-2 text-sm text-ink-700">{notice}</p>
            )}

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
                    status={status}
                    onStatusChange={updateAndResetPage(setStatus)}
                    sortBy={sortBy}
                    onSortChange={updateAndResetPage(setSortBy)}
                />
            </div>

            {isLoading ? (
                <Loading label="Loading all student records..." />
            ) : error ? (
                <ErrorMessage message={error} onRetry={refetch} />
            ) : (
                <>
                    <p className="text-sm text-ink-500">
                        {meta.total} {meta.total === 1 ? "student" : "students"} found
                    </p>

                    {students.length === 0 ? (
                        <div className="rounded-md border border-dashed border-paper-line px-6 py-12 text-center">
                            <p className="font-serif text-lg text-ink-700">No matching students</p>
                            <p className="mt-1 text-sm text-ink-500">
                                Try a different name, or clear the year level and status filters.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {students.map((student) => (
                                <StudentCard
                                    key={student.id}
                                    student={student}
                                    onViewDetails={onViewDetails}
                                    isFavorite={favoriteIds?.has(student.id)}
                                    onToggleFavorite={onToggleFavorite}
                                    canEdit={canEditStudent(student)}
                                    canDelete={isAdmin}
                                    onEdit={openEdit}
                                    onDelete={setPendingDelete}
                                />
                            ))}
                        </div>
                    )}

                    <Pagination
                        currentPage={meta.current_page}
                        totalPages={meta.last_page}
                        onPageChange={setPage}
                    />
                </>
            )}

            {isFormOpen && (
                <StudentForm
                    student={formStudent}
                    programs={programs}
                    sections={sections}
                    onSubmit={handleSubmit}
                    onClose={() => { setIsFormOpen(false); setFormStudent(null); }}
                />
            )}

            {pendingDelete && (
                <ConfirmDialog
                    title="Delete this record?"
                    message={`${pendingDelete.firstName} ${pendingDelete.lastName} will be permanently removed from the database.`}
                    onConfirm={handleDelete}
                    onCancel={() => setPendingDelete(null)}
                    isBusy={isDeleting}
                />
            )}
        </div>
    );
}
