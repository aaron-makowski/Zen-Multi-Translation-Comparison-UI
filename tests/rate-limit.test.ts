import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NextRequest } from 'next/server';

const TEST_URL = 'http://localhost/api/test';
const TEST_IP = '1.2.3.4';

function makeRequest() {
  return new NextRequest(TEST_URL, {
    headers: { 'x-forwarded-for': TEST_IP },
  });
}

describe('rate limiting middleware', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('allows requests under the limit to proceed', async () => {
    const { middleware } = await import('../app/api/_middleware');
    const res = middleware(makeRequest());
    expect(res.status).toBe(200);
  });

  it('allows up to 60 requests per minute from the same IP', async () => {
    const { middleware } = await import('../app/api/_middleware');
    let res;
    for (let i = 0; i < 60; i++) {
      res = middleware(makeRequest());
    }
    expect(res!.status).toBe(200);
  });

  it('returns 429 when the quota is exceeded', async () => {
    const { middleware } = await import('../app/api/_middleware');
    for (let i = 0; i < 60; i++) {
      middleware(makeRequest());
    }
    const res = middleware(makeRequest());
    expect(res.status).toBe(429);
  });
});
