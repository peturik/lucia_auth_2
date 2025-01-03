import React from "react";
import CreateFormPost from "../_components/create-form";
import Breadcrumbs from "../_components/breadcrumbs";
import { db } from "@/lib/db";

type Tags = {
  id: number;
  title: string;
  rate: number;
};

export default function Page() {
  const tags = db.prepare(`SELECT * FROM tags`).all() as unknown as Tags[];
  // console.log(tags);

  return (
    <div>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Posts", href: "/dashboard/posts" },
          {
            label: "Create Post",
            href: "/dashboard/posts/create",
            active: true,
          },
        ]}
      />
      <CreateFormPost tags={tags} />
    </div>
  );
}
