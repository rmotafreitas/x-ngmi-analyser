import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim()) {
      navigate(`/${username.trim()}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">X-NGMI Analyser</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex items-center border-b border-blue-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Enter X username"
            aria-label="X username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Analyse
          </button>
        </div>
      </form>
      <footer className="py-4 text-center text-sm text-gray-600">
        <p>
          Created by{" "}
          <a
            href="https://x.com/rmotafreitas"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            @rmotafreitas
          </a>{" "}
          on X
        </p>
        <p className="mt-1">
          <a
            href="https://github.com/rmotafreitas/x-ngmi-analyser"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            View source on GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
