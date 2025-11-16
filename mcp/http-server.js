import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMcpServer } from './mcp-core.js';

async function main() {
    console.error('MCP stdio-server startar...');

    const server = createMcpServer();
    const transport = new StdioServerTransport();

    await server.connect(transport);

    console.error('MCP stdio-server har avslutats.');
}

main().catch((err) => {
    console.error('FATALT FEL I STDIO-SERVERN', err);
    process.exit(1);
});
