import { useEffect, useState, useCallback } from "react";

//Local, self-created dataset - fetched the same way a remote API would be,
//so the request is still real AJAX with no full-page reload
const DATA_URL = "/students.json";

//Handles the AJAX call for this app - fetches the student list
//asynchronously and exposes loading/error state to whichever page needs it
export default function useStudents(){
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStudents = useCallback(async () =>{

        setIsLoading(true);
        setError(null);

        try{
            const response = await fetch(DATA_URL);

            if(!response.ok){
                throw new Error("Server responded with status " + response.status);
            }

            const data = await response.json();
            setStudents(data.students || []);

        } catch (err){
            setError("Unable to retrieve the data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    //Runs once when the app first mounts
    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    return { students, isLoading, error, refetch: fetchStudents };
}
