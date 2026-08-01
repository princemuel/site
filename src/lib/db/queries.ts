import type { Row } from "@libsql/client";

export interface CatalogFilter {
  query?: string;
  rating?: number;
  emotion?: number;
  source?: string;
  sort?: "date" | "rating";
  page?: number;
  perPage?: number;
}

export interface ReviewRow {
  id: number;
  kind: string;
  source: string;
  source_id: string;
  title: string;
  cover_url: string | null;
  cover_focus_y: number | null;
  rating: number;
  status: "finished" | "planned";
  comment: string;
  meta: string;
  finished_at: string | null;
  inserted_at: string;
}

const SOURCES = new Set([
  "IGDB",
  "TMDB_MOVIE",
  "TMDB_TV",
  "OPENLIBRARY",
  "SPOTIFY",
  "BGG",
] as const);
const MAX_PER_PAGE = 50;
const DEFAULT_PER_PAGE = 20;

export function parseFilterFromURL(url: URL): CatalogFilter {
  const params = url.searchParams;
  const source = params.get("source");
  return {
    query: params.get("query")?.trim(),
    rating: clampInt(params.get("rating"), 0, 5),
    emotion: toInt(params.get("emotion")),
    source: source && SOURCES.has(source) ? source : undefined,
    sort: params.get("sort") === "rating" ? "rating" : "date",
    page: clampInt(params.get("page"), 1, Infinity) ?? 1,
    perPage: clampInt(params.get("perPage"), 1, MAX_PER_PAGE) ?? DEFAULT_PER_PAGE,
  };
}

function toInt(v: string | null): number | undefined {
  if (v === null) return undefined;
  const n = Number(v);
  return Number.isSafeInteger(n) ? n : undefined;
}

function clampInt(v: string | null, min: number, max: number) {
  const n = toInt(v);
  return n === undefined ? undefined : Math.min(Math.max(n, min), max);
}

/** Shared WHERE-clause builder — the one place filter → SQL translation happens. */
function buildWhereClause(filter: CatalogFilter): { where: string; args: (string | number)[] } {
  const clauses: string[] = [];
  const args: (string | number)[] = [];

  if (filter.query) {
    clauses.push("(title LIKE ? OR comment LIKE ? OR meta LIKE ?)");

    const like = `%${filter.query}%`;
    args.push(like, like, like);
  }

  if (typeof filter.rating === "number") {
    clauses.push("rating = ?");
    args.push(filter.rating);
  }

  if (typeof filter.emotion === "number") {
    clauses.push(
      `EXISTS (SELECT 1 FROM review_emotions Re WHERE Re.review_id = reviews.id AND Re.emotion_id = ?)`,
    );
    args.push(filter.emotion);
  }

  if (filter.source) {
    clauses.push("source = ?");
    args.push(filter.source);
  }

  return { where: clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "", args };
}

export function buildPageQuery(filter: CatalogFilter) {
  const { where, args } = buildWhereClause(filter);

  const orderBy = filter.sort === "rating" ? "rating DESC, inserted_at DESC" : "inserted_at DESC";
  const perPage = filter.perPage ?? DEFAULT_PER_PAGE;
  const offset = ((filter.page ?? 1) - 1) * perPage;

  return {
    sql: `SELECT *, COUNT(*) OVER () AS total
          FROM reviews ${where}
          ORDER BY ${orderBy}
          LIMIT ? OFFSET ?`,
    args: [...args, perPage, offset],
  };
}

export interface CatalogueEntry {
  id: string;
  title: string;
  kind: string;
  source: string;
  coverUrl: string | null;
  coverFocusY: number | null;
  rating: number;
  status: ProgressStatus;
  comment: string;
  meta: Record<string, unknown>;
  finishedAt: string | null;
  insertedAt: string;
}

type ProgressStatus = "finished" | "planned" | "in-progress";

export function mapRow(row: Row): CatalogueEntry {
  return {
    id: JSON.stringify(row.id),
    title: row.title as string,
    kind: row.kind as string,
    source: row.source as string,
    coverUrl: row.cover_url as string | null,
    coverFocusY: row.cover_focus_y as number | null,
    rating: row.rating as number,
    status: row.status as ProgressStatus,
    comment: row.comment as string,
    meta: JSON.parse((row.meta as string) ?? "{}") as Record<string, unknown>,
    finishedAt: row.finished_at as string | null,
    insertedAt: row.inserted_at as string,
  };
}
