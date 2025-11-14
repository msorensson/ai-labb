"use client";

import { useEffect, useRef, useState } from 'react';
import { Textarea, Button, Group, Stack, Paper, Text } from '@mantine/core';

type ChatRole = 'user' | 'bot';
type ChatMessage = { id?: string; role: ChatRole; body: string; createdAt?: string };

export default function HomePage() {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  function formatTimestamp(iso?: string) {
    if (!iso) return '';
    const d = new Date(iso);
    return new Intl.DateTimeFormat('sv-SE', { dateStyle: 'short', timeStyle: 'short' }).format(d);
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/chat');
        if (res.ok) {
          const data: ChatMessage[] = await res.json();
          setMessages(data);
        }
      } catch {}
    })();
  }, []);

  // Scroll to bottom whenever messages change (including initial load)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  async function sendMessage() {
    const text = value.trim();
    if (!text || loading) return;
    setLoading(true);

    // Optimistic update: add user message locally
    const optimisticUser: ChatMessage = { role: 'user', body: text, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, optimisticUser]);
    setValue('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      if (res.ok) {
        const data = await res.json();
        const bot: ChatMessage = data.bot;
        setMessages((prev) => [...prev, bot]);
      }
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await sendMessage();
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', background: '#ffffff' }}>
      <div style={{ width: 640, maxWidth: '90vw', display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Stack gap="sm" style={{ flex: 1, overflowY: 'auto', padding: 8, background: '#f8f9fa', borderRadius: 12, border: '1px solid #e9ecef' }}>
          {messages.map((m, idx) => (
            <div key={m.id ?? idx} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <Paper
                p="sm"
                radius="md"
                style={{ maxWidth: '85%' }}
                bg={m.role === 'user' ? '#e7f5ff' : '#f1f3f5'}
              >
                <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{m.body}</Text>
                <Text size="xs" c="dimmed" ta={m.role === 'user' ? 'right' : 'left'} mt={4}>
                  {formatTimestamp(m.createdAt)}
                </Text>
              </Paper>
            </div>
          ))}
          <div ref={endRef} />
        </Stack>

        <div style={{ position: 'sticky', bottom: 0, background: '#ffffff', padding: '8px 0', borderTop: '1px solid #e9ecef' }}>
          <form onSubmit={onSubmit}>
            <Group align="flex-start" gap="sm">
              <Textarea
                placeholder="Skriv här..."
                autosize
                minRows={1}
                maxRows={10}
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (value.trim() && !loading) {
                      void sendMessage();
                    }
                  }
                }}
                style={{ flex: 1 }}
              />
              <Button type="submit" loading={loading} disabled={!value.trim()}>Skicka</Button>
            </Group>
          </form>
        </div>
      </div>
    </main>
  );
}


