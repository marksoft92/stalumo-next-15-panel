"use client";

import Container from "@/components/ui/container";
import React, { useState } from "react";
import Alert from "@mui/material/Alert";

// Typy dla danych formularza
interface BlogTranslation {
  title: string;
  content: string;
  lang: string;
  slug: string;
}

interface FormData {
  imgUrl: string;
  alt: string;
  translations: {
    pl: BlogTranslation;
    en: BlogTranslation;
    de: BlogTranslation;
  };
}

const BlogPostForm = () => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    imgUrl: "",
    alt: "",
    translations: {
      pl: { title: "", content: "", lang: "pl", slug: "" },
      en: { title: "", content: "", lang: "en", slug: "" },
      de: { title: "", content: "", lang: "de", slug: "" },
    },
  });

  // Funkcja do generowania sluga na podstawie tytułu
  const generateSlug = (title: string): string => {
    return title
      .normalize("NFD") // Rozbicie znaków na formy podstawowe
      .replace(/[\u0300-\u036f]/g, "") // Usuwanie znaków diakrytycznych (ogonków)
      .toLowerCase() // Zamiana na małe litery
      .replace(/\s+/g, "-") // Zamiana spacji na myślniki
      .replace(/[^\w-]+/g, "") // Usuwanie wszystkich znaków niealfanumerycznych oprócz myślników
      .replace(/^-+/, "") // Usuwanie myślników na początku
      .replace(/-+$/, ""); // Usuwanie myślników na końcu
  };

  // Funkcja do obsługi zmian w formularzu
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

  // Funkcja do wysyłania danych do API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Przygotowanie danych w formacie wymaganym przez backend
    const postData = {
      imgUrl: formData.imgUrl,
      alt: formData.alt,
      translations: Object.keys(formData.translations).map((lang) => {
        const { title, content, slug } =
          formData.translations[lang as keyof typeof formData.translations];
        return {
          slug,
          title,
          content,
          lang,
        };
      }),
    };

    try {
      const response = await fetch("/api/blog/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);  // Ustaw sukces, jeśli status 200
        setError("");      // Wyczyść ewentualny błąd
        setFormData({
          imgUrl: "",
          alt: "",
          translations: {
            pl: { title: "", content: "", lang: "pl", slug: "" },
            en: { title: "", content: "", lang: "en", slug: "" },
            de: { title: "", content: "", lang: "de", slug: "" },
          },
        });
      } else {
        setSuccess(false);
        setError("Coś poszło nie tak, spróbuj ponownie.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating post");
    }
  };

  return (
    <Container>
      <div className="container mx-auto p-6 max-w-[50%]">
        <h1 className="text-2xl font-bold mb-6">Nowy wpis na Bloga</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              onChange={(e) =>
                setFormData({ ...formData, alt: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md text-[#000]"
              required
            />
          </div>

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

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Stwórz nowy wpis na bloga
            </button>
          </div>
        </form>
        {success && (
            <Alert className="my-10" severity="success">Wpis na bloga został dodany poprawnie!</Alert>
        )}
        {error && <Alert className="my-10" severity="error">{error}</Alert>}
      </div>

    </Container>
  );
};

export default BlogPostForm;
