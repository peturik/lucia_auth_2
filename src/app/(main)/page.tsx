import { Suspense } from "react";
import GetPosts from "../(main)/ui/getPosts";
import Search from "../components/search";
import Pagination from "../components/pagination";
import { fetchCountPosts } from "@/lib/fetchPost";
import "./style.css";

export default async function MainPage(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchCountPosts(query);

  return (
    <main>
      <div className="min-h-screen py-8 font-[family-name:var(--font-geist-sans)] ">
        <div className="md:flex block justify-between my-10">
          <div className="font-bold text-4xl">Font font-geist-sans</div>
          <div className=" basis-1/2 md:mt-auto mt-6">
            <Search placeholder="Search posts..." />
          </div>
        </div>
        <div className="border-b-2 border-gray-600"></div>

        <div className="flex gap-8 py-10">
          <div className="sm:basis-3/12 sm:block hidden">sidebar</div>
          <div className="sm:basis-9/12">
            <Suspense key={query + currentPage} fallback={<h2>Loading...</h2>}>
              <GetPosts query={query} currentPage={currentPage} />
            </Suspense>
          </div>
        </div>

        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </main>
  );
}
