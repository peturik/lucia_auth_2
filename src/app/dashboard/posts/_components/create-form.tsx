"use client";

import { createPost } from "../../actions";
import Link from "next/link";
import { useState, useActionState } from "react";
import slug from "slug";
import { Button } from "./button";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { AnimatePresence } from "motion/react";
import type { Tags } from "@/types/post";
import ModalPost from "./modal-post";

export default function CreateFormPost({ tags }: { tags: Tags[] }) {
  const [title, setTitle] = useState("");
  const [selectedOption, setSelectedOption] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [val, setVal] = useState("");

  const [errorMessage, formAction, isPending] = useActionState(
    createPost,
    undefined
  );

  function handler(evalue: string) {
    if (selectedOption.includes(evalue)) {
      const arr = selectedOption.filter((item) => item !== evalue);
      setSelectedOption(arr);
    } else {
      const arr = [...selectedOption, evalue];
      setSelectedOption(arr.filter((item) => item !== ""));
      if (!evalue.length) setIsOpen(true);
    }
  }

  return (
    <div>
      <form action={formAction}>
        <div className="rounded-md bg-gray-50 dark:bg-gray-700 dark:text-gray-300 p-4 md:p-6">
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
                  defaultValue={""}
                  className="input-style"
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
                  defaultValue={""}
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
                  className="input-style"
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
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="image"
                  name="image"
                  defaultValue={""}
                  placeholder="Enter your text"
                  type="file"
                />
              </div>
            </div>
          </div>

          {/* status */}
          <div className="mb-4">
            <div className="relative mt-2 rounded-md">
              <div className="relative">
                <input
                  id="status"
                  name="status"
                  type="checkbox"
                  value="1"
                  defaultChecked
                />
                <label htmlFor="status"> Status</label>
              </div>
            </div>
          </div>
          {errorMessage && (
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
              Create Post
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
