//Single place where the app talks to Laravel. Every hook goes through this,
//so the token header, JSON parsing, and error shape are handled once.
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const TOKEN_KEY = "sis_token";

export function getToken(){
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token){
    if(token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
}

//Thrown for any non-2xx response. `errors` carries Laravel's per-field
//validation messages so a form can render them under the right input.
export class ApiError extends Error{
    constructor(message, status, errors){
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.errors = errors || {};
    }
}

async function request(path, { method = "GET", body } = {}){
    const token = getToken();

    let response;
    try{
        response = await fetch(`${BASE_URL}${path}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
        });
    } catch {
        //fetch only rejects on a genuine network/CORS failure
        throw new ApiError("Unable to reach the server. Is Laravel running?", 0);
    }

    //204 No Content - a successful DELETE has nothing to parse
    if(response.status === 204) return null;

    const payload = await response.json().catch(() => null);

    if(!response.ok){
        //A stale or revoked token should not leave the UI half signed in
        if(response.status === 401){
            setToken(null);
        }
        throw new ApiError(
            payload?.message || `Request failed with status ${response.status}`,
            response.status,
            payload?.errors,
        );
    }

    return payload;
}

export const api = {
    get:    (path)        => request(path),
    post:   (path, body)  => request(path, { method: "POST", body }),
    put:    (path, body)  => request(path, { method: "PUT", body }),
    patch:  (path, body)  => request(path, { method: "PATCH", body }),
    delete: (path)        => request(path, { method: "DELETE" }),
};
