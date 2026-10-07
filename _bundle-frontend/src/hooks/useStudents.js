import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api.js";

//Handles all student traffic between React and Laravel. Search, filtering,
//sorting and paging are sent to the server as query parameters - the browser
//never holds more than one page of records
export default function useStudents({
    query = "",
    yearLevel = "all",
    status = "all",
    sortBy = "name-asc",
    page = 1,
} = {}){
    const [students, setStudents] = useState([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try{
            const params = new URLSearchParams({
                q: query,
                year_level: yearLevel,
                status,
                sort: sortBy,
                page: String(page),
            });

            const payload = await api.get(`/registrar/students?${params}`);

            setStudents(payload.data);
            setMeta(payload.meta || { current_page: 1, last_page: 1, total: payload.data.length });

        } catch (err){
            setError(err.message || "Unable to retrieve the data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, [query, yearLevel, status, sortBy, page]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    //CREATE - refetches so the new record lands in the right sorted page
    const createStudent = useCallback(async (payload) => {
        const created = await api.post("/registrar/students", payload);
        await fetchStudents();
        return created.data;
    }, [fetchStudents]);

    //UPDATE - patches the row in place, which keeps the current page steady
    const updateStudent = useCallback(async (id, payload) => {
        const updated = await api.put(`/registrar/students/${id}`, payload);
        setStudents((prev) => prev.map((s) => (s.id === id ? updated.data : s)));
        return updated.data;
    }, []);

    //DELETE - drops the row locally, then refetches so the page backfills
    const deleteStudent = useCallback(async (id) => {
        await api.delete(`/registrar/students/${id}`);
        setStudents((prev) => prev.filter((s) => s.id !== id));
        setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
        await fetchStudents();
    }, [fetchStudents]);

    return {
        students,
        meta,
        isLoading,
        error,
        refetch: fetchStudents,
        createStudent,
        updateStudent,
        deleteStudent,
    };
}
