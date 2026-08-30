// Minimal local dev proxy: forwards Claude requests to Anthropic, keeping the API key server-side.
// The frontend never talks to Anthropic directly — see src/services/api.ts (callClaude -> /api/claude).
require('dotenv').config();
const express = require('express');
const { Agent } = require('undici');

const app = express();
app.use(express.json({ limit: '25mb' })); // discharge letter photos are base64-encoded in the body

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

// Node's default fetch dispatcher gives up waiting for response headers after ~30s, which a full
// discharge-letter parse can easily exceed (large max_tokens, no streaming). Give it more room.
const longTimeoutAgent = new Agent({ headersTimeout: 180_000, bodyTimeout: 180_000 });

app.post('/api/claude', async (req, res) => {
    if (!ANTHROPIC_API_KEY) {
        res.status(500).json({ error: 'ANTHROPIC_API_KEY is not set. Add it to a .env file (see .env.example).' });
        return;
    }

    try {
        const anthropicRes = await fetch(ANTHROPIC_URL, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-api-key': ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(req.body),
            dispatcher: longTimeoutAgent,
        });

        const data = await anthropicRes.json();
        res.status(anthropicRes.status).json(data);
    } catch (error) {
        console.error('Error calling Anthropic API:', error);
        res.status(502).json({ error: `Failed to reach the model: ${error.message}` });
    }
});

const PORT = process.env.SERVER_PORT || 3001;
app.listen(PORT, () => {
    console.log(`API proxy listening on http://localhost:${PORT}`);
});
