import { db } from "@/lib/db";
import Link from "next/link";

type Tags = {
  id: number;
  title: string;
  rate: number;
};

const getTags = () => {
  return db.prepare(`SELECT * FROM tags;`).all() as Tags[];
};

export const Sidebar = () => {
  const tags = getTags();

  return (
    <div>
      <h1>Sidebar</h1>
      {tags.map((tag: Tags) => (
        <div key={tag.id}>
          <Link href={"#"}>{tag.title}</Link>
        </div>
      ))}
    </div>
  );
};
