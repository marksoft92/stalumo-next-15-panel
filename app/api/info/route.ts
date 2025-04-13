// app/api/info/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function GET() {
    try {
        // Liczba nieodczytanych wiadomości
        const unreadCount = await prisma.clientChat.count({
            where: { read_me: false },
        });

        // Najnowsza nieodczytana wiadomość
        const latestUnread = await prisma.clientChat.findFirst({
            where: { read_me: false },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                topic: true,
                content: true,
                createdAt: true,
            },
        });

        return NextResponse.json({
            unreadCount,
            latestUnread,
        });
    } catch (error) {
        console.error('[INFO_API_ERROR]', error);
        return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 });
    }
}
