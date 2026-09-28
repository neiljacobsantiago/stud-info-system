import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import StatTab from "../components/StatTab.jsx";
import StudentCard from "../components/StudentCard.jsx";

//Computes the small set of overview statistics shown on the dashboard
function summarize(students){
    const active = students.filter((s) => s.category === "active");
    const openSlots = students.filter((s) => s.category === "blank").length;
    const sectionCount = new Set(active.map((s) => s.section)).size;

    return { sectionCount, activeCount: active.length, openSlots };
}

export default function Home({
    students,
    isLoading,
    error,
    onRetry,
    onViewDetails,
    onNavigate,
}){
    if(isLoading) return <Loading label="Loading student records..." />;
    if(error) return <ErrorMessage message={error} onRetry={onRetry} />;

    const { sectionCount, activeCount, openSlots } = summarize(students);
    const recentStudents = students.filter((s) => s.category === "active").slice(0, 4);

    return (
        <div className="space-y-10">
            <section>
                <p className="font-mono text-6xl text-ink-900 sm:text-7xl">{students.length}</p>
                <p className="mt-2 font-serif text-xl text-ink-700">students on file</p>
                <p className="mt-1 max-w-prose text-sm text-ink-500">
                    BSIT students across all year levels. Search and filter by year level.
                </p>
                <button
                    type="button"
                    onClick={() => onNavigate("browse")}
                    className="mt-4 rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-paper hover:bg-ink-700"
                >
                    Browse all students
                </button>
            </section>

            <section className="grid grid-cols-1 gap-px bg-paper-line sm:grid-cols-3">
                <StatTab label="Sections" value={sectionCount} sublabel="this term" />
                <StatTab label="Active students" value={activeCount} sublabel="enrolled" />
                <StatTab label="Open slots" value={openSlots} sublabel="ready to fill in" />
            </section>

            <section>
                <h2 className="font-serif text-xl text-ink-900">Recently filed</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {recentStudents.map((student) => (
                        <StudentCard
                            key={student.id}
                            student={student}
                            onViewDetails={onViewDetails}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
