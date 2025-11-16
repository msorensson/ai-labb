import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from './mcp-core.js';

const app = express();
app.use(express.json());

const server = createMcpServer();
const transport = new StreamableHTTPServerTransport({
    enableJsonResponse: true
});

await server.connect(transport);

app.post('/mcp', async (req, res) => {
    try {
        await transport.handleRequest(req, res, req.body);
    } catch (error) {
        console.error('Error handling MCP request:', error);
        if (!res.headersSent) {
            res.status(500).json({
                jsonrpc: '2.0',
                error: {
                    code: -32603,
                    message: 'Internal server error'
                },
                id: null
            });
        }
    }
});

const port = process.env.PORT || 3_000;

app.listen(port, () => {
    console.error(`MCP HTTP-server lyssnar på port ${port}`);
});
