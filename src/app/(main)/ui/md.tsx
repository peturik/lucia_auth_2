"use client";
import { useThemeStore } from "@/stores/useThemeStore";
import MarkdownPreview from "@uiw/react-markdown-preview";

export default function Md({ source }: { source: string }) {
  const theme = useThemeStore((state) => state.theme);

  const bg = theme === "light" ? "#fff" : "#1111";

  return (
    <div data-color-mode={theme}>
      <MarkdownPreview
        source={source}
        className="font-alegreya"
        rehypeRewrite={(node, _, parent) => {
          // Перевіряємо, чи вузол є HTML-елементом
          if (
            "tagName" in node &&
            node.tagName === "a" &&
            parent &&
            "tagName" in parent &&
            /^h(1|2|3|4|5|6)/.test(parent.tagName)
          ) {
            parent.children = parent.children.slice(1);
          }
        }}
        style={{
          background: bg,
        }}
      />
    </div>
  );
}
