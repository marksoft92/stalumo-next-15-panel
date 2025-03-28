"use client";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/container";
import { useTranslations } from "next-intl";
export default function GalleryPage() {
  const imagesSlider: string[] = [
    "/assets/images/spawanie1.jpg",
    "/assets/images/spawanie2.jpg",
    "/assets/images/spawanie3.jpg",
    "/assets/images/spawanie4.jpg",
    "/assets/images/spawanie5.jpg",
  ];

  const t = useTranslations("Gallery");

  const [images, setImages] = useState<string[]>([]); // Przechowujemy tylko listę URLi
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/gallery");
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        setImages(data.map((image: { url: string }) => image.url)); // Załaduj obrazy
      } catch (error) {
        setError("Error fetching images");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  //   if (loading) return <div>Loading...</div>;
  //   if (error) return <div>{error}</div>;

  return (
    <Container>
      <div>
        <div className="flex flex-col items-center relative min-h-[500px] justify-center">
          <h2 className="text-[6rem] font-semibold uppercase">{t("title")}</h2>
          <h3>
            <Link
              className="text-[1.6rem] font-semibold uppercase text-[#EB4036]"
              href="/"
            >
              {t("homeTitle")}
            </Link>
            <span className="text-[1.6rem] font-semibold uppercase ">
              /{t("title")}
            </span>
          </h3>
        </div>
        <section className="grid grid-cols-3 gap-5 my-10 max-lg:flex max-lg:flex-col max-lg:items-center"></section>
      </div>
    </Container>
  );
}
