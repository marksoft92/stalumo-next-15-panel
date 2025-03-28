import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const verifyRecaptcha = async (token: string) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY!;
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    { method: "POST" }
  );
  return response.json();
};

export async function POST(req: NextRequest) {
  try {
    const { email, topic, content, recaptchaToken } = await req.json();

    if (!email || !topic || !content || !recaptchaToken) {
      return new NextResponse(
        JSON.stringify({ error: "All fields are required, including captcha" }),
        { status: 400 }
      );
    }

    // Weryfikacja reCAPTCHA
    const captchaVerification = await verifyRecaptcha(recaptchaToken);
    if (!captchaVerification.success || captchaVerification.score < 0.5) {
      return new NextResponse(
        JSON.stringify({ error: "Captcha verification failed" }),
        { status: 400 }
      );
    }

    // Zapis do bazy danych
    const newChat = await prisma.clientChat.create({
      data: {
        email,
        topic,
        content,
        read_me: false,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Message sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving chat:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to send message" }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
