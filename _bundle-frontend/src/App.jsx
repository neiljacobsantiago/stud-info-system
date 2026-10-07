import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Loading from "./components/Loading.jsx";
import StudentModal from "./components/StudentModal.jsx";
import Home from "./pages/Home.jsx";
import Browse from "./pages/Browse.jsx";
import About from "./pages/About.jsx";
import Favorites from "./pages/Favorites.jsx";
import Login from "./pages/Login.jsx";
import useFavorites from "./hooks/useFavorites.js";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";

function AppShell(){
    const { isReady, isAuthenticated } = useAuth();

    const [activeView, setActiveView] = useState("home");
    const [selectedStudent, setSelectedStudent] = useState(null);

    const {
        favoriteIds,
        students: favoritedStudents,
        isLoading: favoritesLoading,
        toggleFavorite,
    } = useFavorites(isAuthenticated);

    //Waits for the stored token to be checked against /me, so a refresh does
    //not flash the sign-in screen at an already signed-in user
    if(!isReady){
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loading label="Starting up..." />
            </div>
        );
    }

    const sharedProps = {
        onViewDetails: setSelectedStudent,
        onNavigate: setActiveView,
        favoriteIds,
        onToggleFavorite: toggleFavorite,
    };

    //Every data route on the API sits behind auth:sanctum, so the app asks for
    //a sign-in before any view can load records
    const view = !isAuthenticated
        ? <Login onSignedIn={() => setActiveView("home")} />
        : (
            <>
                {activeView === "home" && <Home {...sharedProps} />}
                {activeView === "browse" && <Browse {...sharedProps} />}
                {activeView === "favorites" && (
                    <Favorites
                        {...sharedProps}
                        students={favoritedStudents}
                        isLoading={favoritesLoading}
                    />
                )}
                {activeView === "about" && <About />}
                {activeView === "login" && <Login onSignedIn={() => setActiveView("home")} />}
            </>
        );

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar activeView={activeView} onNavigate={setActiveView} />

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
                {view}
            </main>

            <Footer />

            <StudentModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
        </div>
    );
}

export default function App(){
    return (
        <AuthProvider>
            <AppShell />
        </AuthProvider>
    );
}
