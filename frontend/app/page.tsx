"use client";

import { useState } from "react";

export default function Home() {

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // Upload PDF
  const handleUpload = async () => {

    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {

      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setMessage(
        `Uploaded: ${data.filename} | Stored Chunks: ${data.stored_chunks}`
      );

    } catch (error) {
      console.error(error);
      setMessage("Upload failed");
    }
  };

  // Ask Question
  const handleQuestion = async () => {

    if (!question) {
      alert("Please enter a question");
      return;
    }

    try {

      const response = await fetch("http://127.0.0.1:8000/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
        }),
      });

      const data = await response.json();

      setAnswer(data.answer);

    } catch (error) {
      console.error(error);
      setAnswer("Failed to get answer");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10">

      <h1 className="text-5xl font-bold mb-6">
        Enterprise Knowledge Assistant
      </h1>

      <p className="text-lg text-gray-300 mb-10">
        Upload PDFs and chat with your documents using AI
      </p>

      <div className="bg-gray-900 p-10 rounded-2xl shadow-xl w-full max-w-2xl">

        {/* Upload PDF */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-3 bg-gray-800 rounded-lg mb-4"
        />

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold mb-6"
        >
          Upload PDF
        </button>

        {message && (
          <p className="mb-6 text-green-400">
            {message}
          </p>
        )}

        {/* Ask Question */}
        <input
          type="text"
          placeholder="Ask a question about your document..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-3 bg-gray-800 rounded-lg mb-4"
        />

        <button
          onClick={handleQuestion}
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold"
        >
          Ask AI
        </button>

        {/* Answer */}
        {answer && (
          <div className="mt-6 bg-gray-800 p-5 rounded-lg">
            <h2 className="text-xl font-bold mb-2">
              AI Answer
            </h2>

            <p className="text-gray-300">
              {answer}
            </p>
          </div>
        )}

      </div>

    </main>
  );
}