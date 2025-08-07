import { pgTable, text, timestamp, integer, boolean, uniqueIndex } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// User table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isGuest: boolean("is_guest").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
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

// Follow table
export const follows = pgTable(
  "follows",
  {
    id: text("id").primaryKey(),
    followerId: text("follower_id")
      .notNull()
      .references(() => users.id),
    followingId: text("following_id")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      followerFollowingUnique: uniqueIndex("follower_following_unique").on(
        table.followerId,
        table.followingId
      ),
    }
  }
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
  sessions: many(sessions),
  followers: many(follows, { relationName: "following" }),
  following: many(follows, { relationName: "follower" }),
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

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    relationName: "follower",
    fields: [follows.followerId],
    references: [users.id],
  }),
  following: one(users, {
    relationName: "following",
    fields: [follows.followingId],
    references: [users.id],
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
