# Enterprise Knowledge Assistant with RAG

An AI-powered Enterprise Knowledge Assistant built using Retrieval-Augmented Generation (RAG) for semantic document search and contextual question answering.

## Features

- Upload PDF documents
- Extract and process text
- Semantic search using vector embeddings
- AI-powered question answering
- Local LLM integration using Ollama
- FastAPI backend
- Next.js frontend
- ChromaDB vector database

---

## Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS

### Backend
- FastAPI
- Python

### AI & RAG
- Ollama
- Phi3 / Llama3
- Sentence Transformers
- ChromaDB

---

## Project Architecture

User Uploads PDF
↓
FastAPI Backend
↓
PDF Text Extraction
↓
Chunking & Embedding Generation
↓
ChromaDB Vector Storage
↓
Semantic Retrieval
↓
Ollama LLM Response
↓
Answer Displayed in Next.js Frontend

---

## Setup Instructions

### Clone Repository

```bash
git clone https://github.com/srinavyaa/Enterprise-Knowledge-Assistant-RAG.git
```

---

### Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## Future Improvements

- Streaming AI responses
- Multi-document querying
- Authentication & user management
- Cloud deployment
- Improved retrieval ranking
- Chat history persistence

---

## Author

Navya Sri Bandlamudi