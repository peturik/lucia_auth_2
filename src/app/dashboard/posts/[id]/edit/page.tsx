import EditFormPost from "../../_components/edit-form";
import Breadcrumbs from "../../_components/breadcrumbs";
import { db } from "@/lib/db";
import type { Post, Tags } from "@/types/post";
import { Suspense } from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = db.prepare(`SELECT * FROM posts WHERE id = ?`).get(id) as Post;
  const tags = db.prepare(`SELECT * FROM tags`).all() as unknown as Tags[];

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Posts", href: "/dashboard/posts" },
          {
            label: "Edit post",
            href: `/dashboard/posts/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Suspense fallback="...Loading">
        <EditFormPost post={post} tags={tags} />
      </Suspense>
    </main>
  );
}
