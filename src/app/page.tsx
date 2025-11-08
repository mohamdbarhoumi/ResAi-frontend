'use client';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-6">
      {/* Hero Section */}
      <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome to <span className="text-blue-600">ResumeAI</span>
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          The all-in-one platform to manage your experience seamlessly.  
          Start by logging into your account or create a new one.
        </p>

        {/* Login Button */}
        <button
          onClick={handleLoginClick}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Get Started
        </button>
      </div>

      {/* Footer or Credits */}
      <footer className="absolute bottom-6 text-sm text-gray-500">
        © {new Date().getFullYear()} ResumeAi. All rights reserved.
      </footer>
    </main>
  );
}
