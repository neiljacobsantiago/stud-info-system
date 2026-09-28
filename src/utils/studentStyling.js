//Accent colors keyed by year level, plus a neutral color for open slots
const YEAR_LEVEL_COLORS = {
    "1st Year": "#22C55E",
    "2nd Year": "#3B82F6",
    "3rd Year": "#EAB308",
    "4th Year": "#EF4444",
};

const BLANK_COLOR = "#9CA3AF";

//picks the accent color for a student's card based on year level
export function studentAccentColor(student){
    if(student.category === "blank") return BLANK_COLOR;
    return YEAR_LEVEL_COLORS[student.yearLevel] || BLANK_COLOR;
}

//builds the two-letter initials shown on a student's avatar
export function studentInitials(student){
    const first = student.firstName?.[0] || "";
    const last = student.lastName?.[0] || "";
    return (first + last).toUpperCase() || "--";
}

//turns a category code into a status label shown on a card
export function categoryLabel(category){
    if(category === "blank") return "Open slot";
    return "Active";
}

//builds the student ID from the enrollment year: "ID1" + the last
//two digits of the year + a zero-padded sequence number, e.g. a student who
//enrolled in 2026 with record id 3 -> "ID126-0003"
export function studentId(student){
    if(!student.enrollmentYear) return "Pending";

    const yy = String(student.enrollmentYear).slice(-2);
    const sequence = String(student.id).padStart(4, "0");
    return `ID1${yy}-${sequence}`;
}
