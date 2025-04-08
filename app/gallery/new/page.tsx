"use client";
import { useState } from "react";

export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || alt.trim() === "")
      return alert("Sprawdź czy wybrałeś zjęcie i dodałeś alt!");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", alt);

    const res = await fetch("/api/gallery", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Zdjęcie przesłane!");
      setFile(null);
      setAlt("");
    } else {
      alert("Błąd!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 w-full">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full ">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Dodaj zdjęcie
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wybierz plik
            </label>
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .webp"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opis (alt)
            </label>
            <input
              type="text"
              placeholder="np. Zdjęcie produktu - warto dodać lokalizaje pełny przykład: Barierka na wymiar, Niemcy - Berlin"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="w-full text-black px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors max-w-[10rem]"
          >
            Wyślij
          </button>
        </form>
      </div>
    </div>
  );
}
