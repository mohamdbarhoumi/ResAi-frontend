'use client';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <main className="flex flex-col items-center justify-between min-h-screen bg-gray-100 text-center px-6 py-10">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
          Welcome to <span className="text-blue-600">ResumeAI</span>
        </h1>

        <p className="text-gray-600 mb-8 text-base sm:text-lg max-w-lg">
          The all-in-one platform to manage your experience seamlessly.  
          Start by logging into your account or creating a new one.
        </p>

        <button
          onClick={handleLoginClick}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Get Started
        </button>
      </div>

      {/* Footer */}
      <footer className="text-sm text-gray-500 mt-10">
        © {new Date().getFullYear()} ResumeAi. All rights reserved.
      </footer>
    </main>
  );
}
