// app/resume/builder/components/AIModal.tsx
"use client";

import { useState } from "react";
import { X, Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { useResumeStore } from "../store/resumeStore";

type AIModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (generatedText: string) => void;
  type: "summary" | "experience-bullets" | "project-bullets";
  context?: {
    role?: string;
    company?: string;
    projectTitle?: string;
  };
};

export default function AIModal({
  isOpen,
  onClose,
  onApply,
  type,
  context,
}: AIModalProps) {
  const [userInput, setUserInput] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Get language from store
  const language = useResumeStore((s) => s.language);

  if (!isOpen) return null;

  const getPlaceholder = () => {
    if (language === "fr") {
      switch (type) {
        case "summary":
          return "Exemple: Je suis étudiant en dernière année d'informatique avec une expérience en Spring Boot et Next.js. J'ai construit plusieurs projets full-stack et je cherche un stage en développement backend...";
        case "experience-bullets":
          return "Exemple: J'ai travaillé dans l'équipe backend pour construire des APIs REST avec Spring Boot. J'ai amélioré les performances des requêtes SQL et aidé à former 2 développeurs juniors...";
        case "project-bullets":
          return "Exemple: Ce projet est une plateforme e-commerce construite avec Next.js et PostgreSQL. Il a une authentification utilisateur avec JWT, une intégration de paiement avec Stripe, et un tableau de bord admin...";
      }
    } else {
      switch (type) {
        case "summary":
          return "Example: I'm a final year computer science student with experience in Spring Boot and Next.js. I've built multiple full-stack projects and I'm seeking a backend development internship...";
        case "experience-bullets":
          return "Example: I worked on the backend team building REST APIs with Spring Boot. I improved database query performance by optimizing SQL queries and helped mentor 2 junior developers...";
        case "project-bullets":
          return "Example: This project is an e-commerce platform built with Next.js and PostgreSQL. It has user authentication with JWT, payment integration with Stripe, and an admin dashboard for managing products...";
      }
    }
  };

  const getTitle = () => {
    if (language === "fr") {
      switch (type) {
        case "summary":
          return "Générer un Résumé Professionnel";
        case "experience-bullets":
          return `Générer des Points${context?.role ? ` pour ${context.role}` : ""}`;
        case "project-bullets":
          return `Générer des Points${context?.projectTitle ? ` pour ${context.projectTitle}` : ""}`;
      }
    } else {
      switch (type) {
        case "summary":
          return "Generate Professional Summary";
        case "experience-bullets":
          return `Generate Bullets${context?.role ? ` for ${context.role}` : ""}`;
        case "project-bullets":
          return `Generate Bullets${context?.projectTitle ? ` for ${context.projectTitle}` : ""}`;
      }
    }
  };

  const getPromptLabel = () => {
    if (language === "fr") {
      switch (type) {
        case "summary":
          return "Parlez-nous de vous et du poste que vous recherchez:";
        case "experience-bullets":
          return "Décrivez ce que vous avez fait dans ce rôle (responsabilités, réalisations, impact):";
        case "project-bullets":
          return "Décrivez votre projet (ce que vous avez construit, technologies utilisées, fonctionnalités clés):";
      }
    } else {
      switch (type) {
        case "summary":
          return "Tell us about yourself and what role you're seeking:";
        case "experience-bullets":
          return "Describe what you did in this role (responsibilities, achievements, impact):";
        case "project-bullets":
          return "Describe your project (what you built, technologies used, key features):";
      }
    }
  };

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      setError(language === "fr" ? "Veuillez entrer une description d'abord" : "Please enter a description first");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedText("");

    try {
      const token = localStorage.getItem("token");
      
      let endpoint = "";
      switch (type) {
        case "summary":
          endpoint = "generate-summary";
          break;
        case "experience-bullets":
          endpoint = "generate-experience-bullets";
          break;
        case "project-bullets":
          endpoint = "generate-project-bullets";
          break;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userInput,
          context,
          language, // Send language to backend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate content");
      }

      const data = await response.json();
      setGeneratedText(data.generatedText);
    } catch (err: any) {
      console.error("AI generation error:", err);
      setError(err.message || (language === "fr" ? "Échec de génération. Veuillez réessayer." : "Failed to generate content. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (generatedText) {
      onApply(generatedText);
      handleClose();
    }
  };

  const handleClose = () => {
    setUserInput("");
    setGeneratedText("");
    setError("");
    onClose();
  };

  const handleTryAgain = () => {
    setGeneratedText("");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{getTitle()}</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {!generatedText ? (
            <>
              {/* Input Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getPromptLabel()}
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={getPlaceholder()}
                  rows={6}
                  className="input"
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !userInput.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {language === "fr" ? "Génération..." : "Generating..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {language === "fr" ? "Générer avec l'IA" : "Generate with AI"}
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* Generated Result */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ✨ {language === "fr" ? "Contenu Généré:" : "Generated Content:"}
                </label>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                    {generatedText}
                  </pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleTryAgain}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  <RefreshCw className="w-5 h-5" />
                  {language === "fr" ? "Réessayer" : "Try Again"}
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                >
                  {language === "fr" ? "Utiliser Ceci" : "Use This"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          <p className="text-xs text-gray-500 text-center">
            💡 {language === "fr" 
              ? "Astuce: Soyez spécifique sur vos réalisations et utilisez des chiffres quand possible pour de meilleurs résultats"
              : "Tip: Be specific about your achievements and use numbers when possible for better results"}
          </p>
        </div>
      </div>
    </div>
  );
}