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

    server.registerTool(
        'get_restaurant_details',
        {
            title: 'Get restaurant details',
            description: 'Returnerar strukturerad data om en restaurang utifrån restaurantId',
            inputSchema: z.object({
                restaurantId: z.string()
            })
        },
        async (args) => {
            // Stöd både args.restaurantId och args.input.restaurantId beroende på klient
            const restaurantId = args?.restaurantId ?? args?.input?.restaurantId;
            const id = String(restaurantId || '').toLowerCase();

            const detailsById = {
                bord27: {
                    overview: 'Bord 27 är en modern restaurang inspirerad av södra Europa...',
                    facts: [
                        'Vi har vedugn.',
                        'Restaurangen ligger på Östra Larmgatan 19.',
                        'Vi erbjuder brunch på helgerna.',
                        'Vi har 70 sittplatser.'
                    ],
                    hours: {
                        weekday: '11–23',
                        weekend: '10–01'
                    },
                    menu: {
                        highlights: ['Pizza Napoletana', 'Pasta med tryffel', 'Vitello tonnato']
                    },
                    faq: [{ q: 'Har ni veganska alternativ?', a: 'Ja, vi erbjuder flera.' }]
                }
            };

            const payload = detailsById[id];
            if (!payload) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({ error: 'Restaurant not found', restaurantId })
                        }
                    ]
                };
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(payload)
                    }
                ]
            };
        }
    );

    return server;
}
