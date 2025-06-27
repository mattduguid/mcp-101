from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from pydantic import BaseModel

from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.node_parser import SimpleNodeParser
from llama_index.llms.ollama import Ollama
from llama_index.readers.web import BeautifulSoupWebReader
from llama_index.core.query_engine import RetrieverQueryEngine
from llama_index.embeddings.ollama import OllamaEmbedding
from llama_index.core.settings import Settings
from llama_index.core.schema import Document

# Setup verbose embedding for debugging
class VerboseOllamaEmbedding(OllamaEmbedding):
    def _get_text_embedding(self, text: str):
        print("🔍 Embedding chunk:", text[:80].replace("\n", " ") + "...")
        return super()._get_text_embedding(text)

# Choose your embedding model (Ollama local model)
Settings.embed_model = VerboseOllamaEmbedding(model_name="nomic-embed-text")
# Settings.embed_model = VerboseOllamaEmbedding(model_name="mistral")

print("🔁 Loading documents...")

# Load local documents from ./data
local_docs = SimpleDirectoryReader(input_dir="./data").load_data()
for doc in local_docs:
    doc.metadata["source"] = "file"

# Load specific web URLs
urls = [
    "https://en.wikipedia.org/wiki/Porirua",
    "https://docs.driesventer.com/"
]
web_docs = BeautifulSoupWebReader().load_data(urls)
for doc in web_docs:
    doc.metadata["source"] = "web"

# Combine & truncate large documents
documents = local_docs + web_docs
truncated_documents = []
for doc in documents:
    text = doc.text[:3000] if len(doc.text) > 3000 else doc.text
    truncated_documents.append(Document(text=text, metadata=doc.metadata))

# Chunking and indexing
parser = SimpleNodeParser.from_defaults(chunk_size=512, chunk_overlap=50)
nodes = parser.get_nodes_from_documents(truncated_documents)

llm = Ollama(
    model="mistral",
    system_prompt="Only answer using the content from the provided documents (files and websites). "
                  "Do not make anything up. If you don't know, reply: 'Not found in the provided sources.'"
)

index = VectorStoreIndex(nodes)
retriever = index.as_retriever(similarity_top_k=5)
query_engine = RetrieverQueryEngine.from_args(
    retriever=retriever,
    llm=llm,
    response_mode="compact",
    verbose=True
)

# Create FastAPI app with CORS enabled
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (good for testing)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Add GET / to prevent VS Code 404 error
@app.get("/")
def read_root():
    return {"message": "MCP server running. Use POST /ask to query."}

# POST endpoint to handle questions
class AskRequest(BaseModel):
    query: str

@app.post("/ask")
async def ask(request: AskRequest):
    print(f"💬 Incoming: {request.query}")
    result = query_engine.query(request.query)
    return {"answer": result.response}

# Launch server
if __name__ == "__main__":
    print("🚀 Serving on http://localhost:8000/ask")
    uvicorn.run("main:app", port=8000, reload=True)
