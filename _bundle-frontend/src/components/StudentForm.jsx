import { useEffect, useState } from "react";

const INPUT_CLASSES =
    "w-full rounded-md border border-paper-line bg-paper-card px-3 py-2 text-sm text-ink-900 focus:border-gold focus:outline-none";

const EMPTY_FORM = {
    first_name: "",
    last_name: "",
    program_id: "",
    section_id: "",
    hometown: "",
    enrollment_year: new Date().getFullYear(),
    status: "active",
    bio: "",
};

//Maps an existing record (camelCase, as the API returns it) back onto the
//snake_case field names Laravel validates against
function toFormState(student){
    if(!student) return EMPTY_FORM;
    return {
        first_name: student.firstName ?? "",
        last_name: student.lastName ?? "",
        program_id: student.programId ?? "",
        section_id: student.sectionId ?? "",
        hometown: student.hometown ?? "",
        enrollment_year: student.enrollmentYear ?? new Date().getFullYear(),
        status: student.status ?? "active",
        bio: student.bio ?? "",
    };
}

//Create/edit form for a student record. It never validates instead of the
//server - it only renders whatever the server sends back in `errors`
export default function StudentForm({ student, programs, sections, onSubmit, onClose }){
    const [form, setForm] = useState(() => toFormState(student));
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const isEditing = Boolean(student);

    useEffect(() => {
        setForm(toFormState(student));
        setErrors({});
        setFormError("");
    }, [student]);

    //Sections belong to a program, so changing the program clears a section
    //that would no longer be valid
    const availableSections = sections.filter(
        (section) => String(section.programId) === String(form.program_id),
    );

    const setField = (name) => (event) => {
        const { value } = event.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "program_id" ? { section_id: "" } : {}),
        }));
    };

    async function handleSubmit(){
        setIsSaving(true);
        setErrors({});
        setFormError("");

        try{
            await onSubmit({
                ...form,
                program_id: Number(form.program_id),
                section_id: Number(form.section_id),
                enrollment_year: Number(form.enrollment_year),
            });
            onClose();
        } catch (err){
            //422 carries per-field messages; anything else is a single banner
            setErrors(err.errors || {});
            setFormError(Object.keys(err.errors || {}).length ? "" : err.message);
        } finally {
            setIsSaving(false);
        }
    }

    const fieldError = (name) =>
        errors[name] ? <p className="mt-1 text-xs text-error">{errors[name][0]}</p> : null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink-900/60 px-4 py-8"
            role="dialog"
            aria-modal="true"
            aria-label={isEditing ? "Edit student record" : "New student record"}
            onClick={onClose}
        >
            <div className="w-full max-w-2xl bg-paper-card" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start justify-between border-b border-paper-line px-6 py-4">
                    <h2 className="font-serif text-2xl text-ink-900">
                        {isEditing ? "Edit record" : "New student record"}
                    </h2>
                    <button type="button" onClick={onClose} aria-label="Close form" className="text-ink-500 hover:text-ink-900">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4 px-6 py-5">
                    {formError && (
                        <div className="rounded-md border border-error/30 bg-error/5 px-3 py-2 text-sm text-error">
                            {formError}
                        </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="first_name" className="text-sm text-ink-700">First name</label>
                            <input id="first_name" className={INPUT_CLASSES} value={form.first_name} onChange={setField("first_name")} />
                            {fieldError("first_name")}
                        </div>

                        <div>
                            <label htmlFor="last_name" className="text-sm text-ink-700">Last name</label>
                            <input id="last_name" className={INPUT_CLASSES} value={form.last_name} onChange={setField("last_name")} />
                            {fieldError("last_name")}
                        </div>

                        <div>
                            <label htmlFor="program_id" className="text-sm text-ink-700">Course</label>
                            <select id="program_id" className={INPUT_CLASSES} value={form.program_id} onChange={setField("program_id")}>
                                <option value="">Select a course</option>
                                {programs.map((program) => (
                                    <option key={program.id} value={program.id}>{program.code}</option>
                                ))}
                            </select>
                            {fieldError("program_id")}
                        </div>

                        <div>
                            <label htmlFor="section_id" className="text-sm text-ink-700">Section</label>
                            <select
                                id="section_id"
                                className={INPUT_CLASSES}
                                value={form.section_id}
                                onChange={setField("section_id")}
                                disabled={!form.program_id}
                            >
                                <option value="">
                                    {form.program_id ? "Select a section" : "Choose a course first"}
                                </option>
                                {availableSections.map((section) => (
                                    <option key={section.id} value={section.id}>
                                        {section.code} - {section.yearLevel} ({section.openSlots} slots left)
                                    </option>
                                ))}
                            </select>
                            {fieldError("section_id")}
                        </div>

                        <div>
                            <label htmlFor="hometown" className="text-sm text-ink-700">Hometown</label>
                            <input id="hometown" className={INPUT_CLASSES} value={form.hometown} onChange={setField("hometown")} />
                            {fieldError("hometown")}
                        </div>

                        <div>
                            <label htmlFor="enrollment_year" className="text-sm text-ink-700">Enrollment year</label>
                            <input id="enrollment_year" type="number" className={INPUT_CLASSES} value={form.enrollment_year} onChange={setField("enrollment_year")} />
                            {fieldError("enrollment_year")}
                        </div>

                        <div>
                            <label htmlFor="status" className="text-sm text-ink-700">Status</label>
                            <select id="status" className={INPUT_CLASSES} value={form.status} onChange={setField("status")}>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            {fieldError("status")}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="bio" className="text-sm text-ink-700">Notes</label>
                        <textarea id="bio" rows={3} className={INPUT_CLASSES} value={form.bio} onChange={setField("bio")} />
                        {fieldError("bio")}
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-paper-line px-6 py-4">
                    <button type="button" onClick={onClose} className="rounded-md px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-paper hover:bg-ink-700 disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : isEditing ? "Save changes" : "Create record"}
                    </button>
                </div>
            </div>
        </div>
    );
}
