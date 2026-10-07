import { studentAccentColor, studentInitials, studentId, statusLabel } from "../utils/studentStyling.js";

//Shows a student's full record in a modal, opened from a card.
//Course, section and adviser all come from related tables, resolved by
//Laravel rather than duplicated onto every student row
export default function StudentModal({ student, onClose }){
    if(!student) return null;

    const fullName = `${student.firstName} ${student.lastName}`;
    const accentColor = studentAccentColor(student);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/60 px-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Full record for ${fullName}`}
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg bg-paper-card"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between border-b border-paper-line px-6 py-4">
                    <div>
                        <h2 className="font-serif text-2xl text-ink-900">{fullName}</h2>
                        <p className="font-mono text-xs text-ink-500">{studentId(student)}</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close record"
                        className="text-ink-500 hover:text-ink-900"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex gap-4 px-6 py-5">
                    <div
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-semibold text-white"
                        style={{ backgroundColor: accentColor }}
                    >
                        {studentInitials(student)}
                    </div>
                    <dl className="grid flex-1 grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <dt className="text-ink-500">Course</dt>
                        <dd className="text-ink-900">{student.course || "Not on file"}</dd>

                        <dt className="text-ink-500">Year level</dt>
                        <dd className="text-ink-900">{student.yearLevel || "Not on file"}</dd>

                        <dt className="text-ink-500">Section</dt>
                        <dd className="text-ink-900">{student.section || "Not on file"}</dd>

                        <dt className="text-ink-500">Adviser</dt>
                        <dd className="text-ink-900">{student.adviser || "Unassigned"}</dd>

                        <dt className="text-ink-500">Hometown</dt>
                        <dd className="text-ink-900">{student.hometown || "Not on file"}</dd>

                        <dt className="text-ink-500">Enrolled</dt>
                        <dd className="text-ink-900">{student.enrollmentYear || "Not on file"}</dd>

                        <dt className="text-ink-500">Status</dt>
                        <dd className="text-ink-900">{statusLabel(student.status)}</dd>
                    </dl>
                </div>

                <div className="border-t border-paper-line px-6 py-4 text-sm text-ink-700">
                    {student.bio || "No notes on file."}
                </div>
            </div>
        </div>
    );
}
