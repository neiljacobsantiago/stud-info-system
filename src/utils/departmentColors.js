// A small curated set of badge styles. We pick one deterministically based on
// the department name so the same department always renders the same color,
// without having to hand-maintain a lookup table for every possible value
// the API can return.
const PALETTE = [
  "bg-ink-100 text-ink-700",
  "bg-manila text-ink-900",
  "bg-brass-light text-brass-dark",
  "bg-ink-50 text-ink-500 border border-ink-100",
];

export function departmentBadgeClass(department) {
  if (!department) return PALETTE[0];

  let hash = 0;
  for (let i = 0; i < department.length; i += 1) {
    hash = (hash * 31 + department.charCodeAt(i)) % PALETTE.length;
  }
  return PALETTE[Math.abs(hash)];
}

// Formats a raw numeric id into a registrar-style record number, e.g. 7 -> "STU-0007"
export function formatStudentId(id) {
  return `STU-${String(id).padStart(4, "0")}`;
}
