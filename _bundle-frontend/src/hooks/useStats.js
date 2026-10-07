import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api.js";

//Dashboard totals for the Home page. Counting happens in SQL, so React no
//longer needs the full record list just to show three numbers
export default function useStats(){
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try{
            setStats(await api.get("/stats"));
        } catch (err){
            setError(err.message || "Unable to retrieve the data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    return { stats, isLoading, error, refetch: fetchStats };
}
