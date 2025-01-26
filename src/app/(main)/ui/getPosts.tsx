import { fetchFilteredPosts } from "@/lib/fetchPost";
import { Post } from "@/types/post";
import React from "react";
import Md from "./md";

export default async function GetPosts({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const posts = (await fetchFilteredPosts(
    query,
    currentPage
  )) as unknown as Post[];

  return (
    <div className="flex flex-wrap">
      {posts?.map((post: Post) => {
        return (
          <div className="mb-12" key={post.id}>
            <div className="text-3xl font-bold"> {post.title}</div>
            <span className=" text-base text-gray-600">user Id</span>
            <div className="mt-4 mb-4">
              <Md source={post.description} />
            </div>
            <div className="">Read more...</div>
          </div>
        );
      })}
    </div>
  );
}
