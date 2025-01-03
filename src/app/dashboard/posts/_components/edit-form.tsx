"use client";
import { updatePost } from "../../actions";
import Link from "next/link";
import Image from "next/image";
import { useActionState, useState } from "react";
import slug from "slug";
import { Button } from "./button";
import type { Post } from "@/types/post";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "motion/react";
import type { Tags } from "@/types/post";
import ModalPost from "./modal-post";

type Props = {
  post: Post;
  tags: Tags[];
};

export default function EditFormPost({ post, tags }: Props) {
  const [title, setTitle] = useState(post.title);
  const [status, setStatus] = useState(post.status);
  const [image, setImage] = useState(
    post.image_url ? `/${post.image_url}` : ""
  );
  const [selectedOption, setSelectedOption] = useState<string[]>(
    post.tags?.split(",") as string[]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [val, setVal] = useState("");

  function handler(e: string) {
    if (selectedOption.includes(e)) {
      const arr = selectedOption.filter((item) => item !== e);
      setSelectedOption(arr);
    } else {
      let arr = [...selectedOption, e];
      setSelectedOption(arr.filter((item) => item !== ""));
      if (!e.length) setIsOpen(true);
    }
  }

  const [errorMessage, formAction, isPending] = useActionState(
    updatePost,
    undefined
  );

  return (
    <div>
      <form action={formAction}>
        <div className="rounded-md bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-4 md:p-6">
          <input id="id" name="id" type="hidden" value={post.id} />
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              Title
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="title"
                  name="title"
                  type="text"
                  defaultValue={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter title"
                  className="input-style"
                  required
                  minLength={5}
                />
              </div>
            </div>
          </div>

          {/* slug */}
          <div className="mb-4">
            <label htmlFor="slug" className="mb-2 block text-sm font-medium">
              Slug
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  placeholder="Enter slug"
                  defaultValue={slug(title)}
                  className="input-style"
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="body" className="mb-2 block text-sm font-medium">
              Description
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter your text"
                  rows={5}
                  defaultValue={post.description}
                  className=" input-style"
                  required
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="mb-4">
            <label htmlFor="body" className="mb-2 block text-sm font-medium">
              Body
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <textarea
                  id="body"
                  name="body"
                  placeholder="Enter your text"
                  rows={12}
                  defaultValue={post.body}
                  className="input-style"
                  required
                />
              </div>
            </div>
          </div>

          {/* Select */}

          <div className="mb-4">
            <label htmlFor="select" className="bm-2 block text-sm font-medium">
              {selectedOption.length
                ? "Selected tags is:"
                : "Select 1 or 2 tags"}
            </label>
            <div className="relative mt-2 rounded-md">
              <div className="pb-2">{`${selectedOption} `}</div>
              <div className="relative">
                <select
                  name="select"
                  id="select"
                  className="peer block w-full rounded-md border border-gray-200 dark:bg-slate-800 placeholder:dark:text-gray-400 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  onChange={(e) => handler(e.target.value)}
                  value={"selectTag"}
                >
                  <option value="selectTag">Select tags</option>

                  {tags.map((tag: Tags) => (
                    <option key={tag.id} value={tag.title}>
                      {tag.title}
                    </option>
                  ))}
                  <option value="">Add new tag</option>
                </select>
              </div>
            </div>
          </div>

          <input type="hidden" name="tags" value={selectedOption} />

          {/* main image */}
          <div className="mb-4">
            <label htmlFor="image">Image</label>
            {image && (
              <Image
                src={image!}
                alt={post.slug}
                width={200}
                height={200}
                className="w-auto h-32 px-2"
              />
            )}
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="image"
                  name="image"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  defaultValue={""}
                  onChange={() => {
                    setImage("");
                  }}
                />
              </div>
            </div>
          </div>

          {/* status */}
          <div className="mb-4">
            <label htmlFor="status">Status</label>
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="status"
                  name="status"
                  type="checkbox"
                  value={status}
                  onChange={() => setStatus(status == 1 ? 0 : 1)}
                  defaultChecked={post.status ? true : false}
                />
              </div>
            </div>
          </div>

          {errorMessage && typeof errorMessage !== typeof NaN && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
          <div className="mt-6 flex justify-end gap-4">
            <Link
              href="/dashboard/posts"
              className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Cancel
            </Link>
            <Button type="submit" aria-disabled={isPending}>
              Update Post
            </Button>
          </div>
        </div>
      </form>
      {/* modal motion */}
      <div className="flex justify-center items-center">
        <AnimatePresence>
          {isOpen && (
            <ModalPost
              onClose={() => setIsOpen(false)}
              title="Add new tag"
              handler={handler}
              val={val}
              setVal={setVal}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
