import React, { use } from "react";

export async function fetchData() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_start=0&_limit=8"
  );
  return response.json();
}

export default function GetPosts() {
  const posts = use(fetchData());
  // console.log(posts);

  return (
    <div className="flex flex-wrap">
      {posts &&
        posts.map((post: any) => {
          return (
            <div className="mb-12" key={post.id}>
              <div className="text-3xl font-bold"> {post.title}</div>
              <span className=" text-base text-gray-600">user Id</span>
              <div className="mt-4 mb-4">{post.body}</div>
              <div className="">Read more...</div>
            </div>
          );
        })}
    </div>
  );
}
