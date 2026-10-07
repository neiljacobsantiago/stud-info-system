//About page - short description of the system and how records are set up
export default function About(){
    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-ink-900">About this system</h1>
                <p className="mt-1 text-sm text-ink-500">INTECH 3112 - First and Second Term Project</p>
            </div>

            <div className="space-y-4 border border-paper-line bg-paper-card px-6 py-6 text-sm leading-relaxed text-ink-700">
                <p>
                    Each record is treated like a student file: a Student ID, a profile, and a
                    short note about them. The ID is generated from the year the student
                    enrolled - for example, someone who enrolled in 2026 gets an ID starting
                    with ID126, followed by a sequence number.
                </p>
                <p>
                    Records load from public/students.json using
                    the browser's fetch() function, without needing a full
                    page reload. A handful of records are left blank on purpose - fill them in
                    directly in that file.
                </p>
            </div>

            <div>
                <h2 className="font-serif text-lg text-ink-900">Built with</h2>
                <ul className="mt-2 grid grid-cols-2 gap-2 text-sm text-ink-700 sm:grid-cols-3">
                    <li className="border-t-2 border-gold bg-paper-card px-3 py-2">React</li>
                    <li className="border-t-2 border-gold bg-paper-card px-3 py-2">Tailwind CSS</li>
                    <li className="border-t-2 border-gold bg-paper-card px-3 py-2">Fetch API</li>
                    <li className="border-t-2 border-gold bg-paper-card px-3 py-2">Vite</li>
                </ul>
            </div>
        </div>
    );
}
