"use client";
import MDEditor from "@uiw/react-md-editor";
import { useThemeStore } from "@/stores/useThemeStore";

export default function Md({ source }: { source: string }) {
  const theme = useThemeStore((state) => state.theme);

  const bg = theme === "light" ? "#fff" : "#1111";

  return (
    <div data-color-mode={theme}>
      <MDEditor.Markdown
        source={source}
        style={{
          whiteSpace: "pre-wrap",
          padding: "30px",
          overflow: "auto",
          background: bg,
        }}
      />
    </div>
  );
}
