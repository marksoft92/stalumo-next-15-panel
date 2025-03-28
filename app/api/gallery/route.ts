import { NextResponse } from "next/server";

// Przykład danych - w prawdziwej aplikacji te dane byłyby pobierane z bazy danych lub zewnętrznego API
const images = [
  { id: 1, url: "/assets/images/spawacz.jpg", alt: "Image 1" },
  { id: 2, url: "/assets/images/spawanie2.jpg", alt: "Image 2" },
  { id: 3, url: "/assets/images/spawacz2.jpg", alt: "Image 3" },
  { id: 4, url: "/assets/images/spawacz3.jpg", alt: "Image 1" },
  { id: 5, url: "/assets/images/spawacz4.jpg", alt: "Image 2" },
  { id: 6, url: "/assets/images/spawanie1.jpg", alt: "Image 3" },
];

export async function GET() {
  // Możesz tutaj dodać logikę do pobierania danych, np. z bazy danych
  return NextResponse.json(images);
}
