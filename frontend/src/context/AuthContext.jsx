import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, getToken, setToken } from "../lib/api.js";

const AuthContext = createContext(null);

//Holds the signed-in user for the whole app. Components read `user.role` to
//decide what to show; the server decides what is actually allowed.
export function AuthProvider({ children }){
    const [user, setUser] = useState(null);
    const [isReady, setIsReady] = useState(false);

    //A token in localStorage survives a refresh, but it may have been revoked
    //server-side, so it is verified against /me before the app trusts it
    useEffect(() => {
        let cancelled = false;

        async function restoreSession(){
            if(!getToken()){
                setIsReady(true);
                return;
            }
            try{
                const data = await api.get("/me");
                if(!cancelled) setUser(data.user);
            } catch {
                setToken(null);
            } finally {
                if(!cancelled) setIsReady(true);
            }
        }

        restoreSession();
        return () => { cancelled = true; };
    }, []);

    const login = useCallback(async (email, password) => {
        const data = await api.post("/login", { email, password });
        setToken(data.token);
        setUser(data.user);
        return data.user;
    }, []);

    const register = useCallback(async (payload) => {
        const data = await api.post("/register", payload);
        setToken(data.token);
        setUser(data.user);
        return data.user;
    }, []);

    const logout = useCallback(async () => {
        try{
            await api.post("/logout");
        } catch {
            //Already invalid server-side - clearing locally is still correct
        }
        setToken(null);
        setUser(null);
    }, []);

    const value = {
        user,
        isReady,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === "admin",
        canManageStudents: user?.role === "admin" || user?.role === "staff",
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){
    const context = useContext(AuthContext);
    if(!context) throw new Error("useAuth must be used inside an AuthProvider");
    return context;
}
