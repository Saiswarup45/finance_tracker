import { getCategoryMeta } from "../utils/helpers";

export default function CategoryBadge({ category, size = "md" }) {
  const meta = getCategoryMeta(category);

  const sizes = {
    sm: { padding: "3px 8px", fontSize: 10, iconSize: 11, gap: 4 },
    md: { padding: "5px 10px", fontSize: 11, iconSize: 13, gap: 5 },
    lg: { padding: "7px 14px", fontSize: 13, iconSize: 15, gap: 6 },
  };

  const sz = sizes[size];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: sz.gap,
        padding: sz.padding,
        borderRadius: 99,
        background: `${meta.color}15`,
        border: `1px solid ${meta.color}30`,
        color: meta.color,
        fontSize: sz.fontSize,
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: sz.iconSize }}>{meta.icon}</span>
      {category}
    </span>
  );
}