import { useEffect, useState } from "react";
import { api } from "../lib/api.js";

//Programs and sections, used by the Browse filters and the student form.
//Reference data that rarely changes, so it is loaded once per mount
export default function useLookups(){
    const [programs, setPrograms] = useState([]);
    const [sections, setSections] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load(){
            try{
                const [programsRes, sectionsRes] = await Promise.all([
                    api.get("/academics/programs"),
                    api.get("/academics/sections"),
                ]);
                if(cancelled) return;
                setPrograms(programsRes.data);
                setSections(sectionsRes.data);
            } catch {
                //Non-fatal: the page still renders, the selects are just empty
            } finally {
                if(!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => { cancelled = true; };
    }, []);

    //Year levels come from the sections table rather than a hardcoded list
    const yearLevels = [...new Set(sections.map((s) => s.yearLevel))].sort();

    return { programs, sections, yearLevels, isLoading };
}
