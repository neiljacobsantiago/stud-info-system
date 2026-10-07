import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const INPUT_CLASSES =
    "w-full rounded-md border border-paper-line bg-paper-card px-3 py-2 text-sm text-ink-900 focus:border-gold focus:outline-none";

//Sign in / register. Both call Laravel and store the returned Sanctum token
export default function Login({ onSignedIn }){
    const { login, register } = useAuth();

    const [mode, setMode] = useState("login");
    const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isBusy, setIsBusy] = useState(false);

    const isRegistering = mode === "register";

    const setField = (name) => (event) =>
        setForm((prev) => ({ ...prev, [name]: event.target.value }));

    async function handleSubmit(){
        setIsBusy(true);
        setErrors({});
        setFormError("");

        try{
            if(isRegistering) await register(form);
            else await login(form.email, form.password);
            onSignedIn();
        } catch (err){
            setErrors(err.errors || {});
            setFormError(Object.keys(err.errors || {}).length ? "" : err.message);
        } finally {
            setIsBusy(false);
        }
    }

    const fieldError = (name) =>
        errors[name] ? <p className="mt-1 text-xs text-error">{errors[name][0]}</p> : null;

    return (
        <div className="mx-auto max-w-sm space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-ink-900">
                    {isRegistering ? "Create an account" : "Sign in"}
                </h1>
                <p className="mt-1 text-sm text-ink-500">
                    {isRegistering
                        ? "New accounts start with read-only access."
                        : "Registrar and adviser accounts can edit records."}
                </p>
            </div>

            {formError && (
                <div className="rounded-md border border-error/30 bg-error/5 px-3 py-2 text-sm text-error">
                    {formError}
                </div>
            )}

            <div className="space-y-4">
                {isRegistering && (
                    <div>
                        <label htmlFor="name" className="text-sm text-ink-700">Name</label>
                        <input id="name" className={INPUT_CLASSES} value={form.name} onChange={setField("name")} />
                        {fieldError("name")}
                    </div>
                )}

                <div>
                    <label htmlFor="email" className="text-sm text-ink-700">Email</label>
                    <input id="email" type="email" autoComplete="email" className={INPUT_CLASSES} value={form.email} onChange={setField("email")} />
                    {fieldError("email")}
                </div>

                <div>
                    <label htmlFor="password" className="text-sm text-ink-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        autoComplete={isRegistering ? "new-password" : "current-password"}
                        className={INPUT_CLASSES}
                        value={form.password}
                        onChange={setField("password")}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    />
                    {fieldError("password")}
                </div>

                {isRegistering && (
                    <div>
                        <label htmlFor="password_confirmation" className="text-sm text-ink-700">Confirm password</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            autoComplete="new-password"
                            className={INPUT_CLASSES}
                            value={form.password_confirmation}
                            onChange={setField("password_confirmation")}
                        />
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isBusy}
                    className="w-full rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-paper hover:bg-ink-700 disabled:opacity-50"
                >
                    {isBusy ? "Please wait..." : isRegistering ? "Create account" : "Sign in"}
                </button>

                <button
                    type="button"
                    onClick={() => { setMode(isRegistering ? "login" : "register"); setErrors({}); setFormError(""); }}
                    className="w-full text-sm text-ink-500 hover:text-ink-900"
                >
                    {isRegistering ? "Already have an account? Sign in" : "No account yet? Register"}
                </button>
            </div>
        </div>
    );
}
