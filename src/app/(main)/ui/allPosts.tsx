"use client";
import { Post } from "@/types/post";
import React from "react";
import Md from "./md";
import { use } from "react";

export default function AllPosts({ posts }: { posts: Promise<Post[]> }) {
  const allPosts = use(posts);

  return (
    <div className="flex flex-wrap">
      {allPosts?.map((post: Post) => {
        if (!post.status) return null;
        return (
          <div className="mb-12 pt-6 w-fill" key={post.id}>
            <Md {...post} />
          </div>
        );
      })}
    </div>
  );
}
