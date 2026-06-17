import Link from "next/link";

// Renders a row of filter tabs as links. Selecting a tab sets ONE search param
// (paramKey) while preserving all the other current params, so filters on
// different dimensions (e.g. type + topic) stack. No client state — the URL is
// the single source of truth, which keeps /explore a Server Component and makes
// filtered views shareable + back-button friendly.
//
// Props:
//   label      — small heading above the row (e.g. "Type", "Topic")
//   paramKey   — the search param this bar controls (e.g. "type", "topic")
//   options    — [{ value, label }]  (value "" means "All")
//   current    — the full current searchParams object (plain { key: value })
//   basePath   — e.g. "/explore"
export default function FilterBar({ label, paramKey, options, current = {}, basePath }) {
  function hrefFor(value) {
    const params = new URLSearchParams();
    // preserve every other param as-is
    for (const [k, v] of Object.entries(current)) {
      if (k !== paramKey && v) params.set(k, v);
    }
    // set (or clear, when value is "") this bar's param
    if (value) params.set(paramKey, value);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const activeValue = current[paramKey] ?? "";

  return (
    <div className="mb-6">
      {label ? (
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider mb-2">
          {label}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = activeValue === opt.value;
          return (
            <Link
              key={opt.value || "all"}
              href={hrefFor(opt.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "bg-black/[0.03] dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
