import { studentAccentColor, studentInitials, studentId, categoryLabel } from "../utils/studentStyling.js";

//Shows a single student record as a card - used on Browse and Home
export default function StudentCard({ student, onViewDetails }){
    const fullName = `${student.firstName} ${student.lastName}`;
    const accentColor = studentAccentColor(student);
    const isBlank = student.category === "blank";

    return (
        <div className="flex flex-col border border-paper-line bg-paper-card" style={{ borderTopColor: accentColor, borderTopWidth: "3px" }}>
            <div className="flex items-center justify-between px-4 pt-3">
                <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: accentColor }}
                >
                    {isBlank ? categoryLabel(student.category) : student.yearLevel}
                </span>
            </div>

            <div className="flex items-center gap-3 px-4 pt-3">
                <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white"
                    style={{ backgroundColor: accentColor }}
                >
                    {studentInitials(student)}
                </div>
                <div>
                    <h3 className="font-serif text-lg leading-tight text-ink-900">{fullName}</h3>
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

            <div className="mt-4 border-t border-paper-line px-4 py-3">
                <button
                    type="button"
                    onClick={() => onViewDetails(student)}
                    disabled={isBlank}
                    className="text-sm font-medium text-ink-700 hover:text-gold-dark disabled:cursor-not-allowed disabled:text-ink-300 disabled:hover:text-ink-300"
                >
                    {isBlank ? "Nothing on file yet" : "View full record"}
                </button>
            </div>
        </div>
    );
}
