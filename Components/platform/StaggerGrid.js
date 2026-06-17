"use client";
import { motion } from "framer-motion";

// Wraps a grid of cards and fades them in with a stagger on mount. The pages
// using this stay Server Components — only this wrapper is client. Pass the grid
// layout classes via `className`; each direct child is animated individually.
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function StaggerGrid({ children, className }) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {Array.isArray(children)
        ? children.map((child, i) => (
            <motion.div key={child?.key ?? i} variants={item}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={item}>{children}</motion.div>}
    </motion.div>
  );
}
