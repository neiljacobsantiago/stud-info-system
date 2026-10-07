import { studentAccentColor, studentInitials, studentId, statusLabel } from "../utils/studentStyling.js";

//Shows a single student record as a card - used on Browse, Home and Favorites.
//Edit and Delete only render for users whose role allows them; the middleware
//and policy on the Laravel side are what actually enforce it
export default function StudentCard({
    student,
    onViewDetails,
    isFavorite = false,
    onToggleFavorite,
    canEdit = false,
    canDelete = false,
    onEdit,
    onDelete,
}){
    const fullName = `${student.firstName} ${student.lastName}`;
    const accentColor = studentAccentColor(student);
    const isInactive = student.status === "inactive";

    return (
        <div
            className="flex flex-col border border-paper-line bg-paper-card"
            style={{ borderTopColor: accentColor, borderTopWidth: "3px" }}
        >
            <div className="flex items-center justify-between px-4 pt-3">
                <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: accentColor }}
                >
                    {isInactive ? statusLabel(student.status) : student.yearLevel}
                </span>

                {onToggleFavorite && (
                    <button
                        type="button"
                        onClick={() => onToggleFavorite(student)}
                        aria-label={isFavorite ? `Remove ${fullName} from favorites` : `File ${fullName}`}
                        aria-pressed={isFavorite}
                        className="text-ink-300 hover:text-gold-dark"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            fill={isFavorite ? "#F2B705" : "none"}
                            stroke={isFavorite ? "#C79000" : "currentColor"}
                            strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z" />
                        </svg>
                    </button>
                )}
            </div>

            <div className="flex items-center gap-3 px-4 pt-3">
                <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white"
                    style={{ backgroundColor: accentColor }}
                >
                    {studentInitials(student)}
                </div>
                <div className="min-w-0">
                    <h3 className="truncate font-serif text-lg leading-tight text-ink-900">{fullName}</h3>
                    <p className="font-mono text-xs text-ink-500">{studentId(student)}</p>
                </div>
            </div>

            <dl className="mt-3 space-y-1 px-4 text-sm text-ink-500">
                <div className="flex justify-between gap-2">
                    <dt>Section</dt>
                    <dd className="truncate text-right text-ink-900">{student.section || "Not on file"}</dd>
                </div>
                <div className="flex justify-between gap-2">
                    <dt>Hometown</dt>
                    <dd className="truncate text-right text-ink-900">{student.hometown || "Not on file"}</dd>
                </div>
            </dl>

            <div className="mt-4 flex items-center justify-between gap-2 border-t border-paper-line px-4 py-3">
                <button
                    type="button"
                    onClick={() => onViewDetails(student)}
                    className="text-sm font-medium text-ink-700 hover:text-gold-dark"
                >
                    View full record
                </button>

                <div className="flex gap-3">
                    {canEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(student)}
                            className="text-sm font-medium text-ink-500 hover:text-ink-900"
                        >
                            Edit
                        </button>
                    )}
                    {canDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(student)}
                            className="text-sm font-medium text-error hover:underline"
                        >
                            Delete
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
