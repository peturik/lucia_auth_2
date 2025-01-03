import PostsTable from "./_components/post-table";
import Search from "@/app/components/search";
import { fetchArticlesPages } from "@/lib/fetchPost";
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
  const totalPages = await fetchArticlesPages(query);

  return (
    <main>
      <div className="w-full">
        <div className="flex w-full items-center justify-between">
          <h1 className={`text-2xl`}>Posts</h1>
        </div>
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search posts..." />
          <CreatePost />
        </div>
        <Suspense key={query + currentPage} fallback={<h2>Loading...</h2>}>
          <PostsTable query={query} currentPage={currentPage} />
        </Suspense>

        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
}
