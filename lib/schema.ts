import { pgTable, text, timestamp, integer, boolean, uniqueIndex } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// User table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isGuest: boolean("is_guest").default(false).notNull(),
  commentKarma: integer("comment_karma").default(0).notNull(),
  highlightKarma: integer("highlight_karma").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  karma: integer("karma").default(0).notNull(),
})

// Book table
export const books = pgTable("books", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  author: text("author"),
  coverImage: text("cover_image"),
  pdfPath: text("pdf_path"),
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

// Highlight table
export const highlights = pgTable("highlights", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  verseId: text("verse_id")
    .notNull()
    .references(() => verses.id),
  start: integer("start").notNull(),
  end: integer("end").notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
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

// Highlight table
export const highlights = pgTable("highlights", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  verseId: text("verse_id")
    .notNull()
    .references(() => verses.id),
  start: integer("start").notNull(),
  end: integer("end").notNull(),
  note: text("note"),
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
})

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
  highlights: many(highlights),
}))

export const translationsRelations = relations(translations, ({ one, many }) => ({
  verse: one(verses, {
    fields: [translations.verseId],
    references: [verses.id],
  }),
  wordMappings: many(wordMappings),
}))

export const usersRelations = relations(users, ({ many }) => ({
  favorites: many(favorites),
  notes: many(notes),
  comments: many(comments),
  highlights: many(highlights),
  sessions: many(sessions),
  highlights: many(highlights),
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

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  verse: one(verses, {
    fields: [comments.verseId],
    references: [verses.id],
  }),
}))

export const highlightsRelations = relations(highlights, ({ one }) => ({
  user: one(users, {
    fields: [highlights.userId],
    references: [users.id],
  }),
  verse: one(verses, {
    fields: [highlights.verseId],
    references: [verses.id],
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
