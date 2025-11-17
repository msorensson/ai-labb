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
                restaurantid: z.string()
            })
        },
        async (args) => {
            console.error('args', args);
            // Stöd både args.restaurantId och args.input.restaurantId beroende på klient
            const restaurantid = args?.restaurantid ?? args?.input?.restaurantid;
            const id = String(restaurantid || '').toLowerCase();

            console.error('id', id);

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

            console.error('detailsById', detailsById[id]);

            const payload = detailsById[id];
            if (!payload) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({ error: 'Restaurant not found', restaurantid })
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

    server.registerTool(
        'get_bookable_timeslots',
        {
            title: 'Get bookable timeslots',
            description:
                'Returnerar bokningsbara tidsslottar för en restaurang och dag. Output är en array av objekt, t.ex. {\"1700\":\"17:00\"}.',
            inputSchema: z.object({
                restaurantid: z.string(),
                date: z.string().regex(/^\d{8}$/, 'format YYYYMMDD'),
                mealtype: z.string()
            })
        },
        async (args) => {
            const restaurantid = args?.restaurantid ?? args?.input?.restaurantid;
            const date = args?.date ?? args?.input?.date;
            const mealtype = (args?.mealtype ?? args?.input?.mealtype ?? '').toLowerCase();
            const id = String(restaurantid || '').toLowerCase();

            // Mockade tider för bord27
            // Format: array av objekt: { "HHmm": "HH:mm" } (notera att JSON-nycklar alltid blir strängar)
            const mockByMeal = {
                lunch: [
                    { '1100': '11:00' },
                    { '1115': '11:15' },
                    { '1130': '11:30' },
                    { '1200': '12:00' },
                    { '1230': '12:30' }
                ],
                dinner: [
                    { '1700': '17:00' },
                    { '1715': '1715' },
                    { '1730': '17:30' },
                    { '1800': '18:00' },
                    { '1830': '18:30' }
                ]
            };

            let payload = [];
            if (id === 'bord27') {
                // För enkelhet: returnera samma slots oavsett datum, differentiera på mealtype
                payload = mockByMeal[mealtype] ?? [...mockByMeal.lunch, ...mockByMeal.dinner];
            } else {
                payload = []; // okänd restaurang → inga tider
            }

            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ restaurantid, date, mealtype, timeslots: payload })
                    }
                ]
            };
        }
    );

    server.registerTool(
        'insert_booking',
        {
            title: 'Insert booking',
            description:
                'Skapar en bokning (mock). Tar restaurantid, date (YYYYMMDD) och timeslot (t.ex. 1700). Returnerar en bekräftelse.',
            inputSchema: z.object({
                restaurantid: z.string(),
                date: z.string().regex(/^\d{8}$/, 'format YYYYMMDD'),
                timeslot: z.string()
            })
        },
        async (args) => {
            const restaurantid = args?.restaurantid ?? args?.input?.restaurantid;
            const date = args?.date ?? args?.input?.date;
            const timeslot = args?.timeslot ?? args?.input?.timeslot;

            const bookingId = `bk_${Math.random().toString(36).slice(2, 10)}`;
            const payload = {
                bookingId,
                restaurantid,
                date,
                timeslot,
                status: 'confirmed'
            };

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
