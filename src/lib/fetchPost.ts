// import { getDatabase } from "./db";
// import { fetchAll } from "./services";
import { db } from "./db";

// const db = getDatabase();
const ITEMS_PER_PAGE = 6;

export async function fetchFilteredPosts(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const stmt = db.prepare(`
          SELECT * FROM posts
            WHERE 
              body LIKE '%${query}%' OR
              title LIKE '%${query}%' OR
              slug LIKE '%${query}%'
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        `);
    const data = stmt.all();
    return data;
  } catch (err) {
    console.error(err);
  }
}

export async function fetchArticlesPages(query: string) {
  try {
    const sql = `SELECT COUNT(*) as count
      FROM posts
      WHERE
        title LIKE '%${query}%' OR
        body LIKE '%${query}%'

    `;
    const stmt = db.prepare(sql).get() as { count: number };

    const totalPages = Math.ceil(stmt.count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}
