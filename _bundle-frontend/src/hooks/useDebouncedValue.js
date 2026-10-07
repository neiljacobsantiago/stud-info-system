import { useEffect, useState } from "react";

//Delays a fast-changing value so the search box fires one request after the
//user stops typing instead of one per keystroke
export default function useDebouncedValue(value, delay = 300){
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
