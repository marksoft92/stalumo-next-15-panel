"use client";
import Container from "@/components/ui/container";
import { useState, useEffect } from "react";
import axios from "axios";

// Funkcja do pobierania danych artykułów i aktualizacji za pomocą API

interface Translation {
  blogId: number;
  lang: string;
  title: string;
  content: string;
  slug: string;
}

interface BlogPost {
  id: number;
  imgUrl: string;
  alt: string;
  translations: {
    en: Translation;
    pl: Translation;
    de: Translation;
  };
}

const ArticlePageContainer = ({ params }: { params: any }) => {
  const [formData, setFormData] = useState({
    imgUrl: "",
    alt: "",
    translations: {
      pl: { blogId: 0, title: "", content: "", lang: "pl", slug: "" },
      en: { blogId: 0, title: "", content: "", lang: "en", slug: "" },
      de: { blogId: 0, title: "", content: "", lang: "de", slug: "" },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/blog/${params?.slug}`);
        const data: BlogPost = response.data;
        console.log("API Response:", data);

        setFormData((prevFormData) => ({
          imgUrl: data.imgUrl,
          alt: data.alt,
          translations: {
            en: data.translations.en || {
              blogId: parseInt(params.slug),
              title: "",
              content: "",
              lang: "en",
              slug: "",
            },
            pl: data.translations.pl || {
              blogId: parseInt(params.slug),
              title: "",
              content: "",
              lang: "pl",
              slug: "",
            },
            de: data.translations.de || {
              blogId: parseInt(params.slug),
              title: "",
              content: "",
              lang: "de",
              slug: "",
            },
          },
        }));
      } catch (error) {
        console.error("Error fetching article data", error);
      }
    };

    fetchData();
  }, [params]);
  console.log("x", formData);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postData = {
        id: parseInt(params.slug),
        imgUrl: formData.imgUrl,
        alt: formData.alt,
        translations: [
          {
            blogId: parseInt(params.slug),
            title: formData.translations.en.title,
            content: formData.translations.en.content,
            lang: "en",
            slug: formData.translations.en.slug,
          },
          {
            blogId: parseInt(params.slug),
            title: formData.translations.pl.title,
            content: formData.translations.pl.content,
            lang: "pl",
            slug: formData.translations.pl.slug,
          },
          {
            blogId: parseInt(params.slug),
            title: formData.translations.de.title,
            content: formData.translations.de.content,
            lang: "de",
            slug: formData.translations.de.slug,
          },
        ],
      };

      console.log("Sending data:", postData); // Dodajemy log do debugowania
      const response = await axios.patch(`/api/blog/${params.slug}`, postData);
      console.log("Article updated successfully", response.data);
    } catch (error) {
      console.error("Error updating article", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    lang: "pl" | "en" | "de",
    field: "title" | "content"
  ) => {
    const newValue = e.target.value;
    setFormData((prev) => {
      const updatedTranslations = { ...prev.translations };
      updatedTranslations[lang][field] = newValue;

      if (field === "title") {
        // Generowanie slug dla każdego języka na podstawie tytułu
        updatedTranslations[lang].slug = generateSlug(newValue);
      }

      return { ...prev, translations: updatedTranslations };
    });
  };

  const generateSlug = (title: string): string => {
    return title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };
  console.log(formData.translations, formData.translations["pl"].title);
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        {/* Dynamic Title and Content for PL, EN, DE */}
        {(["pl", "en", "de"] as const).map((lang) => (
          <div key={lang}>
            <div>
              <label
                htmlFor={`title${lang.toUpperCase()}`}
                className="block text-lg font-medium"
              >
                Tytuł ({lang.toUpperCase()}):
              </label>
              <input
                type="text"
                id={`title${lang.toUpperCase()}`}
                value={formData.translations[lang].title}
                onChange={(e) => handleChange(e, lang, "title")}
                className="w-full p-2 border border-gray-300 rounded-md text-[#000]"
                required
              />
            </div>
            <div>
              <label
                htmlFor={`content${lang.toUpperCase()}`}
                className="block text-lg font-medium"
              >
                Treść wpisu ({lang.toUpperCase()}):
              </label>
              <textarea
                id={`content${lang.toUpperCase()}`}
                value={formData.translations[lang].content}
                onChange={(e) => handleChange(e, lang, "content")}
                className="w-full p-2 border border-gray-300 rounded-md text-[#000]"
                required
              />
            </div>
          </div>
        ))}

        {/* Image URL and Alt */}
        <div>
          <label htmlFor="imgUrl" className="block text-lg font-medium">
            Sciezka do zdjęcia:
          </label>
          <input
            type="url"
            id="imgUrl"
            value={formData.imgUrl}
            onChange={(e) =>
              setFormData({ ...formData, imgUrl: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md text-[#000]"
            required
          />
        </div>

        <div>
          <label htmlFor="alt" className="block text-lg font-medium">
            Alt zdjęcia:
          </label>
          <input
            type="text"
            id="alt"
            value={formData.alt}
            onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md text-[#000]"
            required
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Zaktualizuj wpis na bloga
          </button>
        </div>
      </form>
    </Container>
  );
};

export default ArticlePageContainer;
