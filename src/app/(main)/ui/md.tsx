"use client";
import { useThemeStore } from "@/stores/useThemeStore";
import MDEditor from "@uiw/react-md-editor";
import { motion } from "motion/react";
import type { Post } from "@/types/post";
import { formatDistanceToNow } from "date-fns";

export default function Md(post: Post) {
  const theme = useThemeStore((state) => state.theme);

  const bg = theme === "light" ? "#fff" : "#1111";

  return (
    <motion.div
      data-color-mode={theme}
      className=""
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-3xl font-bold"> {post.title}</div>
      <span className=" text-base text-gray-600">
        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
      </span>
      <div className="mt-4 mb-4">
        <MDEditor.Markdown
          source={post.description}
          style={{
            background: bg,
          }}
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
        />
      </div>
      <div className="">Read more...</div>
    </motion.div>
  );
}
