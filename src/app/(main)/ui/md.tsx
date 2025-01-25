"use client";
import MDEditor from "@uiw/react-md-editor";
import { useThemeStore } from "@/stores/useThemeStore";

export default function Md({ source }: any) {
  const theme = useThemeStore((state) => state.theme);
  console.log(theme);

  let bg = theme === "dark" ? "#1111" : "#fff";
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
