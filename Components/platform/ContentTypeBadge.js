import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faVideo } from "@fortawesome/free-solid-svg-icons";

const typeMap = {
  article: { icon: faNewspaper, label: "Article", classes: "text-blue-600 dark:text-blue-400 bg-blue-500/10" },
  video:   { icon: faVideo,     label: "Video",   classes: "text-amber-600 dark:text-amber-400 bg-amber-500/10" },
};

export default function ContentTypeBadge({ type }) {
  const { icon, label, classes } = typeMap[type] ?? typeMap.article;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${classes}`}>
      <FontAwesomeIcon icon={icon} className="w-3 h-3" />
      {label}
    </span>
  );
}
