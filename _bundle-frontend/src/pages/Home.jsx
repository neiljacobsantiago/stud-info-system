import Loading from "../components/Loading.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import StatTab from "../components/StatTab.jsx";
import StudentCard from "../components/StudentCard.jsx";
import useStats from "../hooks/useStats.js";

//Dashboard. The counts used to be computed in the browser from the full
//record list; they now come from one /stats call that counts in SQL
export default function Home({ onViewDetails, onNavigate, favoriteIds, onToggleFavorite }){
    const { stats, isLoading, error, refetch } = useStats();

    if(isLoading) return <Loading label="Loading student records..." />;
    if(error) return <ErrorMessage message={error} onRetry={refetch} />;

    const recent = stats.recent?.data ?? stats.recent ?? [];

    return (
        <div className="space-y-10">
            <section>
                <p className="font-mono text-6xl text-ink-900 sm:text-7xl">{stats.totalStudents}</p>
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
                <StatTab label="Sections" value={stats.sectionCount} sublabel="this term" />
                <StatTab label="Active students" value={stats.activeCount} sublabel="enrolled" />
                {/* Open slots = declared section capacity minus students filed */}
                <StatTab label="Open slots" value={stats.openSlots} sublabel="seats remaining" />
            </section>

            <section>
                <h2 className="font-serif text-xl text-ink-900">Recently filed</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {recent.map((student) => (
                        <StudentCard
                            key={student.id}
                            student={student}
                            onViewDetails={onViewDetails}
                            isFavorite={favoriteIds?.has(student.id)}
                            onToggleFavorite={onToggleFavorite}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
