import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function createMcpServer() {
    const server = new McpServer({
        name: 'kokonut-mcp',
        version: '1.0.0'
    });

    server.registerTool(
        'get_user',
        {
            title: 'Get user',
            description: 'Returnerar ett user-objekt med firstname, lastname och birthday',
            inputSchema: z.object({})
        },
        async () => {
            const user = {
                firstname: 'Martin',
                lastname: 'Sörensson',
                birthday: '1990-01-01'
            };

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ user })
                    }
                ]
            };
        }
    );

    server.registerTool(
        'list_restaurants',
        {
            title: 'List restaurants',
            description: 'Returnerar en lista med restauranger med name, cuisine och attributes',
            inputSchema: z.object({})
        },
        async () => {
            const restaurants = [
                {
                    name: 'Bord 27',
                    cuisine: ['europeisk', 'svensk'],
                    attributes: ['casual', 'vinfokuserad']
                },
                {
                    name: 'Natur',
                    cuisine: ['europeisk', 'grönsaksfokuserad'],
                    attributes: ['naturvin', 'mysig']
                },
                {
                    name: 'Elio',
                    cuisine: ['italiensk', 'södra Europa'],
                    attributes: ['brunch', 'lunch', 'middag']
                }
            ];

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ restaurants })
                    }
                ]
            };
        }
    );

    return server;
}
