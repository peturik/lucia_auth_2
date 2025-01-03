"use server";
import { PostSchema } from "./ui/zod";
import { promises as fs } from "fs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { saveFiles } from "@/lib/saveFiles";
import { z } from "zod";
import { join } from "path";
import { revalidatePath } from "next/cache";
import { uid } from "uid/secure";

const postSchema = PostSchema();

/* INSERT INTO */
export async function createPost(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    let { title, slug, description, body, tags, image, status } =
      postSchema.parse({
        id: "",
        title: formData.get("title"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        body: formData.get("body"),
        tags: formData.get("tags"),
        image: formData.get("image"),
        status: formData.get("status"),
      });

    console.log(image);
    if (!status) status = 0;

    let image_url = "";
    let post;

    if (image?.size) {
      [image_url] = await saveFiles([image], slug);
    }

    const postId = uid();
    const allTags = db.prepare(`SELECT * FROM tags;`).all();

    const stmt = db.prepare(`
              INSERT INTO posts (id, title, slug, description, body, tags, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);
    post = stmt.run(
      postId,
      title,
      slug,
      description,
      body,
      tags,
      image_url,
      status
    ); //gallery?.toString(),
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      return `Error db: ${error.issues.map((e) => e.message)}`;
    } else {
      console.log("Error occured: " + error);
    }
  }

  revalidatePath(`/dashboard/posts`);
  redirect("/dashboard/posts");
}

/* UPDATE posts SET */
export async function updatePost(
  prevState: string | undefined,
  // id: string,
  formData: FormData
) {
  try {
    let { id, title, slug, description, body, tags, image, status } =
      postSchema.parse({
        id: formData.get("id"),
        title: formData.get("title"),
        slug: formData.get("slug"),
        description: formData.get("description"),
        body: formData.get("body"),
        tags: formData.get("tags"),
        image: formData.get("image"),
        status: formData.get("status"),
      });

    console.log(tags);

    let image_url = "";

    if (image?.size) {
      const img = db
        .prepare(`SELECT image_url FROM posts WHERE id = ?`)
        .get(id) as { image_url: string };

      if (img.image_url) {
        await fs.rm(join(process.cwd(), "public/", img.image_url));
      }

      [image_url] = await saveFiles([image], slug);
    } else {
      const img = db
        .prepare(`SELECT image_url FROM posts WHERE id = ?`)
        .get(id) as { image_url: string };

      image_url = img.image_url;
    }

    db.prepare(
      `
      UPDATE posts
            SET title = ?, 
                slug = ?, 
                description = ?,
                body = ?,
                tags = ?,
                image_url = ?,
                status = ?
            WHERE id = ?`
    ).run(title, slug, description, body, tags, image_url, status, id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      return `Error: ${error.issues.map((e) => e.message)}`;
    } else {
      console.log("Error occured: " + error);
    }
  }
  revalidatePath(`/dashboard/posts`);
  redirect("/dashboard/posts");
}

/* DELETE FROM */
export async function deletePost(id: string, formData: FormData) {
  const result = db.prepare(`SELECT slug FROM posts WHERE id = ?`).get(id) as {
    slug: string;
  };

  const dir = join(process.cwd(), "/public/uploads/", result.slug);

  try {
    if (await fs.stat(dir)) {
      await fs.rm(dir, {
        recursive: true,
      });
    }
  } catch (error) {
    console.log(error);
  }

  try {
    db.prepare(`DELETE FROM posts WHERE id = ?`).run(id);

    revalidatePath("/dashboard/posts");
  } catch (error) {
    console.log("This is error: " + error);
  }
}
