import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import StudentModal from "./components/StudentModal.jsx";
import Home from "./pages/Home.jsx";
import Browse from "./pages/Browse.jsx";
import About from "./pages/About.jsx";
import useStudents from "./hooks/useStudents.js";

export default function App(){
    const [activeView, setActiveView] = useState("home");
    const [selectedStudent, setSelectedStudent] = useState(null);

    const { students, isLoading, error, refetch } = useStudents();

    const sharedPageProps = {
        students,
        isLoading,
        error,
        onRetry: refetch,
        onViewDetails: setSelectedStudent,
        onNavigate: setActiveView,
    };

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar activeView={activeView} onNavigate={setActiveView} />

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
                {activeView === "home" && <Home {...sharedPageProps} />}
                {activeView === "browse" && <Browse {...sharedPageProps} />}
                {activeView === "about" && <About />}
            </main>

            <Footer />

            <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        </div>
    );
}
