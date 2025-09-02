import { describe, it, expect, beforeEach, vi } from "vitest";

const versesData = [
  { id: "1", bookId: "b1", number: 1, text: "v1" },
  { id: "2", bookId: "b1", number: 2, text: "v2" },
  { id: "3", bookId: "b1", number: 3, text: "v3" },
  { id: "4", bookId: "b1", number: 4, text: "v4" },
];

const store = new Map<string, any>();
const findMany = vi.fn(async ({ limit, offset }: any) =>
  versesData.slice(offset, offset + limit),
);
const redis = {
  get: vi.fn(async (key: string) => store.get(key)),
  set: vi.fn(async (key: string, value: any, opts?: any) => {
    store.set(key, value);
  }),
};

vi.mock("@/lib/redis", () => ({ redis }));
vi.mock("@/lib/db", () => ({ db: { query: { verses: { findMany } } } }));
vi.mock("@/lib/schema", () => ({ verses: {} }));

const { GET } = await import("../app/api/verses/route");

describe("verses route", () => {
  beforeEach(() => {
    store.clear();
    vi.clearAllMocks();
  });

  it("returns paginated verses and caches result", async () => {
    const res = await GET(new Request("http://test?bookId=b1&page=2&limit=2"));
    const json = await res.json();
    expect(json).toEqual(versesData.slice(2, 4));
    expect(redis.set).toHaveBeenCalledWith(
      "verses:b1:2:2",
      versesData.slice(2, 4),
      { ex: 60 },
    );
  });

  it("returns cached verses", async () => {
    const cached = versesData.slice(0, 2);
    store.set("verses:b1:1:2", cached);
    const res = await GET(new Request("http://test?bookId=b1&page=1&limit=2"));
    expect(await res.json()).toEqual(cached);
    expect(redis.get).toHaveBeenCalled();
    expect(redis.set).not.toHaveBeenCalled();
    expect(findMany).not.toHaveBeenCalled();
  });

  it("validates missing bookId", async () => {
    const res = await GET(new Request("http://test"));
    expect(res.status).toBe(400);
  });

  it("rejects invalid pagination", async () => {
    const res = await GET(new Request("http://test?bookId=b1&page=0"));
    expect(res.status).toBe(400);
  });
});
