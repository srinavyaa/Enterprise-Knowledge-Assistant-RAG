from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
import os
import fitz
import requests
import chromadb
import ollama

from sentence_transformers import SentenceTransformer

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

model = SentenceTransformer("all-MiniLM-L6-v2")

client = chromadb.Client()

collection = client.create_collection(name="documents")


def chunk_text(text, chunk_size=700, overlap=100):
    chunks = []

    start = 0

    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]

        chunks.append(chunk)

        start += chunk_size - overlap

    return chunks


@app.get("/")
def home():
    return {"message": "Enterprise RAG backend running"}


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)

    extracted_text = ""

    doc = fitz.open(file_path)

    for page_number, page in enumerate(doc):
        text = page.get_text()

        print(f"\nPAGE {page_number + 1}\n")
        print(text[:300])

        extracted_text += text

    chunks = chunk_text(extracted_text)

    embeddings = model.encode(chunks).tolist()

    for index, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        collection.add(
            documents=[chunk],
            embeddings=[embedding],
            ids=[f"{file.filename}_{index}"],
            metadatas=[{"chunk_index": index}]
        )

    return {
        "filename": file.filename,
        "stored_chunks": len(chunks)
    }


from pydantic import BaseModel

class QueryRequest(BaseModel):
    question: str


@app.post("/query")
async def query(request: QueryRequest):

    question = request.question

    results = collection.query(
        query_texts=[question],
        n_results=1
    )

    context = " ".join(results["documents"][0])

    prompt = f"""
    Answer briefly in 2-3 lines based on the context below.

    Context:
    {context}

    Question:
    {question}
    """

    response = ollama.chat(
        model="phi3",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    answer = response["message"]["content"]

    return {
        "question": question,
        "answer": answer,
        "sources": results["documents"][0]
    }