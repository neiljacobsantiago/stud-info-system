//Accent colors keyed by year level, plus a neutral fallback
const YEAR_LEVEL_COLORS = {
    "1st Year": "#22C55E",
    "2nd Year": "#3B82F6",
    "3rd Year": "#EAB308",
    "4th Year": "#EF4444",
};

const NEUTRAL_COLOR = "#9CA3AF";

//picks the accent color for a student's card based on year level
export function studentAccentColor(student){
    if(student.status === "inactive") return NEUTRAL_COLOR;
    return YEAR_LEVEL_COLORS[student.yearLevel] || NEUTRAL_COLOR;
}

//builds the two-letter initials shown on a student's avatar
export function studentInitials(student){
    const first = student.firstName?.[0] || "";
    const last = student.lastName?.[0] || "";
    return (first + last).toUpperCase() || "--";
}

//turns a status code into the label shown on a card
export function statusLabel(status){
    return status === "inactive" ? "Inactive" : "Active";
}

//The registrar number is now generated and stored by Laravel, so it stays
//stable when records are deleted. The fallback only covers a record that has
//somehow not been stamped yet
export function studentId(student){
    if(student.studentNo) return student.studentNo;
    if(!student.enrollmentYear) return "Pending";

    const yy = String(student.enrollmentYear).slice(-2);
    return `ID1${yy}-${String(student.id).padStart(4, "0")}`;
}
