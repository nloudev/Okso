require('dotenv').config();
const fs = require('fs');
const { Agent } = require('undici');

const agent = new Agent({ headersTimeout: 180_000, bodyTimeout: 180_000 });

const document = fs.readFileSync('./debug-sample.txt', 'utf8');

const body = {
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    system: 'You convert hospital discharge letters into structured JSON for patients. Return ONLY valid JSON.',
    messages: [
        { role: 'user', content: [{ type: 'text', text: `Parse this discharge letter into blocks:\n\n${document}` }] },
    ],
};

(async () => {
    const start = Date.now();
    try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(body),
            dispatcher: agent,
        });
        console.log('Headers received after (ms):', Date.now() - start);
        const data = await res.json();
        console.log('Full response received after (ms):', Date.now() - start);
        console.log('STATUS', res.status, 'stop_reason:', data.stop_reason, 'usage:', JSON.stringify(data.usage));
    } catch (error) {
        console.log('Failed after (ms):', Date.now() - start);
        console.error('CAUGHT ERROR:', error);
    }
})();
