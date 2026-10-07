import Loading from "../components/Loading.jsx";
import StudentCard from "../components/StudentCard.jsx";

//Records the signed-in user has filed. Backed by the favorites table, so the
//list follows the account rather than the browser it was saved in
export default function Favorites({ students, isLoading, favoriteIds, onToggleFavorite, onViewDetails, onNavigate }){
    if(isLoading) return <Loading label="Loading your saved records..." />;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-ink-900">Favorites</h1>
                <p className="mt-1 text-sm text-ink-500">
                    Records you've filed for quick reference. Saved to your account.
                </p>
            </div>

            {students.length === 0 ? (
                <div className="rounded-md border border-dashed border-paper-line px-6 py-12 text-center">
                    <p className="font-serif text-lg text-ink-700">No records filed yet</p>
                    <p className="mt-1 text-sm text-ink-500">
                        Use the bookmark icon on a record in Browse to file it here.
                    </p>
                    <button
                        type="button"
                        onClick={() => onNavigate("browse")}
                        className="mt-4 rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-paper hover:bg-ink-700"
                    >
                        Go to Browse
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {students.map((student) => (
                        <StudentCard
                            key={student.id}
                            student={student}
                            isFavorite={favoriteIds.has(student.id)}
                            onToggleFavorite={onToggleFavorite}
                            onViewDetails={onViewDetails}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
