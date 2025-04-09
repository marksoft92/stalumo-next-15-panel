"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'next/navigation';
import Alert from "@mui/material/Alert";

export default function ContactForm() {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
  const params = useParams();
  const id = parseInt(params.id as string);
  const [reply, setReply] = useState("");
  const [chatData, setChatData] = useState({
    email: "",
    topic: "",
    content: "",
    read_me: false,
    reply: "",
    createdAt: "",
  });

  useEffect(() => {
    axios
      .get(`/api/contact/${id}`)
      .then((response) => {
        setChatData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching chat", error);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(`/api/contact/${id}`, {
        read_me: !chatData.read_me,
        reply: reply,
        email: chatData.email,
        subject:chatData.topic,
      });

      if (response.status === 200) {
        setSuccess(true);  // Ustaw sukces, jeśli status 200
        setError("");      // Wyczyść ewentualny błąd
      } else {
        setSuccess(false);
        setError("Coś poszło nie tak, spróbuj ponownie.");
      }
    } catch (error) {
      setSuccess(false);
      setError("Wystąpił błąd. Proszę spróbuj ponownie.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-6 w-full  m-10">
      <h2 className="text-2xl font-bold text-gray-800">Szczegóły maila</h2>

      <div className="space-y-2">
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Email:</p>
          <p className="font-medium text-black">{chatData.email}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Temat:</p>
          <p className="font-medium text-black">{chatData.topic}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Kontent:</p>
          <p className="font-medium whitespace-pre-line text-black">
            {chatData.content}
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Data wysłania:</p>
          <p className="font-medium text-black">
            {new Date(chatData.createdAt).toLocaleString()}
          </p>
        </div>
        {chatData.reply && (
          <div className="bg-blue-100 p-4 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-600 font-semibold">Odpowiedź:</p>
            <p className="text-blue-800">{chatData.reply}</p>
          </div>
        )}
      </div>
      {(!chatData?.read_me && !success) &&
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Odpowiedź:</span>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            className="mt-1 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black"
            rows={4}
            placeholder="Wpisz swoją odpowiedź tutaj..."
          />
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Wyślij
        </button>
      </form>}
      {success && (
          <Alert severity="success">Wiadomość wysłana poprawnie!</Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
    </div>
  );
}
