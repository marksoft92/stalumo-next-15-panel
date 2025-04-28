import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import {mailContent} from "../../../../lib/emailContent"
import Alert from '@mui/material/Alert';
const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: any }) {
  const id = parseInt(params.id); // ID pobrany z URL

  try {
    // Zapytanie do bazy danych, aby znaleźć post na podstawie id
    const chat = await prisma.clientChat.findFirst({
      where: {
        id, // Szukamy po id chatu
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }
    // Zwrócenie danych
    return NextResponse.json(chat, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error fetching chat" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: any }) {
  const id = parseInt(params.id); // ID pobrany z URL

  try {
    // Pobieramy dane z body
    const { read_me, reply,email,subject,content } = await req.json();

    if (read_me) {
      // Aktualizujemy read_me na true
      await prisma.clientChat.update({
        where: { id },
        data: { read_me: true },
      });
    }

    if (reply) {
      const mailBody = mailContent(email,subject, reply,content);


      // Konfiguracja SMTP
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === "true", // or 'STARTTLS'
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      } as SMTPTransport.Options);

      // Wysłanie maila
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: subject,
        text: reply,
        html: mailBody,
      });
      await prisma.clientChat.update({
        where: { id },
        data: { reply: reply, read_me: true  },
      });
    }

    return NextResponse.json(
      { message: "Chat updated successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error updating chat" }, { status: 500 });
  }
}
