<<<<<<< HEAD
import { pgTable, text, timestamp, integer, boolean, uniqueIndex, primaryKey } from "drizzle-orm/pg-core"
=======
import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core"
>>>>>>> origin/codex/add-user-profile-page-with-follow-feature
import { relations } from "drizzle-orm"

// User table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  isGuest: boolean("is_guest").default(false).notNull(),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

// Book table
export const books = pgTable("books", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  author: text("author"),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

// Verse table
export const verses = pgTable("verses", {
  id: text("id").primaryKey(),
  number: integer("number").notNull(),
  bookId: text("book_id")
    .notNull()
    .references(() => books.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

// Translation table
export const translations = pgTable("translations", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  translator: text("translator").notNull(),
  language: text("language").default("English").notNull(),
  verseId: text("verse_id")
    .notNull()
    .references(() => verses.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

// WordMapping table
export const wordMappings = pgTable("word_mappings", {
  id: text("id").primaryKey(),
  originalWord: text("original_word").notNull(),
  translatedWord: text("translated_word").notNull(),
  position: integer("position").notNull(),
  translationId: text("translation_id")
    .notNull()
    .references(() => translations.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

// Favorite table
export const favorites = pgTable(
  "favorites",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    bookId: text("book_id")
      .notNull()
      .references(() => books.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => {
    return {
      userBookUnique: uniqueIndex("user_book_unique").on(table.userId, table.bookId),
    }
  },
)

// User follow join table
export const userFollows = pgTable(
  "user_follows",
  {
    followerId: text("follower_id")
      .notNull()
      .references(() => users.id),
    followingId: text("following_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.followerId, table.followingId] }),
  }),
)

// Note table
export const notes = pgTable("notes", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  verseId: text("verse_id")
    .notNull()
    .references(() => verses.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

// Comment table
export const comments = pgTable("comments", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  verseId: text("verse_id")
    .notNull()
    .references(() => verses.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> origin/codex/create-tags-table-and-many-to-many-relation
// Tag table
export const tags = pgTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

// VerseTags join table
<<<<<<< HEAD
export const versesToTags = pgTable(
  "verses_tags",
  {
=======
export const verseTags = pgTable(
  "verse_tags",
  {
    id: text("id").primaryKey(),
>>>>>>> origin/codex/create-tags-table-and-many-to-many-relation
    verseId: text("verse_id")
      .notNull()
      .references(() => verses.id),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
<<<<<<< HEAD
  },
  (table) => ({
    pk: primaryKey({ columns: [table.verseId, table.tagId] }),
  })
)
=======
// Flags table for comment moderation
export const flags = pgTable("flags", {
  id: text("id").primaryKey(),
  commentId: text("comment_id")
    .notNull()
    .references(() => comments.id),
  userId: text("user_id").references(() => users.id),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Audit log table for moderation actions
export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(),
  targetId: text("target_id").notNull(),
  userId: text("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
>>>>>>> origin/codex/protect-admin-routes-with-middleware

=======
// VerseView table to track verse views and translation selections
export const verseViews = pgTable("verse_views", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  verseId: text("verse_id")
    .notNull()
    .references(() => verses.id),
  translationId: text("translation_id").references(() => translations.id),
  viewedAt: timestamp("viewed_at").defaultNow().notNull(),
})

>>>>>>> origin/codex/track-verse-views-and-translations
=======
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => {
    return {
      verseTagUnique: uniqueIndex("verse_tag_unique").on(table.verseId, table.tagId),
    }
  },
)

>>>>>>> origin/codex/create-tags-table-and-many-to-many-relation
// Session table
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const booksRelations = relations(books, ({ many }) => ({
  verses: many(verses),
  favorites: many(favorites),
}))

export const versesRelations = relations(verses, ({ one, many }) => ({
  book: one(books, {
    fields: [verses.bookId],
    references: [books.id],
  }),
  translations: many(translations),
  notes: many(notes),
  comments: many(comments),
<<<<<<< HEAD
<<<<<<< HEAD
  verseTags: many(versesToTags),
=======
  views: many(verseViews),
>>>>>>> origin/codex/track-verse-views-and-translations
=======
  verseTags: many(verseTags),
>>>>>>> origin/codex/create-tags-table-and-many-to-many-relation
}))

export const translationsRelations = relations(translations, ({ one, many }) => ({
  verse: one(verses, {
    fields: [translations.verseId],
    references: [verses.id],
  }),
  wordMappings: many(wordMappings),
  views: many(verseViews),
}))

export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
  notes: many(notes),
  comments: many(comments),
  sessions: many(sessions),
<<<<<<< HEAD
<<<<<<< HEAD
  flags: many(flags),
  auditLogs: many(auditLogs),
=======
  views: many(verseViews),
>>>>>>> origin/codex/track-verse-views-and-translations
=======
  followers: many(userFollows, { relationName: "following" }),
  following: many(userFollows, { relationName: "follower" }),
>>>>>>> origin/codex/add-user-profile-page-with-follow-feature
}))

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  book: one(books, {
    fields: [favorites.bookId],
    references: [books.id],
  }),
}))

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
  verse: one(verses, {
    fields: [notes.verseId],
    references: [verses.id],
  }),
}))

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  verse: one(verses, {
    fields: [comments.verseId],
    references: [verses.id],
  }),
  flags: many(flags),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
  verseTags: many(versesToTags),
}))

export const versesToTagsRelations = relations(versesToTags, ({ one }) => ({
  verse: one(verses, {
    fields: [versesToTags.verseId],
    references: [verses.id],
  }),
  tag: one(tags, {
    fields: [versesToTags.tagId],
    references: [tags.id],
  }),
}))

export const verseViewsRelations = relations(verseViews, ({ one }) => ({
  user: one(users, {
    fields: [verseViews.userId],
    references: [users.id],
  }),
  verse: one(verses, {
    fields: [verseViews.verseId],
    references: [verses.id],
  }),
  translation: one(translations, {
    fields: [verseViews.translationId],
    references: [translations.id],
  }),
}))

export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  follower: one(users, {
    fields: [userFollows.followerId],
    references: [users.id],
    relationName: "follower",
  }),
  following: one(users, {
    fields: [userFollows.followingId],
    references: [users.id],
    relationName: "following",
  }),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const wordMappingsRelations = relations(wordMappings, ({ one }) => ({
  translation: one(translations, {
    fields: [wordMappings.translationId],
    references: [translations.id],
  }),
}))

<<<<<<< HEAD
export const flagsRelations = relations(flags, ({ one }) => ({
  comment: one(comments, {
    fields: [flags.commentId],
    references: [comments.id],
  }),
  user: one(users, {
    fields: [flags.userId],
    references: [users.id],
  }),
}))

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
=======
export const tagsRelations = relations(tags, ({ many }) => ({
  verseTags: many(verseTags),
}))

export const verseTagsRelations = relations(verseTags, ({ one }) => ({
  verse: one(verses, {
    fields: [verseTags.verseId],
    references: [verses.id],
  }),
  tag: one(tags, {
    fields: [verseTags.tagId],
    references: [tags.id],
>>>>>>> origin/codex/create-tags-table-and-many-to-many-relation
  }),
}))
