import { NextResponse } from 'next/server';

export async function GET() {
  const spec = {
    openapi: '3.0.3',
    info: {
      title: 'Kokonut AI API',
      version: '1.0.0',
      description:
        'API for chat, public mock data (restaurants, preferences, users), and dog profile. Base URL: http://localhost:3030',
    },
    servers: [{ url: 'http://localhost:3030' }],
    components: {
      schemas: {
        ChatRole: { type: 'string', enum: ['user', 'bot'] },
        ChatMessage: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            role: { $ref: '#/components/schemas/ChatRole' },
            body: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
          required: ['role', 'body'],
        },
        ChatPostRequest: {
          type: 'object',
          properties: { message: { type: 'string' } },
          required: ['message'],
        },
        ChatPostResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/ChatMessage' },
            bot: { $ref: '#/components/schemas/ChatMessage' },
          },
          required: ['user', 'bot'],
        },
        DogProfile: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            bio: { type: 'string' },
            facts: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        GeoJSONPoint: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['Point'] },
            coordinates: {
              type: 'array',
              items: { type: 'number' },
              minItems: 2,
              maxItems: 2,
              description: '[lng, lat]',
            },
          },
          required: ['type', 'coordinates'],
        },
        Restaurant: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            cuisine: { type: 'array', items: { type: 'string' } },
            rating: { type: 'number' },
            attributes: { type: 'array', items: { type: 'string' } },
            website: { type: 'string' },
            location: { $ref: '#/components/schemas/GeoJSONPoint' },
            distanceKm: { type: 'number', description: 'Present only when querying with lat/lng' },
          },
          required: ['id', 'name', 'cuisine', 'location'],
        },
        PreferenceKV: {
          type: 'object',
          properties: {
            key: { type: 'string' },
            value: {},
          },
          required: ['key'],
        },
        UserPreferences: {
          type: 'object',
          properties: {
            avoid: { type: 'array', items: { type: 'string' } },
            positiveExamples: { type: 'array', items: { type: 'string' } },
            negativeExamples: { type: 'array', items: { type: 'string' } },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            location: { $ref: '#/components/schemas/GeoJSONPoint' },
          },
          required: ['id', 'name', 'location'],
        },
        NotFound: {
          type: 'object',
          properties: { error: { type: 'string' } },
        },
      },
    },
    paths: {
      '/api/chat': {
        get: {
          summary: 'List chat messages',
          responses: {
            '200': {
              description: 'Array of chat messages',
              content: {
                'application/json': {
                  schema: { type: 'array', items: { $ref: '#/components/schemas/ChatMessage' } },
                },
              },
            },
          },
        },
        post: {
          summary: 'Send a message to the chatbot',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ChatPostRequest' } },
            },
          },
          responses: {
            '200': {
              description: 'User and bot messages',
              content: {
                'application/json': { schema: { $ref: '#/components/schemas/ChatPostResponse' } },
              },
            },
          },
        },
      },
      '/api/dog': {
        get: {
          summary: 'Get dog profile',
          responses: {
            '200': {
              description: 'Dog profile or null',
              content: {
                'application/json': {
                  schema: {
                    oneOf: [{ $ref: '#/components/schemas/DogProfile' }, { type: 'null' }],
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Create/Update dog profile',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    bio: { type: 'string' },
                    facts: { type: 'array', items: { type: 'string' } },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Saved profile',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/DogProfile' } } },
            },
          },
        },
      },
      '/api/public/restaurants': {
        get: {
          summary: 'List restaurants (optionally by proximity)',
          parameters: [
            { name: 'lat', in: 'query', schema: { type: 'number' } },
            { name: 'lng', in: 'query', schema: { type: 'number' } },
            {
              name: 'radiusKm',
              in: 'query',
              schema: { type: 'number', default: 5 },
              description: 'Search radius in kilometers',
            },
            { name: 'radius', in: 'query', schema: { type: 'number' }, description: 'Alias for radiusKm' },
            { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1 } },
          ],
          responses: {
            '200': {
              description: 'Restaurants',
              content: {
                'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Restaurant' } } },
              },
            },
          },
        },
      },
      '/api/public/preferences': {
        get: {
          summary: 'Get food preferences (default or by user)',
          parameters: [{ name: 'userId', in: 'query', schema: { type: 'string' } }],
          responses: {
            '200': {
              description: 'Preferences',
              content: {
                'application/json': {
                  schema: {
                    anyOf: [
                      { type: 'array', items: { $ref: '#/components/schemas/PreferenceKV' } },
                      { $ref: '#/components/schemas/UserPreferences' },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/api/public/users': {
        get: {
          summary: 'List users',
          responses: {
            '200': {
              description: 'Users',
              content: {
                'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/User' } } },
              },
            },
          },
        },
      },
      '/api/public/users/{id}': {
        get: {
          summary: 'Get user by id',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            '200': {
              description: 'User',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } },
            },
            '404': {
              description: 'Not found',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/NotFound' } } },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(spec);
}


