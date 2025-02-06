"use client";
// import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TextField } from "@mui/material";
import { useThemeStore } from "@/stores/useThemeStore";
import { motion } from "motion/react";

export default function Search() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const themeMode = useThemeStore((state) => state.theme);

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    const q = term.trim();
    params.set("page", "1");
    if (q) {
      params.set("query", q);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const darkTheme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  /*return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
           <input
        className="peer block w-full rounded-md border  py-[9px] pl-10 text-sm outline-2 
        dark:bg-gray-800 
        hover:dark:bg-gray-900 
        focus:dark:bg-gray-900 
        focus:outline-none
        border-gray-500
        hover:border-blue-400 
        focus:border-blue-400 
        placeholder:text-gray-500 "
        placeholder={placeholder}
        name="search"
        id="search"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900 dark:peer-focus:text-gray-300" />
    </div>
  ); */
  return (
    <motion.div
      className="relative flex flex-1 flex-shrink-0"
      // initial={{ opacity: 0, scale: 0 }}
      // animate={{ opacity: 1, scale: 1 }}
      initial={{ width: 0 }}
      animate={{ width: "auto" }}
      transition={{ duration: 0.3 }}
    >
      <ThemeProvider theme={darkTheme}>
        <TextField
          id="standard-search"
          name="search"
          label="Search"
          type="search"
          variant="standard"
          fullWidth
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("query")?.toString()}
        />
      </ThemeProvider>
    </motion.div>
  );
}
