<<<<<<< HEAD
"use client"
import { useEffect, useState } from "react"
import { CommentForm } from "./comment-form"

interface Comment {
  id: string
  username?: string
  karma?: number
  content: string
  createdAt: string
  updatedAt: string
  votes: number
  parentId?: string
  flagged?: boolean
  removed?: boolean
}

export function CommentSection({ verseId, userId }: { verseId: string; userId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
=======
"use client";
import { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {useTranslations, useLocale} from "next-intl";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  votes: number;
}

export function CommentSection({ verseId }: { verseId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const t = useTranslations('Comments');
  const locale = useLocale();
>>>>>>> origin/codex/set-up-next-intl-with-translations

  async function load() {
    const res = await fetch(`/api/comments?verseId=${verseId}`);
    if (res.ok) setComments(await res.json());
  }

  useEffect(() => {
    load();
  }, [verseId]);

<<<<<<< HEAD
=======
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verseId, content })
    });
    setContent("");
    load();
  }

>>>>>>> origin/codex/set-up-next-intl-with-translations
  async function vote(id: string, delta: number) {
    await fetch("/api/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verseId, commentId: id, delta })
    });
    load();
  }

  return (
    <div className="mt-8">
<<<<<<< HEAD
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      <CommentForm verseId={verseId} onSubmitted={load} />
=======
      <h3 className="text-lg font-semibold mb-2">{t('title')}</h3>
      <form onSubmit={submit} className="flex gap-2 mb-4">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('placeholder')}
          className="flex-1 border rounded p-2 text-sm"
        />
        <Button type="submit" size="sm">{t('post')}</Button>
      </form>
>>>>>>> origin/codex/set-up-next-intl-with-translations
      <div className="space-y-2">
        {comments.map((c) => (
          <div key={c.id} className="p-2 bg-muted rounded">
            <div className="flex items-center justify-between">
              <div
                className="text-sm flex-1"
                dangerouslySetInnerHTML={{ __html: c.content }}
              />
              <div className="flex items-center gap-1 ml-2">
                <button
                  aria-label="upvote"
                  className="text-xs"
                  onClick={() => vote(c.id, 1)}
                >
                  ▲
                </button>
                <span className="text-xs w-4 text-center">{new Intl.NumberFormat(locale).format(c.votes)}</span>
                <button
                  aria-label="downvote"
                  className="text-xs"
                  onClick={() => vote(c.id, -1)}
                >
                  ▼
                </button>
              </div>
            </div>
<<<<<<< HEAD
          )
        })}
=======
            <div className="text-xs text-muted-foreground">
              {new Intl.DateTimeFormat(locale, {dateStyle: 'short', timeStyle: 'short'}).format(new Date(c.createdAt))}
            </div>
          </div>
        ))}
>>>>>>> origin/codex/set-up-next-intl-with-translations
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground">{t('noComments')}</p>
        )}
      </div>
    </div>
  );
}
