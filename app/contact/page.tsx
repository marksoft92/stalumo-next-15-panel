"use client";

import Container from "@/components/ui/container";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();
  const t = useTranslations("Contact");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      setErrorMessage("Error loading reCAPTCHA.");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const recaptchaToken = await executeRecaptcha("contact_form");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, topic, content, recaptchaToken }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage(result.message || t("success"));
      } else {
        setErrorMessage(result.error || t("error"));
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred while sending the message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <div className="flex max-lg:flex-col w-full gap-10 lg:h-[60vh]">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 text-[#000] lg:w-[50%] "
        >
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium  text-[#fff]"
            >
              {t("topic")}
            </label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium  text-[#fff]"
            >
              {t("email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium  text-[#fff]"
            >
              {t("content")}
            </label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
              className="mt-1 block w-full px-4 py-3 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            ></textarea>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className=" text-[#fff] 
      bg-[#EB4036] 
      border-[1px] 
      border-[#EB4036] 
      mt-6
      w-max
      text-[1rem] 
      font-[500] 
      uppercase 
      leading-[1em] 
      tracking-[1.6px] 
      px-[25px] 
      py-[15px] 
      rounded-[0px] 
      transition-all 
      duration-300 
      hover:bg-[#02010100] 
      hover:skew-[-10] transform
      rounded-[5px]
      "
            >
              {isSubmitting ? t("loading") : t("button")}
            </button>
          </div>
        </form>
        <div className="lg:w-[50%] flex flex-col gap-5">
          <h2 className="text-[2.5rem] font-semibold uppercase">
            {t("title")}
          </h2>
          <p className="text-[#A5A5A5]">{t("description")}</p>
        </div>
      </div>
    </Container>
  );
}
