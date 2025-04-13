'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type ClientChat = {
    id: number;
    email: string;
    topic: string;
    content: string;
    createdAt: string;
};

export default function DashboardHome() {
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [latestUnread, setLatestUnread] = useState<ClientChat | null>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                const res = await fetch('/api/info');
                const data = await res.json();

                setUnreadCount(data.unreadCount);
                setLatestUnread(data.latestUnread);
            } catch (err) {
                console.error('Błąd pobierania danych dashboardu:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInfo();
    }, []);

    if (loading) {
        return (
            <div className="p-6 text-zinc-600 dark:text-zinc-300">⏳ Ładowanie danych...</div>
        );
    }

    return (
        <section className="p-6 space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow p-6">
                <h2 className="text-xl font-bold mb-2 text-zinc-800 dark:text-white">
                    📥 Nieodczytane wiadomości
                </h2>
                <div className="text-3xl font-bold text-indigo-600">{unreadCount}</div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow p-6">
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2">
                    📨 Najnowsza nieodczytana wiadomość
                </h3>

                {latestUnread ? (
                    <div className="space-y-2">
                        <div className="text-sm text-zinc-500">
                            {new Date(latestUnread.createdAt).toLocaleString()}
                        </div>
                        <div className="text-md font-medium text-zinc-800 dark:text-zinc-100">
                            {latestUnread.topic}
                        </div>
                        <div className="text-sm text-zinc-600 dark:text-zinc-300">
                            {latestUnread.content}
                        </div>
                        <Link
                            href={`/contact/${latestUnread.id}`}
                            className="inline-block text-sm mt-3 text-indigo-600 hover:underline"
                        >
                            Przejdź do konwersacji →
                        </Link>
                    </div>
                ) : (
                    <p className="text-sm italic text-zinc-500">Brak nieodczytanych wiadomości 🎉</p>
                )}
            </div>
        </section>
    );
}
