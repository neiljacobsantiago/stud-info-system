import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api.js";

//The signed-in user's filed records. Kept as a Set of ids so any card on any
//page can answer "is this one filed?" without its own request
export default function useFavorites(isAuthenticated){
    const [favoriteIds, setFavoriteIds] = useState(new Set());
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const load = useCallback(async () => {
        if(!isAuthenticated){
            setFavoriteIds(new Set());
            setStudents([]);
            return;
        }

        setIsLoading(true);
        try{
            const payload = await api.get("/account/favorites");
            setStudents(payload.data);
            setFavoriteIds(new Set(payload.data.map((s) => s.id)));
        } catch {
            //Leave the previous list in place rather than blanking the page
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => { load(); }, [load]);

    const toggleFavorite = useCallback(async (student) => {
        const id = student.id;
        const wasFiled = favoriteIds.has(id);

        //Optimistic: the icon flips immediately, then reverts if the call fails
        setFavoriteIds((prev) => {
            const next = new Set(prev);
            if(wasFiled) next.delete(id);
            else next.add(id);
            return next;
        });

        try{
            if(wasFiled){
                await api.delete(`/account/favorites/${id}`);
                setStudents((prev) => prev.filter((s) => s.id !== id));
            } else {
                await api.post("/account/favorites", { student_id: id });
                setStudents((prev) => (prev.some((s) => s.id === id) ? prev : [...prev, student]));
            }
        } catch {
            setFavoriteIds((prev) => {
                const next = new Set(prev);
                if(wasFiled) next.add(id);
                else next.delete(id);
                return next;
            });
        }
    }, [favoriteIds]);

    return { favoriteIds, students, isLoading, toggleFavorite, refresh: load };
}
