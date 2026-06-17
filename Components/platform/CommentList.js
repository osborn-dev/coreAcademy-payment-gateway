// Server-renderable list of lesson comments. Each row shows an initial-avatar,
// the author name + formatted date, and the body. Moderation controls come later
// in the admin dashboard.

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CommentList({ comments }) {
  if (!comments || comments.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-500 text-sm">
        Be the first to comment.
      </p>
    );
  }

  return (
    <ul className="space-y-5">
      {comments.map((c) => (
        <li key={c.id} className="flex gap-3">
          <span className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold shrink-0">
            {(c.authorName?.charAt(0) ?? "?").toUpperCase()}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900 dark:text-white">
                {c.authorName}
              </span>
              <span className="text-gray-500 dark:text-gray-500 text-xs">
                {formatDate(c.createdAt)}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap mt-1">
              {c.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
