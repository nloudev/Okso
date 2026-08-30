import { callClaude, getTranslations, sendDischargeSummary } from './api';

const mockFetchOk = (body: unknown) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => body,
  }) as unknown as typeof fetch;
};

const mockFetchError = (status: number) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => ({}),
  }) as unknown as typeof fetch;
};

describe('callClaude', () => {
  afterEach(() => jest.restoreAllMocks());

  it('posts the messages payload to /api/claude and returns the concatenated text', async () => {
    mockFetchOk({ content: [{ type: 'text', text: 'Hola' }] });

    const result = await callClaude([{ type: 'text', text: 'Hello' }], 'system prompt');

    expect(result).toBe('Hola');
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];
    expect(url).toBe('/api/claude');
    const body = JSON.parse(options.body);
    expect(body.system).toBe('system prompt');
    expect(body.messages).toEqual([{ role: 'user', content: [{ type: 'text', text: 'Hello' }] }]);
  });

  it('throws when the response is not ok', async () => {
    mockFetchError(500);
    await expect(callClaude([{ type: 'text', text: 'Hello' }])).rejects.toThrow('Request failed (500)');
  });
});

describe('getTranslations', () => {
  afterEach(() => jest.restoreAllMocks());

  it('returns the translated text', async () => {
    mockFetchOk({ content: [{ type: 'text', text: 'Hola' }] });
    await expect(getTranslations('Hello', 'es')).resolves.toEqual({ translatedText: 'Hola' });
  });

  it('falls back to the original text when the model returns nothing', async () => {
    mockFetchOk({ content: [] });
    await expect(getTranslations('Hello', 'es')).resolves.toEqual({ translatedText: 'Hello' });
  });

  it('rethrows on failure', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFetchError(500);
    await expect(getTranslations('Hello', 'es')).rejects.toThrow();
  });
});

describe('sendDischargeSummary', () => {
  afterEach(() => jest.restoreAllMocks());

  it('returns the model output for the given content', async () => {
    mockFetchOk({ content: [{ type: 'text', text: '{"blocks":[]}' }] });
    await expect(sendDischargeSummary([{ type: 'text', text: 'letter text' }])).resolves.toBe('{"blocks":[]}');
  });

  it('rethrows on failure', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFetchError(500);
    await expect(sendDischargeSummary([{ type: 'text', text: 'letter text' }])).rejects.toThrow();
  });
});
