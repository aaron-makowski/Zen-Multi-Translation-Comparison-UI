import { describe, it, expect, beforeEach, vi } from 'vitest'
import { promises as fs } from 'fs'
import path from 'path'
import { POST as commentPost } from '../app/api/comments/route'
import { GET as notificationsGet, POST as notificationsMarkRead } from '../app/api/notifications/route'
import * as notificationService from '../lib/notifications'

const notificationsFile = path.join(process.cwd(), 'data', 'notifications.json')
const commentsFile = path.join(process.cwd(), 'data', 'comments.json')
const prefsFile = path.join(process.cwd(), 'data', 'preferences.json')

beforeEach(async () => {
  await fs.writeFile(notificationsFile, '[]')
  await fs.writeFile(commentsFile, '{}')
  await fs.writeFile(prefsFile, '{}')
})

describe('comment notification triggers', () => {
  it('emits reply notification for parent author', async () => {
    const initialComments = {
      verse1: [
        { id: 'parent', content: 'hi', createdAt: '', votes: 0, userId: 'parentUser' }
      ]
    }
    await fs.writeFile(commentsFile, JSON.stringify(initialComments))

    const req = new Request('http://localhost/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verseId: 'verse1',
        content: 'replying',
        userId: 'otherUser',
        parentId: 'parent'
      })
    })
    await commentPost(req)

    const notifs = JSON.parse(await fs.readFile(notificationsFile, 'utf8'))
    expect(notifs).toHaveLength(1)
    expect(notifs[0]).toMatchObject({ userId: 'parentUser', type: 'reply' })
  })

  it('skips reply notification for self-reply', async () => {
    const initialComments = {
      verse1: [
        { id: 'self', content: 'hi', createdAt: '', votes: 0, userId: 'selfUser' }
      ]
    }
    await fs.writeFile(commentsFile, JSON.stringify(initialComments))

    const req = new Request('http://localhost/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verseId: 'verse1',
        content: 'replying',
        userId: 'selfUser',
        parentId: 'self'
      })
    })
    await commentPost(req)

    const notifs = JSON.parse(await fs.readFile(notificationsFile, 'utf8'))
    expect(notifs).toHaveLength(0)
  })

  it('emits mention notifications for mentioned users excluding self', async () => {
    const req = new Request('http://localhost/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        verseId: 'verse1',
        content: 'hello @bob and @carol and @alice',
        userId: 'alice'
      })
    })
    await commentPost(req)

    const notifs = JSON.parse(await fs.readFile(notificationsFile, 'utf8'))
    const recipients = notifs.map((n: any) => n.userId).sort()
    expect(recipients).toEqual(['bob', 'carol'])
    expect(notifs.every((n: any) => n.type === 'mention')).toBe(true)
  })
})

describe('notifications API', () => {
  it('returns notifications and allows marking all as read', async () => {
    const seed = [
      { id: '1', userId: 'u1', type: 'reply', read: false, createdAt: '' },
      { id: '2', userId: 'u1', type: 'mention', read: false, createdAt: '' },
      { id: '3', userId: 'u2', type: 'reply', read: false, createdAt: '' }
    ]
    await fs.writeFile(notificationsFile, JSON.stringify(seed))

    const getReq = new Request('http://localhost/api/notifications?userId=u1')
    const res = await notificationsGet(getReq)
    const list = await res.json()
    expect(list).toHaveLength(2)
    expect(list.every((n: any) => n.userId === 'u1')).toBe(true)

    const postReq = new Request('http://localhost/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'u1' })
    })
    await notificationsMarkRead(postReq)

    const updated = JSON.parse(await fs.readFile(notificationsFile, 'utf8'))
    const userNotifs = updated.filter((n: any) => n.userId === 'u1')
    expect(userNotifs.every((n: any) => n.read)).toBe(true)
  })
})

describe('delivery preferences', () => {
  it('sends email and push when enabled', async () => {
    const prefs = {
      userX: {
        email: 'x@example.com',
        emailNotifications: true,
        pushEndpoint: 'https://push.example',
        pushNotifications: true,
      },
    }
    await fs.writeFile(prefsFile, JSON.stringify(prefs))

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    await notificationService.addNotification({ userId: 'userX', type: 'reply' })

    expect(logSpy).toHaveBeenCalledWith('Email to x@example.com', ['reply'])
    expect(logSpy).toHaveBeenCalledWith('Push to https://push.example', 'reply')

    logSpy.mockRestore()
  })
})

