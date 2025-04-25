import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  try {
    const offset = (page - 1) * pageSize;

    // Fetch data from the database using Prisma
    const chats = await prisma.clientChat.findMany({
      skip: offset,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
    });
    const total = await prisma.clientChat.count();
    // If no chats found
    if (chats.length === 0) {

      return new NextResponse(JSON.stringify({ chats,total}), { status: 200 });
    }


    return new NextResponse(JSON.stringify({ chats,total }), { status: 200 });
  } catch (error) {
    console.error("Error fetching chats:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch chats" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = parseInt(searchParams.get("id") || "0", 10);

  try {
    // Delete chat from the database using Prisma
    const deletedChat = await prisma.clientChat.delete({
      where: { id },
    });

    // If no chat found
    if (!deletedChat) {
      return new NextResponse(JSON.stringify({ error: "Chat not found" }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify({ message: "Chat deleted" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete chat" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
