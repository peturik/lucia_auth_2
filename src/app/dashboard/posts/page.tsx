import PostsTable from "./_components/post-table";
import Search from "@/app/components/search";
import { fetchCountPosts } from "@/lib/fetchPost";
import { fetchFilteredPosts } from "@/lib/fetchPost";
import type { Post } from "@/types/post";
import Pagination from "@/app/components/pagination";
import { Suspense } from "react";
import { CreatePost } from "./_components/buttons";

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchCountPosts(query);

  const posts = (await fetchFilteredPosts(
    query,
    currentPage
  )) as unknown as Post[];

  return (
    <main>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`text-2xl`}>Posts</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search />
          <CreatePost />
        </div>
        <Suspense key={query + currentPage} fallback={<h2>Loading...</h2>}>
          <PostsTable posts={posts} />
        </Suspense>

        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
}
